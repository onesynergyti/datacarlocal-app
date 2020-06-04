import { Component } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { DatabaseService } from './dbproviders/database.service';

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
    private databaseProvider: DatabaseService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
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

  navegar(url) {
    this.navController.navigateForward(url)
  }
}
