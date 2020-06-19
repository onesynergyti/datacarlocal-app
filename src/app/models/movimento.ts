import { Veiculo } from './veiculo'

export class Movimento {
  Id: number = 0
  Data: Date = new Date()
  Descricao: string
  TipoVeiculo: number
  ValorDinheiro: number = 0
  ValorDebito: number = 0
  ValorCredito: number = 0
  Veiculos: Veiculo[] = []

  constructor(movimento: Movimento = null) {
    if (movimento != null) {
      this.Id = movimento.Id 
      this.Data = movimento.Data ? new Date(movimento.Data) : new Date()
      this.Descricao = movimento.Descricao
      this.TipoVeiculo = movimento.TipoVeiculo
      this.ValorCredito = movimento.ValorCredito
      this.ValorDebito = movimento.ValorDebito
      this.ValorDinheiro = movimento.ValorDinheiro
      this.Veiculos = movimento.Veiculos.slice()
    }
  }

  get Valor() {
    return this.ValorCredito + this.ValorDebito + this.ValorDinheiro
  }

  get servicosConsolidados() {
    let servicos = []

    this.Veiculos.forEach(veiculoAtual => {
      veiculoAtual.Servicos.forEach(servicoAtual => {
        let servicoLocalizado = servicos.find(servicoAtual => servicoAtual.Id = servicoAtual.Id)
        // Se não existir o serviço cria
        if (servicoLocalizado == null) {
          servicos.push(servicoLocalizado)
        }
        // Se existir atualiza o valor
        else {
          servicoLocalizado.Valor = servicoLocalizado.Valor + veiculoAtual.precoServico(servicoAtual)
        }
      })
    });

    return servicos
  }

  get TotalServicos() {
    return this.Veiculos.reduce((acumulador, veiculoAtual) => acumulador + veiculoAtual.TotalServicos, 0)
  }
}
