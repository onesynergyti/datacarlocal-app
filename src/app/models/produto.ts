export class Produto {
  Id: number = 0
  Nome: string = ''
  Preco: number = 0
  EstoqueAtual: number = 0
  EstoqueMinimo: number = 0
  Codigo: string = ''

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
