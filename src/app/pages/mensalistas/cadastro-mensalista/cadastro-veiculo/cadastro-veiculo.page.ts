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
  avaliouFormulario = false
  inclusao = false

  constructor(
    private modalCtrl: ModalController,
    public navParams: NavParams,
  ) { 
    this.veiculo = navParams.get('veiculoMensalista')
    this.inclusao = navParams.get('inclusao')
  }

  ngOnInit() {
  }

  cancelar() {
    this.modalCtrl.dismiss()
  }

  concluir(operacao = 'cadastro') {
    if (operacao != 'cadastro')
      this.modalCtrl.dismiss({ Operacao: operacao, Veiculo: this.veiculo })
    else {
      this.avaliouFormulario = true
      if (this.veiculo.Placa.length == 7)
        this.modalCtrl.dismiss({ Operacao: operacao, Veiculo: this.veiculo })
    }
  }

  tratarPlaca(valor) {
    return valor.toUpperCase().replace(/[^a-zA-Z0-9]/g,'')
  }
}
