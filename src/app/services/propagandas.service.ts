import { Injectable } from '@angular/core';
import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig, AdMobFreeRewardVideoConfig } from '@ionic-native/admob-free/ngx';

@Injectable({
  providedIn: 'root'
})
export class PropagandasService {

  interstitialAdsOk = false
  bannerAdsOk = false

  constructor(
    private admobFree: AdMobFree    
  ) { 
    // this.showBannerAd()
  }

  prepareInterstitialAds(){
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

  showInterstitialAds(){
    if (this.interstitialAdsOk)
      this.admobFree.interstitial.show()
  }  

  hideBanner() {
    this.admobFree.banner.hide()
  }

  prepareBannerAd() {
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

  showBannerAd() {
    if (this.bannerAdsOk)
      this.admobFree.banner.show()
  }  
}
