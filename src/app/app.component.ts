import { Component } from '@angular/core';
import { Platform, NavController, ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { DatabaseService } from './dbproviders/database.service';
import { SenhaAdministradorPage } from './pages/senha-administrador/senha-administrador.page';
import { Utils } from './utils/utils';
import { ConfiguracoesService } from './services/configuracoes.service';
import { ValidarAcessoPage } from './pages/validar-acesso/validar-acesso.page';
import { environment } from 'src/environments/environment';
import { Push, PushOptions, PushObject } from '@ionic-native/push/ngx'
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { PropagandasService } from './services/propagandas.service';
import { AssinaturaPage } from './components/assinatura/assinatura.page';
import { ComprasService } from './services/compras.service';
import { AvisosService } from './services/avisos.service';

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
    private databaseProvider: DatabaseService,
    private modalController: ModalController,
    public utils: Utils,
    private configuracoesService: ConfiguracoesService,
    private push: Push,
    private clipboard: Clipboard,
    private propagandaService: PropagandasService,
    public comprasService: ComprasService,
    public avisosService: AvisosService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.propagandaService.prepareBannerAd()

      // Define a status bar
      this.statusBar.backgroundColorByHexString('#000000');
      this.statusBar.styleLightContent();
      
      this.databaseProvider.DB.then((db) => {
        this.databaseProvider.criarTabelas(db).then(() => {
          this.splashScreen.hide()
     
          const options: PushOptions = {
            android: {
              senderID: '948539553573'
            }
          }
       
          const pushObject: PushObject = this.push.init(options)
       
          pushObject.on('registration').subscribe(res => { 
            //alert(res.registrationId) 
            //this.clipboard.copy(res.registrationId);
          })
       
          // pushObject.on('notification').subscribe(res => alert(`${res.message}`))

          // Exige as configurações iniciais do sistema
          if (!this.configuracoesService.configuracoes.ManualUso.ConfiguracaoInicial) {
            this.navController.navigateRoot('inicio')
          }            
          else
            this.navController.navigateRoot('home')
        })
        .catch((erro) => {
          alert('Não foi possível iniciar o aplicativo. Tente novamente. ' + JSON.stringify(erro))
          navigator['app'].exitApp();
        })
      })
      .catch((erro) => {
        alert('Não foi possível iniciar o aplicativo. Tente novamente. ' + JSON.stringify(erro))
        navigator['app'].exitApp();
      })
    });
  }

  abrirWhatsAppSuporte() {
    this.utils.abrirWhatsapp(environment.whatsappSuporte)
  }

  get configuracoes() {
    return this.configuracoesService.configuracoes
  }

  async abrirPlanos() {
    const modal = await this.modalController.create({
      component: AssinaturaPage
    });

    return await modal.present(); 
  }

  async navegar(url, validar = false) { 
    if (this.platform.is('ios')) {
      if (url == 'impressora') {
        alert('Essa funcionalidade estará disponível para IOS em breve.')
        return
      }
    }
    
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
