import { ServicoVeiculo } from './servico-veiculo'
import { Funcionario } from './funcionario'

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
  IdMensalista : number = 0

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
