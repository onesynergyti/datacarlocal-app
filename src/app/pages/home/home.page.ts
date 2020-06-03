import { Component } from '@angular/core';
import { Veiculo } from '../../models/veiculo';
import { PatioService } from '../../dbproviders/patio.service';
import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig, AdMobFreeRewardVideoConfig } from '@ionic-native/admob-free/ngx';
import { ModalController, ActionSheetController } from '@ionic/angular';
import { EntradaPage } from './entrada/entrada.page';
import { BluetoothService } from '../../services/bluetooth.service';
import { Utils } from 'src/app/utils/utils';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';
import { SaidaPage } from './saida/saida.page';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { DatabaseService } from 'src/app/dbproviders/database.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  animations: [
    trigger('listAnimation', [
      transition('* <=> *', [
        query(':enter',
          [style({ opacity: 0 }), stagger('40ms', animate('800ms ease-out', style({ opacity: 1 })))],
          { optional: true }
        ),
        query(':leave',
          [style({ opacity: 1 }), stagger('40ms', animate('800ms ease-out', style({ opacity: 0 })))],
          { optional: true }
        )
      ])
    ])
  ]
})
export class HomePage {

  carregandoVeiculos = false
  veiculos = []
  placa
  pontos = 0
  veiculoFalhaImpressao = null
  pesquisa = ''

  constructor(
    private providerPatio: PatioService,
    private admobFree: AdMobFree,
    private modalController: ModalController,
    private bluetooth: BluetoothService,
    private utils: Utils,
    private actionSheetController: ActionSheetController,
    private barcodeScanner: BarcodeScanner,
    private databaseProvider: DatabaseService
  ) {
    document.addEventListener(this.admobFree.events.REWARD_VIDEO_REWARD, (result) => {
      this.pontos++
    });     

    this.bluetooth.onDefinirDispositivo.subscribe((dispositivo) => {
      // Verifica se houve uma falha na impressão para tentar reimprimir
      if (this.veiculoFalhaImpressao != null) {
        // Se houve sucesso na conexão faz a impressão
        if (dispositivo != null) 
          this.bluetooth.imprimirRecibo(this.veiculoFalhaImpressao)
        else 
          this.utils.mostrarToast('Houve uma falha na tentativa de impressão. Verifique sua impressora', 'warning')
      }
      // Limpa o registro de falha, pois só tenta reimprimir uma vez
      this.veiculoFalhaImpressao = null
    })
  }

  ionViewDidEnter() {
    this.atualizarPatio()
    this.showBannerAd()
  }

  async abrirMenuOperacao() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Operação',
      buttons: [{
        text: 'Entrada de Veículo',
        icon: 'log-in-outline',
        handler: () => {
          this.cadastrarEntrada()
        }
      }, {
        text: 'Saída de Veículo',
        role: 'destructive',
        icon: 'log-out-outline',
        handler: () => {
          this.leituraQrCode()
        }
      }]
    });
    await actionSheet.present();
  }

  atualizarPatio() {
    this.veiculos = []
    this.carregandoVeiculos = true
    this.providerPatio.lista().then((lista: any) => {
      this.veiculos = lista
    })    
    // Em caso de erro
    .catch((erro) => {
      alert(JSON.stringify(erro))
    })
    .finally(() => {
      this.carregandoVeiculos = false
    })
  }

  dataFormatada(veiculo: Veiculo) {
    const data = new Date(veiculo.Entrada)
    return data.getDate() + '/' +
    (data.getMonth() + 1) + '/' +
    data.getFullYear() + ' - ' +
    data.getHours() + ':' +
    data.getMinutes()
  }

  get listaFiltrada() {
    if (this.pesquisa == '')
      return this.veiculos

    return this.veiculos.filter(itemAtual => this.utils.stringPura(itemAtual.Placa).includes(this.utils.stringPura(this.pesquisa)))
  }

  async excluir(veiculo) {
/*    await this.providerPatio.exibirProcessamento('Excluindo veículo...')
    this.providerPatio.excluir(veiculo.Placa)
    .then(retorno => {
      this.veiculos.splice(this.veiculos.indexOf(veiculo), 1)
    })
    .catch(() => {
      this.utils.mostrarToast('Não foi possível excluir o veículo.', 'danger')
    })*/
  }

  async cadastrarEntrada(veiculo = null) {
    const modal = await this.modalController.create({
      component: EntradaPage,
      componentProps: {
        'veiculo': veiculo
      }
    });

    modal.onDidDismiss().then((retorno) => {
      let veiculo = retorno.data
      if (veiculo != null) {        
        this.veiculos.push(veiculo)
        this.utils.mostrarToast('Entrada registrada com sucesso', 'success')
        // Se existe configuração de impressora
        if (this.bluetooth.dispositivoSalvo != null) {
          this.bluetooth.validarConexao().then((conexao) => {
            if (conexao)
              this.bluetooth.imprimirRecibo(veiculo)
            else {
              this.veiculoFalhaImpressao = veiculo
              // Tenta conectar novamente para imprimir se conseguir
              // Veja onDefinirDispositivo no construtor
              // Aguarda 5 segundos para que o usuário possa visualizar a mensagem de sucesso no registro
              setTimeout(() => { this.bluetooth.conectarDispositivo(this.bluetooth.dispositivoSalvo) }, 5000);
            }
          })
        }
      }
    })

    return await modal.present(); 
  }

  async leituraQrCode() {
    this.barcodeScanner.scan().then(barcodeData => {      
      if (barcodeData != null) {
        let veiculo = this.veiculos.find(itemAtual => this.utils.stringPura(itemAtual.Placa) == this.utils.stringPura(barcodeData.text))
        if (veiculo != null)
          this.registrarSaida(veiculo)
        else
          this.utils.mostrarToast('Não localizamos o código informado.', 'danger')
        }
     }).catch(err => {
      this.utils.mostrarToast('Não localizamos o código informado.', 'danger')
     });
  }

  async registrarSaida(veiculo) {
    const modal = await this.modalController.create({
      component: SaidaPage,
      componentProps: {
        'veiculo': veiculo
      }
    });

    modal.onWillDismiss().then((retorno) => {
      let veiculoSaida = retorno.data
      if (veiculoSaida != null) {
        this.veiculos.splice(this.veiculos.indexOf(veiculo), 1)
      }
    })

    return await modal.present(); 
  }
   
  showInterstitialAds(){
    let interstitialConfig: AdMobFreeInterstitialConfig = {
        isTesting: true, // Remove in production
        autoShow: true//,
        //id: "ca-app-pub-3940256099942544/6300978111"
    };
    this.admobFree.interstitial.config(interstitialConfig);
    this.admobFree.interstitial.prepare().then(() => { })
  }  

  showRewardVideoAds(){
    let RewardVideoConfig: AdMobFreeRewardVideoConfig = {
        isTesting: true, // Remove in production
        autoShow: true//,
        //id: "ca-app-pub-3940256099942544/6300978111"
    };
    this.admobFree.rewardVideo.config(RewardVideoConfig);    

    this.admobFree.rewardVideo.prepare().then(() => {})
  }

  showBannerAd() {
    let bannerConfig: AdMobFreeBannerConfig = {
        isTesting: false,
        autoShow: true,
        id: "ca-app-pub-2818472978128447/8556213188"
    };
    this.admobFree.banner.config(bannerConfig);

    this.admobFree.banner.prepare().then(() => { })
  }  
}
