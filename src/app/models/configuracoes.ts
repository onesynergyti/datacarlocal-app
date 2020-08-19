import { ConfiguracaoEstacionamento as ConfiguracaoEstacionamento } from './configuracao-estacionamento'
import { Estabelecimento } from './estabelecimento'
import { ConfiguracaoRecibo } from './configuracao-recibo'
import { ConfiguracaoPatio } from './configuracao-patio'
import { ConfiguracaoSeguranca } from './configuracao-seguranca'
import { ConfiguracaoManualUso } from './configuracao-manual-uso'
import { ConfiguracaoMensagens } from './configuracao-mensagens'
import { ConfiguracaoPortal } from './configuracao-portal'

export class Configuracoes {
  Recibo: ConfiguracaoRecibo = new ConfiguracaoRecibo()
  Estabelecimento: Estabelecimento = new Estabelecimento()
  Estacionamento: ConfiguracaoEstacionamento = new ConfiguracaoEstacionamento()
  Patio: ConfiguracaoPatio = new ConfiguracaoPatio()
  Seguranca: ConfiguracaoSeguranca = new ConfiguracaoSeguranca()
  ManualUso: ConfiguracaoManualUso = new ConfiguracaoManualUso()
  Mensagens: ConfiguracaoMensagens = new ConfiguracaoMensagens()
  Portal: ConfiguracaoPortal = new ConfiguracaoPortal()

  constructor(configuracoes: Configuracoes) {
    if (configuracoes != null) {
      this.Recibo = new ConfiguracaoRecibo(configuracoes.Recibo)
      this.Estabelecimento = new Estabelecimento(configuracoes.Estabelecimento)
      this.Estacionamento = new ConfiguracaoEstacionamento(configuracoes.Estacionamento)
      this.Patio = new ConfiguracaoPatio(configuracoes.Patio)
      this.Seguranca = new ConfiguracaoSeguranca(configuracoes.Seguranca)
      this.ManualUso = new ConfiguracaoManualUso(configuracoes.ManualUso)
      this.Mensagens = new ConfiguracaoMensagens(configuracoes.Mensagens)
      this.Portal = new ConfiguracaoPortal(configuracoes.Portal)
    }
  }
}