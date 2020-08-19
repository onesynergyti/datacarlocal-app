export class Servico {
  Id: number = 0
  Nome: string = ''
  PrecoPadrao: number = 0
  PrecoMoto: number = 0
  PrecoMotoPequena: number = 0
  PrecoMotoGrande: number = 0
  PrecoVeiculoPequeno: number = 0
  PrecoVeiculoMedio: number = 0
  PrecoVeiculoGrande: number = 0

  constructor(servico: Servico = null) {
    if (servico != null) {
      this.Id = servico.Id
      this.Nome = servico.Nome
      this.PrecoPadrao = servico.PrecoPadrao != null ? servico.PrecoPadrao : 0
      this.PrecoMotoPequena = servico.PrecoMotoPequena != null ? servico.PrecoMotoPequena : 0
      this.PrecoMoto = servico.PrecoMoto != null ? servico.PrecoMoto : 0
      this.PrecoMotoGrande = servico.PrecoMotoGrande != null ? servico.PrecoMotoGrande : 0
      this.PrecoVeiculoPequeno = servico.PrecoVeiculoPequeno != null ? servico.PrecoVeiculoPequeno : 0
      this.PrecoVeiculoMedio = servico.PrecoVeiculoMedio != null ? servico.PrecoVeiculoMedio : 0
      this.PrecoVeiculoGrande = servico.PrecoVeiculoGrande != null ? servico.PrecoVeiculoGrande : 0
    }
  }
}
