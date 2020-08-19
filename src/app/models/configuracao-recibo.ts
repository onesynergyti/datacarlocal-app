export class ConfiguracaoRecibo {
  CaractersImpressao: number = 32
  ExibirCNPJ: boolean = true
  EnderecoLinha1: string
  EnderecoLinha2: string
  ImprimirReciboEntrada: boolean = true
  ImprimirReciboSaida: boolean = true
  MensagemReciboEntrada: string = 'AGRADECEMOS A PREFERÊNCIA'
  MensagemReciboSaida: string = 'VOLTE SEMPRE'
  ExibirTelefoneRodape: boolean = true

  constructor(configuracaoRecibo: ConfiguracaoRecibo = null) {
    if (configuracaoRecibo != null) {
      this.CaractersImpressao = configuracaoRecibo.CaractersImpressao
      this.ExibirCNPJ = configuracaoRecibo.ExibirCNPJ
      this.EnderecoLinha1 = configuracaoRecibo.EnderecoLinha1
      this.EnderecoLinha2 = configuracaoRecibo.EnderecoLinha2
      this.ImprimirReciboEntrada = configuracaoRecibo.ImprimirReciboEntrada
      this.ImprimirReciboSaida = configuracaoRecibo.ImprimirReciboSaida
      this.MensagemReciboEntrada = configuracaoRecibo.MensagemReciboEntrada
      this.MensagemReciboSaida = configuracaoRecibo.MensagemReciboSaida
      this.ExibirTelefoneRodape = configuracaoRecibo.ExibirTelefoneRodape
    }
  }
}
