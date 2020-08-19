import { Component, OnInit } from '@angular/core';
import { PrecoEspecial } from 'src/app/models/preco-especial';
import { ModalController, NavParams, AlertController } from '@ionic/angular';
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'app-cadastro-preco-especial',
  templateUrl: './cadastro-preco-especial.page.html',
  styleUrls: ['./cadastro-preco-especial.page.scss'],
})
export class CadastroPrecoEspecialPage implements OnInit {

  avaliouFormulario
  precoEspecial: PrecoEspecial
  inclusao

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    public utils: Utils,
    public alertController: AlertController
  ) { 
    this.precoEspecial = this.navParams.get('precoEspecial')
    this.inclusao = this.navParams.get('inclusao')
  }

  ngOnInit() {
  }

  cancelar() {
    this.modalCtrl.dismiss()
  }

  concluir(operacao = 'cadastro') {
    if (operacao != 'cadastro')
      this.modalCtrl.dismiss({ Operacao: operacao, PrecoEspecial: this.precoEspecial })
    else {
      this.avaliouFormulario = true
      if (this.precoEspecial.Minutos > 0)
        this.modalCtrl.dismiss({ Operacao: operacao, PrecoEspecial: this.precoEspecial })
    }
  }

  async excluirPrecoEspecial() {
    const alert = await this.alertController.create({
      header: 'Excluir produto',
      message: `Deseja realmente excluir o preço especial?`,
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Sim',
          handler: () => {
            this.concluir('excluir')
          }
        }
      ]  
    });
  
    await alert.present();
  }
}
