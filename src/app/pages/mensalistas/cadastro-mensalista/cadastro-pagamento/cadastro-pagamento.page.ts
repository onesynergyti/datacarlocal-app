import { Component, OnInit } from '@angular/core';
import { Utils } from 'src/app/utils/utils';
import { Movimento } from 'src/app/models/movimento';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-cadastro-pagamento',
  templateUrl: './cadastro-pagamento.page.html',
  styleUrls: ['./cadastro-pagamento.page.scss'],
})
export class CadastroPagamentoPage implements OnInit {

  movimento: Movimento
  inclusao = false
  avaliouFormulario = false

  constructor(
    public utils: Utils,
    private modalCtrl: ModalController,
    public navParams: NavParams,
  ) { 
    this.movimento = navParams.get('movimento')
    this.inclusao = navParams.get('inclusao')
  }

  ngOnInit() {
  }

  cancelar() {
    this.modalCtrl.dismiss()
  }

  selecionarDataInicio() {
    this.utils.selecionarData(this.movimento.Inicio ? new Date(this.movimento.Inicio) : new Date()).then(data => { this.movimento.Inicio = data });
  }

  selecionarDataFim() {
    this.utils.selecionarData(this.movimento.Fim ? new Date(this.movimento.Fim) : new Date()).then(data => { this.movimento.Fim = data });
  }  

  concluir(operacao = 'cadastro') {
    if (operacao != 'cadastro') {
      this.modalCtrl.dismiss({ Operacao: operacao, Movimento: this.movimento })
    }
    else {
      this.avaliouFormulario = true

      if (this.movimento.ValorCredito || this.movimento.ValorDebito || this.movimento.ValorDinheiro) {
        this.modalCtrl.dismiss({ Operacao: operacao, Movimento: this.movimento })
      }
    }
  }
}
