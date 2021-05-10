import { Component, OnInit, OnDestroy } from '@angular/core';
import { ComprasService } from 'src/app/services/compras.service';
import { ModalController, NavParams } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global.service';
import { Subscription } from 'rxjs';
import { Utils } from 'src/app/utils/utils';
import { MensalistasService } from 'src/app/dbproviders/mensalistas.service';

@Component({
  selector: 'app-assinatura',
  templateUrl: './assinatura.page.html',
  styleUrls: ['./assinatura.page.scss'],
})
export class AssinaturaPage implements OnInit, OnDestroy {

  entradaBloqueada = false
  usuarioPremium = null
  doAssinarPremium: Subscription

  constructor(
    public modalCtrl: ModalController,
    public comprasService: ComprasService,
    private globalService: GlobalService,
    private utils: Utils,
    public navParams: NavParams,
    private providerMensalistas: MensalistasService,
  ) { 
    this.entradaBloqueada = navParams.get('entradaBloqueada')

/*    // Mantem a avaliação de assinatura constante enquanto a janela de assinatura está aberta
    setInterval(() => {
      this.usuarioPremium = this.comprasService.usuarioPremium
    }, 2500) */

    this.comprasService.atualizarProdutos()

    this.doAssinarPremium = this.globalService.onAssinarPremium.subscribe(() => {
      this.usuarioPremium = this.comprasService.usuarioPremium
    })
  }

  ngOnDestroy() {
    this.doAssinarPremium.unsubscribe()
  }

  ngOnInit() {
    this.providerMensalistas.ocultarProcessamento()
  }

  cancelar() {
    this.modalCtrl.dismiss()
  }

  comprarProduto(idProduto) {
    if (this.usuarioPremium) {
      this.utils.mostrarToast('Você já é um usuário premium!', 'danger')
    }
    else if (this.comprasService.transacaoAberta) {
      this.utils.mostrarToast('Existe uma cobrança em avaliação, aguarde enquanto a operadora avalia a liberação.', 'danger')
    }
    else {
      this.comprasService.comprar(idProduto)
    }
  }

  get economia() {
    return Math.floor(100 - this.comprasService.planoAnual.priceMicros / 12 / this.comprasService.planoMensal.priceMicros * 100)
  }

}
