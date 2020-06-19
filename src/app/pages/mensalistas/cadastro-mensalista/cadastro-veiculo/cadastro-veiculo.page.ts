import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { VeiculoMensalista } from 'src/app/models/veiculo-mensalista';

@Component({
  selector: 'app-cadastro-veiculo',
  templateUrl: './cadastro-veiculo.page.html',
  styleUrls: ['./cadastro-veiculo.page.scss'],
})
export class CadastroVeiculoPage implements OnInit {

  veiculo: VeiculoMensalista

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
