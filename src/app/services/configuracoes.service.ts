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
    return new Configuracoes(JSON.parse(localStorage.getItem('configuracoes')))
  }


  set configuracoes(configuracoes: Configuracoes) {
    localStorage.setItem('configuracoes', JSON.stringify(configuracoes))
    this.globalService.onSalvarConfiguracoes.next(configuracoes)
  }
}
