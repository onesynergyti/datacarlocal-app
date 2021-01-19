export class ConfiguracaoManualUso {
  ConfiguracaoInicial: boolean = false
  ConfiguracaoImpressora: boolean = false
  DataInicioUsoApp: Date
  EnviouDadosUsuario: boolean = false

  constructor(configuracaoManualUso: ConfiguracaoManualUso = null) {
    if (configuracaoManualUso != null) {
      this.ConfiguracaoInicial = configuracaoManualUso.ConfiguracaoInicial
      this.ConfiguracaoImpressora = configuracaoManualUso.ConfiguracaoImpressora
      this.DataInicioUsoApp = configuracaoManualUso.DataInicioUsoApp
      this.EnviouDadosUsuario = configuracaoManualUso.EnviouDadosUsuario
    }
  }
}
