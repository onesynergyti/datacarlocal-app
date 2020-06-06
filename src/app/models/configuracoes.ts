import { PrecosEstacionamento } from './precos-estacionamento'

export class Configuracoes {
  UtilizaEstacionamento: boolean
  ServicoEstacionamentoAutomatico: boolean
  UtilizaServicos: boolean
  PrecosEstacionamento: PrecosEstacionamento = new PrecosEstacionamento()
}
