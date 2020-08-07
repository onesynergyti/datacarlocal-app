import { Component, OnInit, OnDestroy } from '@angular/core';
import { ComprasService } from 'src/app/services/compras.service';
import { ModalController } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global.service';
import { Subscription } from 'rxjs';
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'app-assinatura',
  templateUrl: './assinatura.page.html',
  styleUrls: ['./assinatura.page.scss'],
})
export class AssinaturaPage implements OnInit, OnDestroy {

  usuarioPremium = null
  doAssinarPremium: Subscription

  constructor(
    public modalCtrl: ModalController,
    public comprasService: ComprasService,
    private globalService: GlobalService,
    private utils: Utils
  ) { 
    this.comprasService.atualizarProdutos()

    // Mantem a avaliação de assinatura constante enquanto a janela de assinatura está aberta
    setInterval(() => {
      this.usuarioPremium = this.comprasService.usuarioPremium
    }, 2500)

    this.doAssinarPremium = this.globalService.onAssinarPremium.subscribe(() => {
      this.usuarioPremium = this.comprasService.usuarioPremium
    })
  }

  ngOnDestroy() {
    this.doAssinarPremium.unsubscribe()
  }

  ngOnInit() {
  }

  cancelar() {
    this.modalCtrl.dismiss()
  }

  cancelarPacote() {
    this.comprasService.cancelarAssinatura()
    this.usuarioPremium = false
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
