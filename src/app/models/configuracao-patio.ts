import { environment } from 'src/environments/environment'

export class ConfiguracaoPatio {
  QuantidadeVagas: number = 0
  LimitarLotacao: boolean = false
  CampoLocalizacao: boolean = environment.codigoSistema == 4
  CampoResponsavel = true
  CampoCliente = true
  CampoObservacao = true
  CampoVeiculo = true
  CampoCartao = false
  CampoAvarias = true
}
