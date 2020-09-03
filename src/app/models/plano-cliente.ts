import { Servico } from './servico'
import { Cliente } from './cliente'

export class PlanoCliente {
  Id: number = 0
  Documento: string
  Cliente: Cliente
  Servico: Servico
  ValidadeInicial: Date = new Date()
  ValidadeFinal: Date = new Date()
  Quantidade: number = 0
  ValorDinheiro: number = 0
  ValorDebito: number = 0
  ValorCredito: number = 0
  Placas: string[] = []

  constructor(planoCliente: PlanoCliente = null) {
    if (planoCliente != null) {
      this.Id = planoCliente.Id
      this.Documento = planoCliente.Documento
      this.Cliente = new Cliente(planoCliente.Cliente)
      this.Servico = new Servico(planoCliente.Servico)
      this.ValidadeInicial = new Date(planoCliente.ValidadeInicial)
      this.ValidadeFinal = new Date(planoCliente.ValidadeFinal)
      this.Quantidade = planoCliente.Quantidade
      this.ValorDinheiro = planoCliente.ValorDinheiro
      this.ValorDebito = planoCliente.ValorDebito
      this.ValorCredito = planoCliente.ValorCredito
      this.Placas = planoCliente.Placas != null ? planoCliente.Placas.slice() : []
    }
    else {
      this.Cliente = new Cliente()
      this.Servico = new Servico()
    }
  }
}
