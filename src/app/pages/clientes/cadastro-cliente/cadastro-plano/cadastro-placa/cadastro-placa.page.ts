import { Component, OnInit } from '@angular/core';
 import { AlertController, ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-cadastro-placa',
  templateUrl: './cadastro-placa.page.html',
  styleUrls: ['./cadastro-placa.page.scss'],
})
export class CadastroPlacaPage implements OnInit {

  avaliouFormulario = false
  placa = ''

  constructor(
    private alertController: AlertController,
    private modalCtrl: ModalController,
    public navParams: NavParams
  ) {
    this.placa = navParams.get('placa')
  }

  ngOnInit() {
  }

  tratarPlaca(valor: string) {
    return valor.toUpperCase().replace(/[^a-zA-Z0-9]/g,'')
  }

  cancelar() {
    this.modalCtrl.dismiss()
  }

  concluir(operacao = 'cadastro') {
    this.avaliouFormulario = true
    if (this.placa.length == 7)
      this.modalCtrl.dismiss({ Operacao: operacao, Placa: this.placa })
  }

  async excluir() {
    const alert = await this.alertController.create({
      header: 'Excluir placa',
      message: 'Deseja realmente excluir a placa?',
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Sim',
          handler: () => {
            this.modalCtrl.dismiss({ Operacao: 'excluir', Placa: this.placa })
          }
        }
      ]  
    });
  
    await alert.present();
  }
}
