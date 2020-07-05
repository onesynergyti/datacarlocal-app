import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ConfiguracoesService } from 'src/app/services/configuracoes.service';
import { Configuracoes } from 'src/app/models/configuracoes';
import {Md5} from 'ts-md5/dist/md5'
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  configuracoes: Configuracoes
  senhaNova = ''
  senhaConfirmacao = ''

  constructor(
    private navController: NavController,
    private configuracoesService: ConfiguracoesService,
    public utils: Utils
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.configuracoes = this.configuracoesService.configuracoes
  }

  concluir() {
    if (this.configuracoes.Estabelecimento.Nome.length <= 0)
      this.utils.mostrarToast('Informe o nome do estabelecimento.', 'danger')
    else if (!this.configuracoes.Estacionamento.UtilizarEstacionamento && !this.configuracoes.UtilizaServicos)
      this.utils.mostrarToast('Habilite pelo menos uma opção de estacionamento ou serviço.', 'danger')
    else if (this.configuracoes.Seguranca.EmailAdministrador.length < 10)
      this.utils.mostrarToast('Informe um e-mail de administrador.', 'danger')
    else if (this.senhaNova.length < 4)
      this.utils.mostrarToast('Informe uma senha com no mínimo 4 dígitos.', 'danger')
    else if (this.senhaNova != this.senhaConfirmacao)
      this.utils.mostrarToast('A confirmação da senha não está correta.', 'danger')
    else {
      // Define as configurações iniciais como finalizadas
      this.configuracoes.ManualUso.ConfiguracaoInicial = true
      this.configuracoes.Seguranca.SenhaAdministrador = Md5.hashStr(this.senhaNova)
      this.configuracoesService.configuracoes = this.configuracoes
      this.navController.navigateRoot('home') 
    }
  }
}