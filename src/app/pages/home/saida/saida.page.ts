import { Component } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { PatioService } from 'src/app/dbproviders/patio.service';
import { Utils } from 'src/app/utils/utils';
import { Movimento } from 'src/app/models/movimento';

@Component({
  selector: 'app-saida',
  templateUrl: './saida.page.html',
  styleUrls: ['./saida.page.scss'],
})
export class SaidaPage {

  movimento: Movimento

  constructor(
    private modalCtrl: ModalController,
    public navParams: NavParams,
    private patio: PatioService,
    public utils: Utils
  ) { 
    this.movimento = navParams.get('movimento')
    alert(JSON.stringify(this.movimento))
  }

  cancelar() {
    this.modalCtrl.dismiss()
  }

  async concluir() {
    if (this.totalPago < this.movimento.TotalServicos)
      this.utils.mostrarToast('O valor pago não foi suficiente.', 'danger')
    else if (this.troco > this.movimento.ValorDinheiro) {
      this.utils.mostrarToast('O valor pago em dinheiro não permite troco.', 'danger')
    }
    else {
      await this.patio.exibirProcessamento('Registrando saida...')
      this.patio.registrarSaida(this.movimento)
      .then(() => {
        this.modalCtrl.dismiss({ Operacao: 'pagamento', Movimento: this.movimento })
      })
      .catch((erro) => {
        alert(JSON.stringify(erro))
      })
    }
  }  

  async concluirDepois() {
    await this.patio.exibirProcessamento('Acumulando pagamento...')
    this.movimento.Veiculos[0].Ativo = false
    this.patio.salvar(this.movimento.Veiculos[0])
    .then(() => {
      this.modalCtrl.dismiss({ Operacao: 'postergar', Movimento: this.movimento })
    })
    .catch((erro) => {
      alert(JSON.stringify(erro))
    })
  }  

  get totalPago() {
    return this.movimento.ValorCredito + this.movimento.ValorDebito + this.movimento.ValorDinheiro
  }

  get troco() {
    const troco = this.totalPago - this.movimento.TotalServicos
    return troco > 0 ? troco : 0
  }
}
