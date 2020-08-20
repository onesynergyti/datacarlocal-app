import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ConfiguracoesService } from 'src/app/services/configuracoes.service';
import { Configuracoes } from 'src/app/models/configuracoes';
import {Md5} from 'ts-md5/dist/md5'
import { Utils } from 'src/app/utils/utils';
import { environment } from 'src/environments/environment';

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
    this.configuracoes = this.configuracoesService.configuracoesLocais
  }

  ionViewDidEnter() {
    this.utils.alerta('BEM VINDO', 'Antes de iniciar o aplicativo vamos definir as configurações básicas.')
  }

  concluir() {
    if (this.configuracoes.Estabelecimento.Nome.length <= 0)
      this.utils.mostrarToast('Informe o nome do estabelecimento.', 'danger')
    else if (!this.utils.telefoneValido(this.configuracoes.Estabelecimento.Telefone))
      this.utils.mostrarToast('Informe um telefone válido.', 'danger')
    else if (!this.utils.emailValido(this.configuracoes.Seguranca.EmailAdministrador, false))
      this.utils.mostrarToast('Informe um e-mail de administrador válido.', 'danger')
    else if (this.senhaNova.length < 4)
      this.utils.mostrarToast('Informe uma senha com no mínimo 4 dígitos.', 'danger')
    else if (this.senhaNova != this.senhaConfirmacao)
      this.utils.mostrarToast('A confirmação da senha não está correta.', 'danger')
    else {
      // Define as configurações iniciais como finalizadas
      this.configuracoes.ManualUso.ConfiguracaoInicial = true
      this.configuracoes.Seguranca.SenhaAdministrador = Md5.hashStr(environment.chaveMD5 + this.senhaNova)
      this.configuracoesService.configuracoesLocais = this.configuracoes
      this.navController.navigateRoot('home') 
    }
  }
}