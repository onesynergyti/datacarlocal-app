import { Component, OnInit } from '@angular/core';
import { Configuracoes } from 'src/app/models/configuracoes';
import { ConfiguracoesService } from 'src/app/services/configuracoes.service';
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.page.html',
  styleUrls: ['./configuracoes.page.scss'],
})
export class ConfiguracoesPage implements OnInit {

  configuracoes: Configuracoes
  pagina = 'empresa'

  constructor(
    private configuracoesService: ConfiguracoesService,
    public utils: Utils
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.configuracoes = this.configuracoesService.configuracoes
  }

  ionViewWillLeave() {
    this.configuracoesService.configuracoes = this.configuracoes
  }
}
