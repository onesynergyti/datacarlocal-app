import { Injectable } from '@angular/core';
import { Configuracoes } from '../models/configuracoes';
import { ConfiguracaoRecibo } from '../models/configuracao-recibo';
import { ConfiguracaoEstacionamento } from '../models/configuracao-estacionamento';
import { Estabelecimento } from '../models/estabelecimento';

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

    return retorno == null ? new Configuracoes() : JSON.parse(retorno)
}

  set configuracoes(configuracoes: Configuracoes) {
    localStorage.setItem('configuracoes', JSON.stringify(configuracoes))
  }
}
