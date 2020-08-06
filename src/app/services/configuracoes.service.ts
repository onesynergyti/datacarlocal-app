import { Injectable } from '@angular/core';
import { Configuracoes } from '../models/configuracoes';
import { ConfiguracaoRecibo } from '../models/configuracao-recibo';
import { ConfiguracaoEstacionamento } from '../models/configuracao-estacionamento';
import { Estabelecimento } from '../models/estabelecimento';
import { ConfiguracaoPatio } from '../models/configuracao-patio';
import { ConfiguracaoSeguranca } from '../models/configuracao-seguranca';
import { ConfiguracaoManualUso } from '../models/configuracao-manual-uso';
import { ConfiguracaoMensagens } from '../models/configuracao-mensagens';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracoesService {  

  constructor() { }

  get configuracoes(): Configuracoes {
    let valor: Configuracoes = JSON.parse(localStorage.getItem('configuracoes'))

    if (valor == null)
      valor = new Configuracoes()

    if (valor.Recibo == null)
      valor.Recibo = new ConfiguracaoRecibo()

    if (valor.Estacionamento == null)
      valor.Estacionamento = new ConfiguracaoEstacionamento()

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

    // Tratamento para campos novos sem valor nos clientes antigos
    if (valor.Patio.CampoAvarias == null)
      valor.Patio.CampoAvarias = true

    if (valor.Seguranca.ExigirSenhaCadastroProdutos == null)
      valor.Seguranca.ExigirSenhaCadastroProdutos = true

    return valor
}

  set configuracoes(configuracoes: Configuracoes) {
    localStorage.setItem('configuracoes', JSON.stringify(configuracoes))
  }
}
