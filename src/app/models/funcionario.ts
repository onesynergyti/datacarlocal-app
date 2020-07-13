export class Funcionario {
  Id: number = 0
  Nome: string = ''
  Documento: string
  Telefone: string  
  Email: string
  Ativo: boolean = true

  constructor(funcionario: Funcionario = null) {
    if (funcionario != null) {
      this.Id = funcionario.Id 
      this.Nome = funcionario.Nome
      this.Documento = funcionario.Documento
      this.Telefone = funcionario.Telefone
      this.Email = funcionario.Email
      this.Ativo = funcionario.Ativo
    }
  }
}