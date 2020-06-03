import { Injectable } from '@angular/core';
import { Configuracoes } from '../models/configuracoes';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracoesService {  

  constructor() { }

  get configuracoes(): Configuracoes {
    const retorno = localStorage.getItem('configuracoes')
    return retorno == null ? new Configuracoes() : JSON.parse(retorno)
  }

  set configuracoes(configuracoes: Configuracoes) {
    localStorage.setItem('configuracoes', JSON.stringify(configuracoes))
  }
}
