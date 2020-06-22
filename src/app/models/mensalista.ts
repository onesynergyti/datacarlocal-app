import { VeiculoCadastro } from './veiculo-cadastro'

export class Mensalista {
  Id: number = 0
  Nome: string
  Documento: string
  Valor: number
  Telefone: string
  Email: string
  Ativo: boolean = true
  Veiculos: VeiculoCadastro[] = []

  constructor(mensalista: Mensalista = null) {
    if (mensalista != null) {
      this.Id = mensalista.Id 
      this.Nome = mensalista.Nome
      this.Documento = mensalista.Documento
      this.Valor = mensalista.Valor
      this.Telefone = mensalista.Telefone
      this.Email = mensalista.Email
      this.Ativo = mensalista.Ativo
      this.Veiculos = mensalista.Veiculos.slice()
    }
  }
}
