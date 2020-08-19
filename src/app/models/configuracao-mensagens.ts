export class ConfiguracaoMensagens {
  ConclusaoServicos: string = 'Informamos que os serviços realizados no seu veículo <PLACA> já foram finalizados e o mesmo encontra-se disponível para retirada.'
  WhatsAppBusinnes: boolean = false

  constructor(configuracaoMensagens: ConfiguracaoMensagens = null) {
    if (configuracaoMensagens != null) {
      this.ConclusaoServicos = configuracaoMensagens.ConclusaoServicos
      this.WhatsAppBusinnes = configuracaoMensagens.WhatsAppBusinnes
    }
  }
}
