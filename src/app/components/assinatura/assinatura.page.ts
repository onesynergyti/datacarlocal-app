import { Component, OnInit, OnDestroy } from '@angular/core';
import { ComprasService } from 'src/app/services/compras.service';
import { ModalController } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global.service';
import { Subscription } from 'rxjs';

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
    private globalService: GlobalService
  ) { 
    this.doAssinarPremium = this.globalService.onAssinarPremium.subscribe(produto => {
      setTimeout(() => {
        this.usuarioPremium = this.comprasService.vencimentoPremium >= new Date()
      }, 1);
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
    this.comprasService.comprar(idProduto)
  }

}
