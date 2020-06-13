import { Component } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { DatabaseService } from './dbproviders/database.service';
import { AdMobFree, AdMobFreeRewardVideoConfig } from '@ionic-native/admob-free/ngx';

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
    private admobFree: AdMobFree
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
}
