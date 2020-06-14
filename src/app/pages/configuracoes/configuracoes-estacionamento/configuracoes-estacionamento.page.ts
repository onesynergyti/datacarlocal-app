import { Component, OnInit } from '@angular/core';
import { Configuracoes } from 'src/app/models/configuracoes';
import { ConfiguracoesService } from 'src/app/services/configuracoes.service';

@Component({
  selector: 'app-configuracoes-estacionamento',
  templateUrl: './configuracoes-estacionamento.page.html',
  styleUrls: ['./configuracoes-estacionamento.page.scss'],
})
export class ConfiguracoesEstacionamentoPage implements OnInit {

  configuracoes: Configuracoes

  constructor(
    private configuracoesService: ConfiguracoesService
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
