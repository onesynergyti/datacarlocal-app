export class ServicoVeiculo {
  Id: number = 0
  Nome: string = ''
  PrecoMoto: number = 0
  PrecoVeiculoPequeno: number = 0
  PrecoVeiculoMedio: number = 0
  PrecoVeiculoGrande: number = 0
  Executado: boolean
  Desconto: number = 0
  Acrescimo: number = 0

  constructor(servicoVeiculo: ServicoVeiculo = null) {
    if (servicoVeiculo != null) {
      this.Id = servicoVeiculo.Id
      this.Nome = servicoVeiculo.Nome
      this.PrecoMoto = servicoVeiculo.PrecoMoto
      this.PrecoVeiculoPequeno = servicoVeiculo.PrecoVeiculoPequeno
      this.PrecoVeiculoMedio = servicoVeiculo.PrecoVeiculoMedio
      this.PrecoVeiculoGrande = servicoVeiculo.PrecoVeiculoGrande
      this.Executado = servicoVeiculo.Executado
      this.Desconto = servicoVeiculo.Desconto
      this.Acrescimo = servicoVeiculo.Acrescimo
    }
  }

  precoServico(tipoVeiculo) {
    switch(tipoVeiculo) {
      case 1: return this.PrecoMoto + this.Acrescimo - this.Desconto
      case 2: return this.PrecoVeiculoPequeno + this.Acrescimo - this.Desconto
      case 3: return this.PrecoVeiculoMedio + this.Acrescimo - this.Desconto
      case 4: return this.PrecoVeiculoGrande + this.Acrescimo - this.Desconto
      default: return 0
    }
  }
}
