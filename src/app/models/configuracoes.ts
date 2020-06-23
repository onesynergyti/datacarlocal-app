import { ConfiguracaoEstacionamento as ConfiguracaoEstacionamento } from './configuracao-estacionamento'
import { Estabelecimento } from './estabelecimento'
import { ConfiguracaoRecibo } from './configuracao-recibo'
import { ConfiguracaoPatio } from './configuracao-patio'

export class Configuracoes {
  UtilizaServicos: boolean
  Recibo: ConfiguracaoRecibo = new ConfiguracaoRecibo()
  Estabelecimento: Estabelecimento = new Estabelecimento()
  Estacionamento: ConfiguracaoEstacionamento = new ConfiguracaoEstacionamento()
  Patio: ConfiguracaoPatio = new ConfiguracaoPatio()
}