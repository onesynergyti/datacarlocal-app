import { Injectable } from '@angular/core';
import { InAppPurchase2, IAPProduct } from '@ionic-native/in-app-purchase-2/ngx';
import { Platform } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {

  planoMensal
  planoAnual

  constructor(
    public platform: Platform, 
    private iap2: InAppPurchase2,
    private globalService: GlobalService
  ) { 
    this.platform.ready().then(() => {
      this.setup();
    })    
  }

  setup() {
    this.iap2.verbosity = this.iap2.DEBUG;
    
    this.iap2.register({
      id: 'pacote_mensal',
      type: this.iap2.CONSUMABLE
    });

    this.iap2.register({
      id: 'pacote_anual',
      type: this.iap2.CONSUMABLE
    });    

    // Define a ação de aprovação de cada produto
    this.iap2.when('pacote_mensal').approved((produto: IAPProduct) => {
      const data = new Date(JSON.parse(produto.transaction.receipt).purchaseTime).setMonth(new Date().getMonth() + 1)
      localStorage.setItem('vencimentoAssinatura', new DatePipe('en-US').transform(data, 'dd/MM/yyyy'))
      produto.finish();
      this.globalService.onAssinarPremium.next(produto)
    });
    this.iap2.when('pacote_anual').approved((produto: IAPProduct) => {
      const data = new Date(JSON.parse(produto.transaction.receipt).purchaseTime).setMonth(new Date().getMonth() + 12)
      localStorage.setItem('vencimentoAssinatura', new DatePipe('en-US').transform(data, 'dd/MM/yyyy'))
      produto.finish();
      this.globalService.onAssinarPremium.next(produto)      
    });

    this.iap2.refresh();
  }

  comprar(idProduto) {
    this.iap2.order(idProduto).then((p) => {
      alert('Purchase Succesful' + JSON.stringify(p));
    }).catch((e) => {
      alert('Error Ordering From Store' + e);
    });
  }

  cancelarAssinatura() {
    localStorage.removeItem('vencimentoAssinatura')
    this.globalService.onAssinarPremium.next(null)
  }

  get vencimentoPremium() {
    return localStorage.getItem('vencimentoAssinatura') != null ? new Date(localStorage.getItem('vencimentoAssinatura')).getTime() : new Date('1000/01/01')
  }
}
