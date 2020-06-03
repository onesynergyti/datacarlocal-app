import { ServicoVeiculo } from './servico-veiculo'

export class Veiculo {
  Placa: string
  Modelo: string
  Entrada: Date
  TipoVeiculo: number
  Observacoes: string
  Servicos: ServicoVeiculo[] = []
}
