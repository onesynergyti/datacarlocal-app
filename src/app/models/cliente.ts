import { Categoria } from './categoria'

export class Cliente {
  Nome: string = ''
  Documento: string = ''
  Telefone: string = ''
  Email: string = ''
  Categoria: Categoria
  Nascimento: Date

  constructor(cliente: Cliente = null) {
    if (cliente != null) {
      this.Nome = cliente.Nome
      this.Documento = cliente.Documento
      this.Telefone = cliente.Telefone
      this.Email = cliente.Email
      this.Categoria = cliente.Categoria
      this.Nascimento = cliente.Nascimento != null ? new Date(cliente.Nascimento) : null
    }
  }
}
