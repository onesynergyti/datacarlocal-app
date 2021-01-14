export class ConfiguracaoManualUso {
  ConfiguracaoInicial: boolean = false
  ConfiguracaoImpressora: boolean = false
  DataInicioUsoApp: Date

  constructor(configuracaoManualUso: ConfiguracaoManualUso = null) {
    if (configuracaoManualUso != null) {
      this.ConfiguracaoInicial = configuracaoManualUso.ConfiguracaoInicial
      this.ConfiguracaoImpressora = configuracaoManualUso.ConfiguracaoImpressora
      this.DataInicioUsoApp = configuracaoManualUso.DataInicioUsoApp
    }
  }
}
