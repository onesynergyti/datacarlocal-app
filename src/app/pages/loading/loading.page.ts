import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/dbproviders/database.service';
import { ConfiguracoesService } from 'src/app/services/configuracoes.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.page.html',
  styleUrls: ['./loading.page.scss'],
})
export class LoadingPage implements OnInit {

  constructor(
    private databaseProvider: DatabaseService,
    private configuracoesService: ConfiguracoesService,
    private navController: NavController
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.databaseProvider.DB.then((db) => {
      this.databaseProvider.criarTabelas(db).then(() => {

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
  }
}
