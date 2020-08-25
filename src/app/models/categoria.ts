export class Categoria {
  Id: number = 0
  Nome: string = ''

  constructor(categoria: Categoria) {
    if (categoria != null) {
      this.Id = categoria.Id
      this.Nome = categoria.Nome
    }
  }
}
