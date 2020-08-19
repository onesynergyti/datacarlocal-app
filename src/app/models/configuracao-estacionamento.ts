import { environment } from 'src/environments/environment'
import { PrecoEspecial } from './preco-especial'

export class ConfiguracaoEstacionamento {
  UtilizarEstacionamento: boolean = environment.codigoSistema == 4
  IncluirServicoEstacionamento: boolean = environment.codigoSistema == 4
  MinutosCarencia: number = 0
  UtilizaFracao15Minutos: boolean
  UtilizaFracao30Minutos: boolean
  UtilizaPrimeirosMinutos: boolean
  QuantidadePrimeirosMinutos: number = 0
  UtilizaHora: boolean
  UtilizaDiaria: boolean
  Fracao15MinutosMotoPequena: number = 0
  Fracao30MinutosMotoPequena: number = 0
  PrimeirosMinutosMotoPequena: number = 0
  HoraMotoPequena: number = 0
  DiariaMotoPequena: number = 0  
  Fracao15MinutosMoto: number = 0
  Fracao30MinutosMoto: number = 0
  PrimeirosMinutosMoto: number = 0
  HoraMoto: number = 0
  DiariaMoto: number = 0
  Fracao15MinutosMotoGrande: number = 0
  Fracao30MinutosMotoGrande: number = 0
  PrimeirosMinutosMotoGrande: number = 0
  HoraMotoGrande: number = 0
  DiariaMotoGrande: number = 0
  Fracao15MinutosCarroPequeno: number = 0
  Fracao30MinutosCarroPequeno: number = 0
  PrimeirosMinutosCarroPequeno: number = 0
  HoraCarroPequeno: number = 0
  DiariaCarroPequeno: number = 0
  Fracao15MinutosCarroMedio: number = 0
  Fracao30MinutosCarroMedio: number = 0
  PrimeirosMinutosCarroMedio: number = 0
  HoraCarroMedio: number = 0
  DiariaCarroMedio: number = 0
  Fracao15MinutosCarroGrande: number = 0
  Fracao30MinutosCarroGrande: number = 0
  PrimeirosMinutosCarroGrande: number = 0
  HoraCarroGrande: number = 0
  DiariaCarroGrande: number = 0
  Fracao15MinutosTipoGenerico: number = 0
  Fracao30MinutosTipoGenerico: number = 0
  PrimeirosMinutosTipoGenerico: number = 0
  HoraTipoGenerico: number = 0
  DiariaTipoGenerico: number = 0
  PrecosEspeciais: PrecoEspecial[] = []

