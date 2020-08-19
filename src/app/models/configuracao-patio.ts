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
  SepararPrecosServico = environment.codigoSistema in [1, 4]
  CampoVeiculoPequeno = environment.codigoSistema in [1, 4]
  CampoVeiculoMedio = environment.codigoSistema in [1, 4]
  CampoVeiculoGrande = environment.codigoSistema in [1, 4]
  CampoMoto = environment.codigoSistema in [1, 4]
  CampoMotoPequena = environment.codigoSistema in [1, 4]
  CampoMotoGrande = environment.codigoSistema in [1, 4]

  constructor(configuracaoPatio: ConfiguracaoPatio = null) {
    if (configuracaoPatio != null) {
      this.QuantidadeVagas = configuracaoPatio.QuantidadeVagas != null ? configuracaoPatio.QuantidadeVagas : 0
      this.LimitarLotacao = configuracaoPatio.LimitarLotacao != null ? configuracaoPatio.LimitarLotacao : false
      this.CampoLocalizacao = configuracaoPatio.CampoLocalizacao != null ? configuracaoPatio.CampoLocalizacao : environment.codigoSistema == 4
      this.CampoResponsavel = configuracaoPatio.CampoResponsavel != null ? configuracaoPatio.CampoResponsavel : true
      this.CampoCliente = configuracaoPatio.CampoCliente != null ? configuracaoPatio.CampoCliente : true
      this.CampoObservacao = configuracaoPatio.CampoObservacao != null ? configuracaoPatio.CampoObservacao : true
      this.CampoVeiculo = configuracaoPatio.CampoVeiculo != null ? configuracaoPatio.CampoVeiculo : true
      this.CampoCartao = configuracaoPatio.CampoCartao != null ? configuracaoPatio.CampoCartao : false
      this.CampoAvarias = configuracaoPatio.CampoAvarias != null ? configuracaoPatio.CampoAvarias : true
      this.SepararPrecosServico = configuracaoPatio.SepararPrecosServico != null ? configuracaoPatio.SepararPrecosServico : environment.codigoSistema in [1, 4]
      this.CampoVeiculoPequeno = configuracaoPatio.CampoVeiculoPequeno != null ? configuracaoPatio.CampoVeiculoPequeno : environment.codigoSistema in [1, 4]
      this.CampoVeiculoMedio = configuracaoPatio.CampoVeiculoMedio != null ? configuracaoPatio.CampoVeiculoMedio : environment.codigoSistema in [1, 4]
      this.CampoVeiculoGrande = configuracaoPatio.CampoVeiculoGrande != null ? configuracaoPatio.CampoVeiculoGrande : environment.codigoSistema in [1, 4]
      this.CampoMoto = configuracaoPatio.CampoMoto != null ? configuracaoPatio.CampoMoto : environment.codigoSistema in [1, 4]
      this.CampoMotoPequena = configuracaoPatio.CampoMotoPequena != null ? configuracaoPatio.CampoMotoPequena : environment.codigoSistema in [1, 4]
      this.CampoMotoGrande = configuracaoPatio.CampoMotoGrande != null ? configuracaoPatio.CampoMotoGrande : environment.codigoSistema in [1, 4]
    }
  }

  tipoVeiculoHabilitado(tipoVeiculo) {
    if (!this.SepararPrecosServico)
      return false
    else {
      switch(tipoVeiculo) {
        case 1: { 
          return this.CampoMoto
        }
        case 2: { 
          return this.CampoVeiculoPequeno
        }
        case 3: { 
          return this.CampoVeiculoMedio
        }
        case 4: { 
          return this.CampoVeiculoGrande
        }
        case 5: { 
          return this.CampoMotoPequena
        }
        case 6: { 
          return this.CampoMotoGrande
        }
        default: {
          return false
        }
      }    
    }
  }
}