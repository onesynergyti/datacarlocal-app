import { Component } from '@angular/core';
import { Platform, NavController, ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { DatabaseService } from './dbproviders/database.service';
import { SenhaAdministradorPage } from './pages/senha-administrador/senha-administrador.page';
import { Utils } from './utils/utils';
import { ConfiguracoesService } from './services/configuracoes.service';
import { ValidarAcessoPage } from './pages/validar-acesso/validar-acesso.page';
import { Configuracoes } from './models/configuracoes';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private navController: NavController,
    private modalController: ModalController,
    private utils: Utils,
    private configuracoesService: ConfiguracoesService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Define a status bar
      this.statusBar.backgroundColorByHexString('#000000');
      this.statusBar.styleLightContent();

      this.splashScreen.hide()
    });
  }

  abrirWhatsAppSuporte() {
    this.utils.abrirWhatsapp('31999082737')
  }

  get configuracoes() {
    return this.configuracoesService.configuracoes
  }

  async navegar(url, validar = false) {  
    if (!validar) {
      this.navController.navigateForward(url) 
    }
    else {
      const modal = await this.modalController.create({
        component: ValidarAcessoPage,
        componentProps: {
          'mensagem': 'Informe a senha de administrador para acessar o menu.'
        }  
      });
  
      modal.onWillDismiss().then((retorno) => {
        if (retorno.data == true)
        this.navController.navigateForward(url) 
      })
  
      return await modal.present(); 
    }
  }  

  async abrirSenhaAdministrador() {
    const modal = await this.modalController.create({
      component: SenhaAdministradorPage,
      componentProps: {
        'recuparandoSenha': false
      }
    });

    modal.onWillDismiss().then((retorno) => {
      if (retorno.data) {
        this.utils.mostrarToast('Senha alterada com sucesso', 'success')
      }
    })

    return await modal.present(); 
  }
}
