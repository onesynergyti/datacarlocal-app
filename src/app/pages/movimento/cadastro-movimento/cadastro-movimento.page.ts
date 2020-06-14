import { Component, OnInit } from '@angular/core';
import { Movimento } from 'src/app/models/movimento';
import { ModalController, NavParams } from '@ionic/angular';
import { MovimentoService } from 'src/app/dbproviders/movimento.service';

@Component({
  selector: 'app-cadastro-movimento',
  templateUrl: './cadastro-movimento.page.html',
  styleUrls: ['./cadastro-movimento.page.scss'],
})
export class CadastroMovimentoPage implements OnInit {

  movimento: Movimento
  debito: boolean

  constructor(
    private modalCtrl: ModalController,
    public navParams: NavParams,
    private movimentoProvider: MovimentoService
  ) {
    this.movimento = navParams.get('movimento')
    this.debito = navParams.get('debito')
  }

  ngOnInit() {
  }

  cancelar() {
    this.modalCtrl.dismiss()
  }

  async concluir() {
    await this.movimentoProvider.exibirProcessamento('Salvando movimento...')
    this.movimento.ValorCredito = Math.abs(this.movimento.ValorCredito) * (this.debito ? -1 : 1)
    this.movimento.ValorDebito = Math.abs(this.movimento.ValorDebito) * (this.debito ? -1 : 1)
    this.movimento.ValorDinheiro = Math.abs(this.movimento.ValorDinheiro) * (this.debito ? -1 : 1)

    this.movimentoProvider.salvar(this.movimento).then(movimento => {
      this.modalCtrl.dismiss(movimento)
    })
  }
}
