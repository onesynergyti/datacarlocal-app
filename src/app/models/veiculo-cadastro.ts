export class VeiculoCadastro {
  Placa: string = ''
  TipoVeiculo: number
  Modelo: string = ''
  Nome: string = ''
  Telefone: string = ''

  constructor(veiculo: VeiculoCadastro = null) {
    if (veiculo != null) {
      this.Placa = veiculo.Placa
      this.TipoVeiculo = veiculo.TipoVeiculo
      this.Modelo = veiculo.Modelo
      this.Nome = veiculo.Nome
      this.Telefone = veiculo.Telefone
    }
  }
}
