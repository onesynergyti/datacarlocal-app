import { Component } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-saida',
  templateUrl: './saida.page.html',
  styleUrls: ['./saida.page.scss'],
})
export class SaidaPage {

  veiculo

  constructor(
    private modalCtrl: ModalController,
    public navParams: NavParams
  ) { 
    this.veiculo = navParams.get('veiculo')
  }
  
}
