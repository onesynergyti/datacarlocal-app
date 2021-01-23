export class UsuarioApp {
    Documento: string
    NomeEstabelecimento: string
    Endereco: string  
    Telefone: string
    EmailAdministrador: string
    Premmium: boolean = false

    constructor(usuarioApp: UsuarioApp = null) {
      if (usuarioApp != null) {
        this.Documento = usuarioApp.Documento 
        this.NomeEstabelecimento = usuarioApp.NomeEstabelecimento
        this.Endereco = usuarioApp.Endereco
        this.Telefone = usuarioApp.Telefone
        this.EmailAdministrador = usuarioApp.EmailAdministrador
      }
    }
  }

