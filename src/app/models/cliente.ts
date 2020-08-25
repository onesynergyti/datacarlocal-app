import { Categoria } from './categoria'

export class Cliente {
  Id: number = 0
  Nome: string = ''
  Documento: string = ''
  Telefone: string = ''
  Email: string = ''
  Categoria: Categoria

  constructor(cliente: Cliente = null) {
    if (cliente != null) {
      this.Id = cliente.Id 
      this.Nome = cliente.Nome
      this.Documento = cliente.Documento
      this.Telefone = cliente.Telefone
      this.Email = cliente.Email
      this.Categoria = cliente.Categoria
    }
  }
}
