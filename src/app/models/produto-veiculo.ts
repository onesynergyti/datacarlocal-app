export class ProdutoVeiculo {
  Id: number
  Nome: string
  Preco: number

  constructor(produtoVeiculo: ProdutoVeiculo = null) {
    if (produtoVeiculo != null) {
      this.Id = produtoVeiculo.Id
      this.Nome = produtoVeiculo.Nome
      this.Preco = produtoVeiculo.Preco
    }
  }
}
