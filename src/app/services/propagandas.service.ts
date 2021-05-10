import { Injectable } from '@angular/core';
import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig, AdMobFreeRewardVideoConfig } from '@ionic-native/admob-free/ngx';
import { GlobalService } from './global.service';
import { ComprasService } from './compras.service';
import { Utils } from '../utils/utils'

@Injectable({
  providedIn: 'root'
})
export class PropagandasService {

  bannerOk = false
  alertas = false //ccs

  constructor(
    private admobFree: AdMobFree,
    private globalService: GlobalService,
    private comprasService: ComprasService,
    private utils: Utils,
  ) { }
  
  interstialVideoLoadFail = this.admobFree.on(this.admobFree.events.INTERSTITIAL_LOAD_FAIL).subscribe((value) => {
    // Se não conseguiu preparar a propaganda e é por que está sem acesso á rede então incrementa o contador de
    // propagandas perdidas. Se está com conexão então considera que não há problema por ação do usuário e 
    // zera este contador.
    this.utils.verificarOnline().then((online) => {
      if (online) {
        this.zerarPropagandasPerdidas()
        if (this.alertas)
          alert("ONline: zerou")
      }
      else {
        this.incrementarPropagandasPerdidas()
        if (this.alertas)
          alert("OFFline: incrementou")
      }
        
    })
  });

  interstitial = this.admobFree.on(this.admobFree.events.INTERSTITIAL_LOAD).subscribe((value) => {
    this.zerarPropagandasPerdidas()
    if (this.alertas)
      alert("carregou: zerou")
  })

  prepareInterstitialAds(){
    if (!this.comprasService.usuarioPremium) {
      this.admobFree.interstitial.isReady().then(ready => {
        // Prepara se não estiver pronto
        if (!ready) {
          let interstitialConfig: AdMobFreeInterstitialConfig = {
            isTesting: false,
            autoShow: false,
            id: "ca-app-pub-2818472978128447/7475351211"
          };
          this.admobFree.interstitial.config(interstitialConfig);
          this.admobFree.interstitial.prepare()
        }
      })
    }
  }

  showInterstitialAds(){
    if (!this.comprasService.usuarioPremium) {
      this.admobFree.interstitial.isReady().then(ready => {
        this.admobFree.interstitial.show().then(p => { })
      })
    }
  }

  hideBanner() {
    this.admobFree.banner.hide()
  }

  prepareBannerAd() {
    if (!this.comprasService.usuarioPremium && !this.bannerOk) {
      if (this.alertas)
        alert('tentando preparar')
      this.bannerOk = true
      let bannerConfig: AdMobFreeBannerConfig = {
        isTesting: false,
        autoShow: false,
        id: "ca-app-pub-2818472978128447/8556213188"
      };
      this.admobFree.banner.config(bannerConfig);
      this.admobFree.banner.prepare()
    }
  }

  showBannerAd() {
    if (!this.comprasService.usuarioPremium)
      this.admobFree.banner.show()
  }

  getPropagandasPerdidas() : any {
    return localStorage.getItem('propagandasPerdidas') != null ? parseInt(localStorage.getItem('propagandasPerdidas')) : 0
  }

  incrementarPropagandasPerdidas() {
    localStorage.setItem('propagandasPerdidas', this.getPropagandasPerdidas() + 1)
  }

  private zerarPropagandasPerdidas() {
    localStorage.setItem('propagandasPerdidas', '0');
  }

}
