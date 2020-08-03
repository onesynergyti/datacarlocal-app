export class Produto {
  Id: number
  Nome: string
  Preco: number
  EstoqueAtual: number
  EstoqueMinimo: number
  Codigo: string

  constructor(produto: Produto = null) {
    if (produto != null) {
      this.Id = produto.Id
      this.Nome = produto.Nome
      this.Preco = produto.Preco
      this.EstoqueAtual = produto.EstoqueAtual
      this.EstoqueMinimo = produto.EstoqueMinimo
      this.Codigo = produto.Codigo
    }
  }
}
