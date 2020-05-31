import { Component } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { PatioService } from 'src/app/dbproviders/patio.service';

@Component({
  selector: 'app-saida',
  templateUrl: './saida.page.html',
  styleUrls: ['./saida.page.scss'],
})
export class SaidaPage {

  veiculo
  saida

  constructor(
    private modalCtrl: ModalController,
    public navParams: NavParams,
    private patio: PatioService
  ) { 
    this.veiculo = navParams.get('veiculo')
    this.saida = new Date();
  }

  cancelar() {
    this.modalCtrl.dismiss()
  }

  async concluir() {
    await this.patio.exibirProcessamento('Registrando saida...')
    this.patio.registrarSaida(this.veiculo, 10, this.saida, 1)
    .then(() => {
      this.modalCtrl.dismiss(this.veiculo)
    })
    .catch((erro) => {
      alert(erro)
    })
  }

  get dataSaida() {
    return this.saida.getDate() + '/' +
      (this.saida.getMonth() + 1) + '/' +
      this.saida.getFullYear() + ' - ' +
      this.saida.getHours() + ':' +
      this.saida.getMinutes()
  }
  
}
