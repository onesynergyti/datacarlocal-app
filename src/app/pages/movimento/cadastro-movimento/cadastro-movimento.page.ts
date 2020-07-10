import { Component, OnInit } from '@angular/core';
import { Movimento } from 'src/app/models/movimento';
import { ModalController, NavParams } from '@ionic/angular';
import { MovimentoService } from 'src/app/dbproviders/movimento.service';
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'app-cadastro-movimento',
  templateUrl: './cadastro-movimento.page.html',
  styleUrls: ['./cadastro-movimento.page.scss'],
})
export class CadastroMovimentoPage implements OnInit {

  movimento: Movimento
  debito: boolean
  avaliouFormulario = false

  constructor(
    private modalCtrl: ModalController,
    public navParams: NavParams,
    private movimentoProvider: MovimentoService,
    public utils: Utils
  ) {
    this.movimento = navParams.get('movimento')
    this.debito = navParams.get('debito')
  }

  ngOnInit() {
  }

  cancelar() {
    this.modalCtrl.dismiss()
  }

  async concluir(operacao = 'cadastro') {
    if (operacao != 'cadastro') {
      this.modalCtrl.dismiss({ Operacao: operacao, Movimento: this.movimento })
    }
    else {
      this.avaliouFormulario = true
      if ((this.movimento.ValorCredito || this.movimento.ValorDebito || this.movimento.ValorDinheiro) && (this.movimento.Descricao.length > 0))
      {
        await this.movimentoProvider.exibirProcessamento('Salvando movimento...')
        this.movimento.ValorCredito = Math.abs(this.movimento.ValorCredito) * (this.debito ? -1 : 1)
        this.movimento.ValorDebito = Math.abs(this.movimento.ValorDebito) * (this.debito ? -1 : 1)
        this.movimento.ValorDinheiro = Math.abs(this.movimento.ValorDinheiro) * (this.debito ? -1 : 1)
    
        this.movimentoProvider.salvar(this.movimento).then(movimento => {
          this.modalCtrl.dismiss({ Operacao: operacao, Movimento: movimento })
        })
        .catch(erro => {
          alert(JSON.stringify(erro))
        })
      }
    }
  }

  selecionarData() {
    const dataMovimento = this.movimento.Data != null ? new Date(this.movimento.Data) : new Date()
    this.utils.selecionarData(dataMovimento)
    .then(data => {
      data.setHours(dataMovimento.getHours())
      data.setMinutes(dataMovimento.getMinutes())
      this.movimento.Data = data
    });
  }

  selecionarHora() {
    const dataMovimento = this.movimento.Data != null ? new Date(this.movimento.Data) : new Date()
    this.utils.selecionarHora(dataMovimento)
    .then(hora => {
      this.movimento.Data = hora
    });
  }
}
