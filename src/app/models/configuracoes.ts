import { PrecosEstacionamento } from './precos-estacionamento'
import { Estabelecimento } from './estabelecimento'

export class Configuracoes {
  CaractersImpressao: number = 32
  UtilizaEstacionamento: boolean
  ServicoEstacionamentoAutomatico: boolean
  UtilizaServicos: boolean
  Estabelecimento: Estabelecimento = new Estabelecimento()
  PrecosEstacionamento: PrecosEstacionamento = new PrecosEstacionamento()
}