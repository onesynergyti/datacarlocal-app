import { ConfiguracaoEstacionamento as ConfiguracaoEstacionamento } from './configuracao-estacionamento'
import { Estabelecimento } from './estabelecimento'
import { ConfiguracaoRecibo } from './configuracao-recibo'
import { ConfiguracaoPatio } from './configuracao-patio'
import { ConfiguracaoSeguranca } from './configuracao-seguranca'
import { ConfiguracaoManualUso } from './configuracao-manual-uso'
import { ConfiguracaoMensagens } from './configuracao-mensagens'

export class Configuracoes {
  Recibo: ConfiguracaoRecibo = new ConfiguracaoRecibo()
  Estabelecimento: Estabelecimento = new Estabelecimento()
  Estacionamento: ConfiguracaoEstacionamento = new ConfiguracaoEstacionamento()
  Patio: ConfiguracaoPatio = new ConfiguracaoPatio()
  Seguranca: ConfiguracaoSeguranca = new ConfiguracaoSeguranca()
  ManualUso: ConfiguracaoManualUso = new ConfiguracaoManualUso()
  Mensagens: ConfiguracaoMensagens = new ConfiguracaoMensagens()
}