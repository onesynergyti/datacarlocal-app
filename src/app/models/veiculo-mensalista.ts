export class VeiculoMensalista {
  Placa: string
  TipoVeiculo: number
  Modelo: string

  constructor(veiculo: VeiculoMensalista) {
    if (veiculo != null) {
      this.Placa = veiculo.Placa
      this.TipoVeiculo = veiculo.TipoVeiculo
      this.Modelo = veiculo.Modelo
    }
  }
}
