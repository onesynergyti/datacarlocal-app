import { ConfiguracaoEstacionamento as ConfiguracaoEstacionamento } from './configuracao-estacionamento'
import { Estabelecimento } from './estabelecimento'
import { ConfiguracaoRecibo } from './configuracao-recibo'

export class Configuracoes {
  UtilizaEstacionamento: boolean
  UtilizaServicos: boolean
  Recibo: ConfiguracaoRecibo = new ConfiguracaoRecibo()
  Estabelecimento: Estabelecimento = new Estabelecimento()
  Estacionamento: ConfiguracaoEstacionamento = new ConfiguracaoEstacionamento()
}