import { ServicoVeiculo } from './servico-veiculo'
import { Funcionario } from './funcionario'
import { Avaria } from './avaria'

export class Veiculo {
  Id: number = 0
  Placa: string = ''
  Modelo: string = ''
  Entrada: Date = new Date()
  Saida: Date
  TipoVeiculo: number = 0
  Observacoes: string
  Telefone: string = ''
  Nome: string = ''
  Servicos: ServicoVeiculo[] = []
  EntregaAgendada: boolean = false
  PrevisaoEntrega: Date
  Funcionario: Funcionario
  Localizacao: string = ''
  Ativo: boolean = true
  IdMensalista: number = 0
  CodigoCartao: string = ''
  Avarias: Avaria[] = []
  ImagemAvaria: string = ''

  constructor(veiculo: Veiculo = null) {
    if (veiculo != null) {
      this.Id = veiculo.Id
      this.Placa = veiculo.Placa 
      this.Modelo = veiculo.Modelo
      this.Entrada = veiculo.Entrada != null ? new Date(veiculo.Entrada) : new Date()
      this.Saida = veiculo.Saida != null ? new Date(veiculo.Saida) : null
      this.TipoVeiculo = veiculo.TipoVeiculo
      this.Observacoes = veiculo.Observacoes
      this.Telefone = veiculo.Telefone
      this.Nome = veiculo.Nome
      this.Servicos = []
      if (veiculo.Servicos != null) {
        veiculo.Servicos.forEach(servicoVeiculoAtual => {
          this.Servicos.push(new ServicoVeiculo(servicoVeiculoAtual))
        })
      }
      this.EntregaAgendada = veiculo.EntregaAgendada
      this.PrevisaoEntrega = veiculo.PrevisaoEntrega != null ? new Date(veiculo.PrevisaoEntrega) : new Date()
      this.Funcionario = veiculo.Funcionario != null ? new Funcionario(veiculo.Funcionario) : null
      this.Localizacao = veiculo.Localizacao
      this.Ativo = veiculo.Ativo
      this.IdMensalista = veiculo.IdMensalista
      this.CodigoCartao = veiculo.CodigoCartao
      this.Avarias = []
      if (veiculo.Avarias != null) {
        veiculo.Avarias.forEach(avariaAtual => {
          this.Avarias.push(new Avaria(avariaAtual))
        })
      }
      this.ImagemAvaria = veiculo.ImagemAvaria
    }
  }

  get MinutosRestantes() {
    return this.PrevisaoEntrega != null ? ((this.PrevisaoEntrega.getTime() - new Date().getTime()) / 60000) : 0
  }

  get PossuiServicoAgendavel() {
    return this.Servicos.find(itemAtual => itemAtual.Id != 0) 
  }

  get PossuiServicoEstacionamento() {
    return this.Servicos.find(itemAtual => itemAtual.Id == 0) 
  }

  get PossuiServicosPendentes() {
    return this.Servicos.find(itemAtual => !itemAtual.Executado && itemAtual.Id) != null 
  }

  precoServico(servico: ServicoVeiculo): number{
    return servico.precoServico(this.TipoVeiculo)
  }

  plural(valor) {
    return valor != 1 ? 's' : ''
  }

  get tempoPermanencia() {
    const diferenca = Math.floor(this.Saida.getTime() / 60000) - Math.floor(this.Entrada.getTime() / 60000)
    
    // Calcula os dias
    const dias = Math.floor(diferenca / 1440) // Dias
    let sobra = diferenca % 1440

    // Calcula os horas
    const horas = Math.floor(sobra / 60) // horas
    sobra = diferenca % 60

    // Calcula os minutos
    const minutos = Math.round(sobra) // minutos

    if (dias > 0)
      return `${dias} dia${this.plural(dias)} ${horas} hora${this.plural(horas)} e ${minutos} minuto${this.plural(minutos)}`
    else if (horas > 0)
      return `${horas} hora${this.plural(horas)} e ${minutos} minuto${this.plural(minutos)}`
    else
      return `${minutos} minuto${this.plural(minutos)}`
  }

  get TotalServicos() {
    return this.Servicos.reduce((acumulador: number, itemAtual) => acumulador + this.precoServico(itemAtual), 0)
  }

  get TotalDescontos() {
    return this.Servicos.reduce((acumulador: number, itemAtual) => acumulador + itemAtual.Desconto, 0)
  }

  get TotalAcrescimos() {
    return this.Servicos.reduce((acumulador: number, itemAtual) => acumulador + itemAtual.Acrescimo, 0)
  }
}
