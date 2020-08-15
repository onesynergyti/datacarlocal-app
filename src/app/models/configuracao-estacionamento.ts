import { environment } from 'src/environments/environment'

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
  Fracao15MinutosMoto: number = 0
  Fracao30MinutosMoto: number = 0
  PrimeirosMinutosMoto: number = 0
  HoraMoto: number = 0
  DiariaMoto: number = 0
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
}
