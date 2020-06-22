import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { VeiculoCadastro } from 'src/app/models/veiculo-cadastro';

@Component({
  selector: 'app-cadastro-veiculo',
  templateUrl: './cadastro-veiculo.page.html',
  styleUrls: ['./cadastro-veiculo.page.scss'],
})
export class CadastroVeiculoPage implements OnInit {

  veiculo: VeiculoCadastro

  constructor(
    private modalCtrl: ModalController,
    public navParams: NavParams,
  ) { 
    this.veiculo = navParams.get('veiculoMensalista')
  }

  ngOnInit() {
  }

  cancelar() {
    this.modalCtrl.dismiss()
  }

  concluir() {
    this.modalCtrl.dismiss(this.veiculo)
  }

}
