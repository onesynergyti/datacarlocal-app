import { Categoria } from './categoria'
import { PlanoCliente } from './plano-cliente'

export class Cliente {
  Id: number = 0
  Nome: string = ''
  Documento: string = ''
  Telefone: string = ''
  Email: string = ''
  Categoria: Categoria
  Nascimento: Date
  Planos: PlanoCliente[] = []

  constructor(cliente: Cliente = null) {
    if (cliente != null) {
      this.Id = cliente.Id
      this.Nome = cliente.Nome
      this.Documento = cliente.Documento
      this.Telefone = cliente.Telefone
      this.Email = cliente.Email
      this.Categoria = cliente.Categoria
      this.Nascimento = cliente.Nascimento != null ? new Date(cliente.Nascimento) : null
      if (cliente.Planos != null) {
        cliente.Planos.forEach(plano => {
          this.Planos.push(new PlanoCliente(plano))
        })
      }
    }
  }
}
