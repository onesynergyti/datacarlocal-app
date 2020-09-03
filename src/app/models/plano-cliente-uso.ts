export class PlanoClienteUso {
  IdPlano: number = 0
  Data: Date = new Date()
  Placa: string = ''
  IdVeiculo: number = 0

  constructor(planoClienteUso: PlanoClienteUso = null) {
    if (planoClienteUso != null) {
      this.IdPlano = planoClienteUso.IdPlano
      this.Data = planoClienteUso.Data != null ? new Date(planoClienteUso.Data) : new Date()
      this.Placa = planoClienteUso.Placa
      this.IdVeiculo = planoClienteUso.IdVeiculo
    }
  }
}
