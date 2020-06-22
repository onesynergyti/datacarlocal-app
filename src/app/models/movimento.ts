import { Veiculo } from './veiculo'
import { ServicoVeiculo } from './servico-veiculo'

export class Movimento {
  Id: number = 0
  Data: Date = new Date()
  Descricao: string
  TipoVeiculo: number
  ValorDinheiro: number = 0
  ValorDebito: number = 0
  ValorCredito: number = 0
  Veiculos: Veiculo[] = []
  IdMensalista: number = 0
  Inicio: Date
  Fim: Date

  constructor(movimento: Movimento = null) {
    if (movimento != null) {
      this.Id = movimento.Id 
      this.Data = movimento.Data ? new Date(movimento.Data) : new Date()
      this.Descricao = movimento.Descricao
      this.TipoVeiculo = movimento.TipoVeiculo
      this.ValorCredito = movimento.ValorCredito
      this.ValorDebito = movimento.ValorDebito
      this.ValorDinheiro = movimento.ValorDinheiro
      this.Veiculos = movimento.Veiculos ? movimento.Veiculos.slice() : []
      this.IdMensalista = movimento.IdMensalista
      this.Inicio = movimento.Inicio ? new Date(movimento.Inicio) : null
      this.Fim = movimento.Fim ? new Date(movimento.Fim) : null
    }
  }

  get Valor() {
    return this.ValorCredito + this.ValorDebito + this.ValorDinheiro
  }

  get servicosConsolidados(): ServicoVeiculo[] {
    let servicos = []

    this.Veiculos.forEach(veiculoAtual => {
      veiculoAtual.Servicos.forEach(servicoAtual => {
        let servicoLocalizado = servicos.find(servicoAtualConsolidado => servicoAtualConsolidado.Id == servicoAtual.Id)
        // Se não existir o serviço cria
        if (servicoLocalizado == null) {
          servicos.push(new ServicoVeiculo(servicoAtual))
        }
        // Se existir atualiza o valor
        else {
          servicoLocalizado.PrecoMoto = servicoLocalizado.PrecoMoto + servicoAtual.PrecoMoto
          servicoLocalizado.PrecoVeiculoPequeno = servicoLocalizado.PrecoVeiculoPequeno + servicoAtual.PrecoVeiculoPequeno
          servicoLocalizado.PrecoVeiculoMedio = servicoLocalizado.PrecoVeiculoMedio + servicoAtual.PrecoVeiculoMedio
          servicoLocalizado.PrecoVeiculoGrande = servicoLocalizado.PrecoVeiculoGrande + servicoAtual.PrecoVeiculoGrande          
        }
      })
    });

    return servicos
  }

  get TotalServicos() {
    return this.Veiculos.reduce((acumulador, veiculoAtual) => acumulador + veiculoAtual.TotalServicos, 0)
  }
}
