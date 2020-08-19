import { Injectable } from '@angular/core';
import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig, AdMobFreeRewardVideoConfig } from '@ionic-native/admob-free/ngx';
import { GlobalService } from './global.service';
import { ComprasService } from './compras.service';

@Injectable({
  providedIn: 'root'
})
export class PropagandasService {

  bannerOk = false

  constructor(
    private admobFree: AdMobFree,
    private globalService: GlobalService,
    private comprasService: ComprasService

  ) { }

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
        this.admobFree.interstitial.show()
      })
    }
  }  

  hideBanner() {
    this.admobFree.banner.hide()
  }

  prepareBannerAd() {
    if (!this.comprasService.usuarioPremium && !this.bannerOk) {
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
}