  constructor(configuracaoEstacionamento: ConfiguracaoEstacionamento = null) {
    if (configuracaoEstacionamento != null) {
      this.UtilizarEstacionamento = configuracaoEstacionamento.UtilizarEstacionamento != null ? configuracaoEstacionamento.UtilizarEstacionamento : environment.codigoSistema == 4
      this.IncluirServicoEstacionamento = configuracaoEstacionamento.IncluirServicoEstacionamento != null ? configuracaoEstacionamento.IncluirServicoEstacionamento : environment.codigoSistema == 4
      this.MinutosCarencia = configuracaoEstacionamento.MinutosCarencia != null ? configuracaoEstacionamento.MinutosCarencia : 0
      this.UtilizaFracao15Minutos = configuracaoEstacionamento.UtilizaFracao15Minutos != null ? configuracaoEstacionamento.UtilizaFracao15Minutos : false
      this.UtilizaFracao30Minutos = configuracaoEstacionamento.UtilizaFracao30Minutos != null ? configuracaoEstacionamento.UtilizaFracao30Minutos : false
      this.UtilizaPrimeirosMinutos = configuracaoEstacionamento.UtilizaPrimeirosMinutos != null ? configuracaoEstacionamento.UtilizaPrimeirosMinutos : false
      this.QuantidadePrimeirosMinutos = configuracaoEstacionamento.QuantidadePrimeirosMinutos != null ? configuracaoEstacionamento.QuantidadePrimeirosMinutos : 0
      this.UtilizaHora = configuracaoEstacionamento.UtilizaHora != null ? configuracaoEstacionamento.UtilizaHora : false
      this.UtilizaDiaria = configuracaoEstacionamento.UtilizaDiaria != null ? configuracaoEstacionamento.UtilizaDiaria : false
      this.Fracao15MinutosMotoPequena = configuracaoEstacionamento.Fracao15MinutosMotoPequena != null ? configuracaoEstacionamento.Fracao15MinutosMotoPequena : 0
      this.Fracao30MinutosMotoPequena = configuracaoEstacionamento.Fracao30MinutosMotoPequena != null ? configuracaoEstacionamento.Fracao30MinutosMotoPequena : 0
      this.PrimeirosMinutosMotoPequena = configuracaoEstacionamento.PrimeirosMinutosMotoPequena != null ? configuracaoEstacionamento.PrimeirosMinutosMotoPequena : 0
      this.HoraMotoPequena = configuracaoEstacionamento.HoraMotoPequena != null ? configuracaoEstacionamento.HoraMotoPequena : 0
      this.DiariaMotoPequena = configuracaoEstacionamento.DiariaMotoPequena != null ? configuracaoEstacionamento.DiariaMotoPequena : 0
      this.Fracao15MinutosMoto = configuracaoEstacionamento.Fracao15MinutosMoto != null ? configuracaoEstacionamento.Fracao15MinutosMoto : 0
      this.Fracao30MinutosMoto = configuracaoEstacionamento.Fracao30MinutosMoto != null ? configuracaoEstacionamento.Fracao30MinutosMoto : 0
      this.PrimeirosMinutosMoto = configuracaoEstacionamento.PrimeirosMinutosMoto != null ? configuracaoEstacionamento.PrimeirosMinutosMoto : 0
      this.HoraMoto = configuracaoEstacionamento.HoraMoto != null ? configuracaoEstacionamento.HoraMoto : 0
      this.DiariaMoto = configuracaoEstacionamento.DiariaMoto != null ? configuracaoEstacionamento.DiariaMoto : 0
      this.Fracao15MinutosMotoGrande = configuracaoEstacionamento.Fracao15MinutosMotoGrande != null ? configuracaoEstacionamento.Fracao15MinutosMotoGrande : 0
      this.Fracao30MinutosMotoGrande = configuracaoEstacionamento.Fracao30MinutosMotoGrande != null ? configuracaoEstacionamento.Fracao30MinutosMotoGrande : 0
      this.PrimeirosMinutosMotoGrande = configuracaoEstacionamento.PrimeirosMinutosMotoGrande != null ? configuracaoEstacionamento.PrimeirosMinutosMotoGrande : 0
      this.HoraMotoGrande = configuracaoEstacionamento.HoraMotoGrande != null ? configuracaoEstacionamento.HoraMotoGrande : 0
      this.DiariaMotoGrande = configuracaoEstacionamento.DiariaMotoGrande != null ? configuracaoEstacionamento.DiariaMotoGrande : 0
      this.Fracao15MinutosCarroPequeno = configuracaoEstacionamento.Fracao15MinutosCarroPequeno != null ? configuracaoEstacionamento.Fracao15MinutosCarroPequeno : 0
      this.Fracao30MinutosCarroPequeno = configuracaoEstacionamento.Fracao30MinutosCarroPequeno != null ? configuracaoEstacionamento.Fracao30MinutosCarroPequeno : 0
      this.PrimeirosMinutosCarroPequeno = configuracaoEstacionamento.PrimeirosMinutosCarroPequeno != null ? configuracaoEstacionamento.PrimeirosMinutosCarroPequeno : 0
      this.HoraCarroPequeno = configuracaoEstacionamento.HoraCarroPequeno != null ? configuracaoEstacionamento.HoraCarroPequeno : 0
      this.DiariaCarroPequeno = configuracaoEstacionamento.DiariaCarroPequeno != null ? configuracaoEstacionamento.DiariaCarroPequeno : 0
      this.Fracao15MinutosCarroMedio = configuracaoEstacionamento.Fracao15MinutosCarroMedio != null ? configuracaoEstacionamento.Fracao15MinutosCarroMedio : 0
      this.Fracao30MinutosCarroMedio = configuracaoEstacionamento.Fracao30MinutosCarroMedio != null ? configuracaoEstacionamento.Fracao30MinutosCarroMedio : 0
      this.PrimeirosMinutosCarroMedio = configuracaoEstacionamento.PrimeirosMinutosCarroMedio != null ? configuracaoEstacionamento.PrimeirosMinutosCarroMedio : 0
      this.HoraCarroMedio = configuracaoEstacionamento.HoraCarroMedio != null ? configuracaoEstacionamento.HoraCarroMedio : 0
      this.DiariaCarroMedio = configuracaoEstacionamento.DiariaCarroMedio != null ? configuracaoEstacionamento.DiariaCarroMedio : 0
      this.Fracao15MinutosCarroGrande = configuracaoEstacionamento.Fracao15MinutosCarroGrande != null ? configuracaoEstacionamento.Fracao15MinutosCarroGrande : 0
      this.Fracao30MinutosCarroGrande = configuracaoEstacionamento.Fracao30MinutosCarroGrande != null ? configuracaoEstacionamento.Fracao30MinutosCarroGrande : 0
      this.PrimeirosMinutosCarroGrande = configuracaoEstacionamento.PrimeirosMinutosCarroGrande != null ? configuracaoEstacionamento.PrimeirosMinutosCarroGrande : 0
      this.HoraCarroGrande = configuracaoEstacionamento.HoraCarroGrande != null ? configuracaoEstacionamento.HoraCarroGrande : 0
      this.DiariaCarroGrande = configuracaoEstacionamento.DiariaCarroGrande != null ? configuracaoEstacionamento.DiariaCarroGrande : 0
      this.Fracao15MinutosTipoGenerico = configuracaoEstacionamento.Fracao15MinutosTipoGenerico != null ? configuracaoEstacionamento.Fracao15MinutosTipoGenerico : 0
      this.Fracao30MinutosTipoGenerico = configuracaoEstacionamento.Fracao30MinutosTipoGenerico != null ? configuracaoEstacionamento.Fracao30MinutosTipoGenerico : 0
      this.PrimeirosMinutosTipoGenerico = configuracaoEstacionamento.PrimeirosMinutosTipoGenerico != null ? configuracaoEstacionamento.PrimeirosMinutosTipoGenerico : 0
      this.HoraTipoGenerico = configuracaoEstacionamento.HoraTipoGenerico != null ? configuracaoEstacionamento.HoraTipoGenerico : 0
      this.DiariaTipoGenerico = configuracaoEstacionamento.DiariaTipoGenerico != null ? configuracaoEstacionamento.DiariaTipoGenerico : 0
      this.PrecosEspeciais = configuracaoEstacionamento.PrecosEspeciais != null ? configuracaoEstacionamento.PrecosEspeciais.slice() : []
    }    
  }
}
