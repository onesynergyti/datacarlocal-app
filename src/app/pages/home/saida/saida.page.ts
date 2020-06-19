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
    private utils: Utils
  ) { 
    this.movimento = navParams.get('movimento')
  }

  cancelar() {
    this.modalCtrl.dismiss()
  }

  async concluir() {
    if (this.totalPago < this.total)
      this.utils.mostrarToast('O valor pago não foi suficiente.', 'danger')
    else if (this.troco > this.movimento.ValorDinheiro) {
      this.utils.mostrarToast('O valor pago em dinheiro não permite troco.', 'danger')
    }
    else {
      await this.patio.exibirProcessamento('Registrando saida...')
      this.patio.registrarSaida(this.movimento)
      .then(() => {
        this.modalCtrl.dismiss({ Operacao: 'excluir', Movimento: this.movimento })
      })
      .catch((erro) => {
        alert(JSON.stringify(erro))
      })
    }
  }  

  async concluirDepois() {
    await this.patio.exibirProcessamento('Acumulando pagamento...')
    this.movimento.Veiculo.Ativo = false
    this.patio.salvar(this.movimento.Veiculo)
    .then(() => {
      this.modalCtrl.dismiss({ Operacao: 'excluir', Movimento: this.movimento })
    })
    .catch((erro) => {
      alert(JSON.stringify(erro))
    })
  }  

  get total() {
    return this.movimento.Veiculo.TotalServicos
  }

  get totalPago() {
    return this.movimento.ValorCredito + this.movimento.ValorDebito + this.movimento.ValorDinheiro
  }

  get troco() {
    const troco = this.totalPago - this.total
    return troco > 0 ? troco : 0
  }
}
