export class ServicoVeiculo {
  Id: number
  Nome: string
  PrecoMoto: number = 0
  PrecoVeiculoPequeno: number = 0
  PrecoVeiculoMedio: number = 0
  PrecoVeiculoGrande: number = 0
  Executado: boolean

  constructor(servicoVeiculo: ServicoVeiculo = null) {
    if (servicoVeiculo != null) {
      this.Id = servicoVeiculo.Id
      this.Nome = servicoVeiculo.Nome
      this.PrecoMoto = servicoVeiculo.PrecoMoto
      this.PrecoVeiculoPequeno = servicoVeiculo.PrecoVeiculoPequeno
      this.PrecoVeiculoMedio = servicoVeiculo.PrecoVeiculoMedio
      this.PrecoVeiculoGrande = servicoVeiculo.PrecoVeiculoGrande
      this.Executado = servicoVeiculo.Executado
    }
  }
}
