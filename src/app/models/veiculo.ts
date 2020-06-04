import { ServicoVeiculo } from './servico-veiculo'

export class Veiculo {
  Id: number
  Placa: string
  Modelo: string
  Entrada: Date
  TipoVeiculo: number
  Observacoes: string
  Servicos: ServicoVeiculo[] = []
}
