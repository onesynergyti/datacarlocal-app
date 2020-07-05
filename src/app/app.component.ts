import { Component } from '@angular/core';
import { Platform, NavController, ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { DatabaseService } from './dbproviders/database.service';
import { AdMobFree, AdMobFreeRewardVideoConfig } from '@ionic-native/admob-free/ngx';
import { SenhaAdministradorPage } from './pages/senha-administrador/senha-administrador.page';
import { Utils } from './utils/utils';
import { ConfiguracoesService } from './services/configuracoes.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  enderecoNavegacao

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private navController: NavController,
    private databaseProvider: DatabaseService,
    private admobFree: AdMobFree,
    private modalController: ModalController,
    private utils: Utils,
    private configuracoesService: ConfiguracoesService
  ) {
    this.initializeApp();

    document.addEventListener(this.admobFree.events.REWARD_VIDEO_REWARD, (result) => {
      this.navController.navigateForward(this.enderecoNavegacao)
    });     
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Define a status bar
      this.statusBar.backgroundColorByHexString('#000000');
      this.statusBar.styleLightContent();

      this.databaseProvider.DB.then((db) => {
        this.databaseProvider.criarTabelas(db).then(() => {
          this.splashScreen.hide()

          // Exige as configurações iniciais do sistema
          if (!this.configuracoesService.configuracoes.ManualUso.ConfiguracaoInicial)
            this.navController.navigateRoot('inicio')
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

  showRewardVideoAds(url){
    this.databaseProvider.ocultarProcessamento()
    this.enderecoNavegacao = url
    this.navController.navigateForward(this.enderecoNavegacao) 

    /* let RewardVideoConfig: AdMobFreeRewardVideoConfig = {
        isTesting: false, 
        autoShow: true,
        id: "ca-app-pub-2818472978128447/7966305809"
    };
    this.admobFree.rewardVideo.config(RewardVideoConfig);

    this.admobFree.rewardVideo.prepare()
    .then(() => {
      this.enderecoNavegacao = url
    })
    .catch(() => {
      this.navController.navigateForward(this.enderecoNavegacao)
    })
    .finally(() => {
      this.databaseProvider.ocultarProcessamento()
    }) */
  }

  async navegar(url) {   
    await this.databaseProvider.exibirProcessamento('Aguarde...')
    this.showRewardVideoAds(url)
  }  

  async abrirSenhaAdministrador() {
    const modal = await this.modalController.create({
      component: SenhaAdministradorPage,
      componentProps: {}
    });

    modal.onWillDismiss().then((retorno) => {
      if (retorno != null) {
        this.utils.mostrarToast('Senha alterada com sucesso', 'success')
      }
    })

    return await modal.present(); 
  }
}
