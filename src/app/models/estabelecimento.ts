export class Estabelecimento {
  Documento: string = ''
  Nome: string = ''
  Endereco: string = ''
  Telefone: string = ''

  constructor(estabelecimento: Estabelecimento = null) {
    if (estabelecimento != null) {
      this.Documento = estabelecimento.Documento
      this.Nome = estabelecimento.Nome
      this.Endereco = estabelecimento.Endereco
      this.Telefone = estabelecimento.Telefone
    }
  }
}
