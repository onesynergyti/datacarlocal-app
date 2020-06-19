import { Injectable } from '@angular/core';
import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig, AdMobFreeRewardVideoConfig } from '@ionic-native/admob-free/ngx';

@Injectable({
  providedIn: 'root'
})
export class PropagandasService {

  constructor(
    private admobFree: AdMobFree    
  ) { 
    this.showBannerAd()
  }

  showInterstitialAds(){
    let interstitialConfig: AdMobFreeInterstitialConfig = {
        isTesting: false,
        autoShow: true,
        id: "ca-app-pub-2818472978128447/7475351211"
    };
    this.admobFree.interstitial.config(interstitialConfig);
    this.admobFree.interstitial.prepare().then(() => { })
  }  

  showBannerAd() {
    let bannerConfig: AdMobFreeBannerConfig = {
        isTesting: false,
        autoShow: true,
        id: "ca-app-pub-2818472978128447/8556213188"
    };
    this.admobFree.banner.config(bannerConfig);

    this.admobFree.banner.prepare()
    .then(() => { })
    // Em caso de erro tenta novamente em 10 minutos
    .catch(() => {
      setTimeout(() => {
        this.showBannerAd()
      }, 600000);
    })
  }  
}
