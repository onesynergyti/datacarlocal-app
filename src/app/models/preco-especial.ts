export class PrecoEspecial {
  TipoVeiculo: number = 0
  Minutos: number = 0
  Valor: number = 0

  constructor(precoEspecial: PrecoEspecial = null) {
    if (precoEspecial != null) {
      this.TipoVeiculo = precoEspecial.TipoVeiculo
      this.Minutos = precoEspecial.Minutos
      this.Valor = precoEspecial.Valor
    }
  }
}
