export class ConfiguracaoPortal {
  SincronizarInformacoes: string = 'offline'

  constructor(configuracaoPortal: ConfiguracaoPortal = null) {
    if (configuracaoPortal != null) {
      this.SincronizarInformacoes = configuracaoPortal.SincronizarInformacoes
    }
  }
}
