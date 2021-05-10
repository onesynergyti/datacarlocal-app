import { Injectable } from '@angular/core';
import { InAppPurchase2, IAPProduct } from '@ionic-native/in-app-purchase-2/ngx';
import { Platform } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {

  planoMensal: IAPProduct
  planoAnual: IAPProduct

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

    this.iap2.register({
      id: 'pacote_vitalicio',
      type: this.iap2.CONSUMABLE
    });    

    this.planoMensal = this.iap2.get('pacote_mensal');
    this.planoAnual = this.iap2.get('pacote_anual');
    this.planoAnual = this.iap2.get('pacote_vitalicio');

    // Define a ação de aprovação de cada produto
    this.iap2.when('pacote_vitalicio').approved((produto: IAPProduct) => {
      const dataProduto = new Date(JSON.parse(produto.transaction.receipt).purchaseTime)
      const data = new Date(dataProduto.setMonth(dataProduto.getMonth() + 1200))
      this.vencimentoPremium = data
      produto.finish();
      this.globalService.onAssinarPremium.next(produto)
    });

    // Define a ação de aprovação de cada produto
    this.iap2.when('pacote_mensal').approved((produto: IAPProduct) => {
      const dataProduto = new Date(JSON.parse(produto.transaction.receipt).purchaseTime)
      const data = new Date(dataProduto.setMonth(dataProduto.getMonth() + 1))
      this.vencimentoPremium = data
      produto.finish();
      this.globalService.onAssinarPremium.next(produto)
    });

    this.iap2.when('pacote_anual').approved((produto: IAPProduct) => {
      const dataProduto = new Date(JSON.parse(produto.transaction.receipt).purchaseTime)
      const data = new Date(dataProduto.setMonth(dataProduto.getMonth() + 12))
      this.vencimentoPremium = data
      produto.finish();
      this.globalService.onAssinarPremium.next(produto)      
    });

    this.atualizarProdutos()
  }

  atualizarProdutos() {
    this.iap2.refresh();
  }

  get transacaoAberta() {
    return this.planoAnual.transaction != null || this.planoMensal.transaction != null
  }

  comprar(idProduto) {
    this.iap2.order(idProduto).then((p) => {
      
    }).catch(() => {
      alert('Houve um erro ao tentar adquirir esse plano. Verifique sua internet e tente novamente');
    });
  }

  cancelarAssinatura() {
    localStorage.removeItem('vencimentoAssinatura')
    this.globalService.onAssinarPremium.next(null)
  }

  get vencimentoPremium() {
    return localStorage.getItem('vencimentoAssinatura') != null ? new Date(localStorage.getItem('vencimentoAssinatura')) : null
  }

  set vencimentoPremium(data: Date) {
    if (data == null)
      localStorage.removeItem('vencimentoAssinatura')
    else
      localStorage.setItem('vencimentoAssinatura', new DatePipe('en-US').transform(data, 'yyyy/MM/dd'))
  }

  get usuarioPremium() {    
    return this.vencimentoPremium != null && new Date().getTime() <= this.vencimentoPremium.getTime()
  }
}
