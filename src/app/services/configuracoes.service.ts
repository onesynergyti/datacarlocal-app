import { Injectable } from '@angular/core';
import { Configuracoes } from '../models/configuracoes';
import { ConfiguracaoRecibo } from '../models/configuracao-recibo';
import { ConfiguracaoEstacionamento } from '../models/configuracao-estacionamento';
import { Estabelecimento } from '../models/estabelecimento';
import { ConfiguracaoPatio } from '../models/configuracao-patio';
import { ConfiguracaoSeguranca } from '../models/configuracao-seguranca';
import { ConfiguracaoManualUso } from '../models/configuracao-manual-uso';
import { ConfiguracaoMensagens } from '../models/configuracao-mensagens';
import { ConfiguracaoPortal } from '../models/configuracao-portal';
import { GlobalService } from './global.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracoesService {  

  constructor(
    private globalService: GlobalService
  ) { }

  get configuracoes(): Configuracoes {
    let valor: Configuracoes = JSON.parse(localStorage.getItem('configuracoes'))

    if (valor == null)
      valor = new Configuracoes()

    valor.Estacionamento = new ConfiguracaoEstacionamento(valor.Estacionamento)

    if (valor.Recibo == null)
      valor.Recibo = new ConfiguracaoRecibo()

    if (valor.Estabelecimento == null)
      valor.Estabelecimento = new Estabelecimento()

    if (valor.Patio == null)
      valor.Patio = new ConfiguracaoPatio()

    if (valor.Seguranca == null)
      valor.Seguranca = new ConfiguracaoSeguranca()

    if (valor.ManualUso == null)
      valor.ManualUso = new ConfiguracaoManualUso()

    if (valor.Mensagens == null)
      valor.Mensagens = new ConfiguracaoMensagens()

    if (valor.Portal == null)
      valor.Portal = new ConfiguracaoPortal()

      // Tratamento para campos novos sem valor nos clientes antigos
    if (valor.Patio.CampoAvarias == null)
      valor.Patio.CampoAvarias = true

    if (valor.Seguranca.ExigirSenhaCadastroProdutos == null)
      valor.Seguranca.ExigirSenhaCadastroProdutos = true

    if (valor.Patio.CampoVeiculoPequeno == null)
      valor.Patio.CampoVeiculoPequeno = environment.codigoSistema in [1, 4]

    if (valor.Patio.CampoVeiculoMedio == null)
      valor.Patio.CampoVeiculoMedio = environment.codigoSistema in [1, 4]

    if (valor.Patio.CampoVeiculoGrande == null)
      valor.Patio.CampoVeiculoGrande = environment.codigoSistema in [1, 4]

    if (valor.Patio.CampoMoto == null)
      valor.Patio.CampoMoto = environment.codigoSistema in [1, 4]

    if (valor.Patio.CampoMotoPequena == null)
      valor.Patio.CampoMotoPequena = environment.codigoSistema in [1, 4]

    if (valor.Patio.CampoMotoGrande == null)
      valor.Patio.CampoMotoGrande = environment.codigoSistema in [1, 4]

    return valor
}

  set configuracoes(configuracoes: Configuracoes) {
    localStorage.setItem('configuracoes', JSON.stringify(configuracoes))
    this.globalService.onSalvarConfiguracoes.next(configuracoes)
  }
}
