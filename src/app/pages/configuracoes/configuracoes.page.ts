import { Component, OnInit } from '@angular/core';
import { Configuracoes } from 'src/app/models/configuracoes';
import { ConfiguracoesService } from 'src/app/services/configuracoes.service';
import { Estabelecimento } from 'src/app/models/estabelecimento';

@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.page.html',
  styleUrls: ['./configuracoes.page.scss'],
})
export class ConfiguracoesPage implements OnInit {

  configuracoes: Configuracoes

  constructor(
    private configuracoesService: ConfiguracoesService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.configuracoes = this.configuracoesService.configuracoes
    if (!this.configuracoes.Estabelecimento)
      this.configuracoes.Estabelecimento = new Estabelecimento()
  }

  ionViewWillLeave() {
    this.configuracoesService.configuracoes = this.configuracoes
  }
}
