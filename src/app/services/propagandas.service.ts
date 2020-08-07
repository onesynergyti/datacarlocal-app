import { Injectable } from '@angular/core';
import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig, AdMobFreeRewardVideoConfig } from '@ionic-native/admob-free/ngx';
import { GlobalService } from './global.service';
import { ComprasService } from './compras.service';

@Injectable({
  providedIn: 'root'
})
export class PropagandasService {

  interstitialAdsOk = false
  bannerAdsOk = false
  premium = false

  constructor(
    private admobFree: AdMobFree,
    private globalService: GlobalService,
    private comprasService: ComprasService

  ) { 
    // Observa assinatura do usuário
    this.globalService.onAssinarPremium.subscribe(() => {
      this.premium = this.comprasService.usuarioPremium
      if (this.premium) {
        this.hideBanner()
      }      
    })

    // Avalia a cada hora se o cliente é premium
    setInterval(() => {
      this.premium = this.comprasService.usuarioPremium
    }, 3600000)
  }

  prepareInterstitialAds(){
    if (!this.premium) {
      let interstitialConfig: AdMobFreeInterstitialConfig = {
        isTesting: false,
        autoShow: false,
        id: "ca-app-pub-2818472978128447/7475351211"
      };
      this.admobFree.interstitial.config(interstitialConfig);
      this.admobFree.interstitial.prepare()
      .then(() => { this.interstitialAdsOk = true })
      .catch(() => { this.interstitialAdsOk = false })
    }
  }  

  showInterstitialAds(){
    if (this.interstitialAdsOk && !this.premium)
      this.admobFree.interstitial.show()
  }  

  hideBanner() {
    this.admobFree.banner.hide()
  }

  prepareBannerAd() {
    if (!this.premium) {
      let bannerConfig: AdMobFreeBannerConfig = {
        isTesting: false,
        autoShow: false,
        id: "ca-app-pub-2818472978128447/8556213188"
      };
      this.admobFree.banner.config(bannerConfig);
      this.admobFree.banner.prepare()
      .then(() => { this.bannerAdsOk = true })
      .catch(() => { this.bannerAdsOk = false })
    }
  }  

  showBannerAd() {
    if (this.bannerAdsOk && !this.premium)
      this.admobFree.banner.show()
  }  
}
