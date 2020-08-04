export class ProdutoVeiculo {
  Id: number = 0
  Nome: string = ''
  Preco: number = 0
  Acrescimo: number = 0
  Desconto: number = 0
  Quantidade: number = 1

  constructor(produtoVeiculo: ProdutoVeiculo = null) {
    if (produtoVeiculo != null) {
      this.Id = produtoVeiculo.Id
      this.Nome = produtoVeiculo.Nome
      this.Preco = produtoVeiculo.Preco
      this.Acrescimo = produtoVeiculo.Acrescimo
      this.Desconto = produtoVeiculo.Desconto
      this.Quantidade = produtoVeiculo.Quantidade
    }
  }

  get precoFinal() {
    return this.Preco * this.Quantidade + this.Acrescimo - this.Desconto
  }
}
