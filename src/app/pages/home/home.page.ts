import { Component } from '@angular/core';
import { Veiculo } from '../../models/veiculo';
import { PatioService } from '../../dbproviders/patio.service';
import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig, AdMobFreeRewardVideoConfig } from '@ionic-native/admob-free/ngx';
import { ModalController, ActionSheetController } from '@ionic/angular';
import { EntradaPage } from './entrada/entrada.page';
import { BluetoothService } from '../../services/bluetooth.service';
import { Utils } from 'src/app/utils/utils';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ConfiguracoesService } from 'src/app/services/configuracoes.service';
import { ServicoVeiculo } from 'src/app/models/servico-veiculo';

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
    private configuracoesService: ConfiguracoesService
  ) {
    //this.showBannerAd()

    this.bluetooth.onDefinirDispositivo.subscribe((dispositivo) => {
      // Verifica se houve uma falha na impressão para tentar reimprimir
      if (this.veiculoFalhaImpressao != null) {
        // Se houve sucesso na conexão faz a impressão
        if (dispositivo != null) 
          this.veiculoFalhaImpressao.Excluir ? this.bluetooth.imprimirReciboSaida(this.veiculoFalhaImpressao.Veiculo) : this.bluetooth.imprimirReciboEntrada(this.veiculoFalhaImpressao.Veiculo)
        else 
          this.utils.mostrarToast('Houve uma falha na tentativa de impressão. Verifique sua impressora', 'warning')
      }
      // Limpa o registro de falha, pois só tenta reimprimir uma vez
      this.veiculoFalhaImpressao = null
    })
  }

  ionViewDidEnter() {
    this.atualizarPatio()
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
      alert(JSON.stringify('Não foi possível carregar os veículos do pátio.'))
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
    let inclusao = false
    let veiculoEdicao: Veiculo

    // Define os parâmetros iniciais se não houver veículo indicado para edição
    if (veiculo == null) {
      inclusao = true

      veiculoEdicao = new Veiculo()      
      veiculoEdicao.Id = 0

      // Define a data de entrada
      veiculoEdicao.Entrada = new Date();

      // Define serviços de estacionamento
      if (this.configuracoesService.configuracoes.UtilizaEstacionamento) {
        let servico = new ServicoVeiculo()
        servico.Id = 0
        servico.Nome = 'Estacionamento'
        veiculoEdicao.Servicos.push(servico)
      }      
    }
    else {
      veiculoEdicao = JSON.parse(JSON.stringify(veiculo))
      veiculoEdicao.Entrada = new Date(veiculoEdicao.Entrada)
    }

    const modal = await this.modalController.create({
      component: EntradaPage,
      componentProps: {
        'veiculo': veiculoEdicao,
        'inclusao': inclusao
      }
    });

    modal.onWillDismiss().then((retorno) => {
      if (retorno.data != null) {        
        let veiculo = retorno.data.Veiculo
        
        // Atualiza a listagem com as alterações
        const veiculoLocalizado = this.veiculos.find(itemAtual => itemAtual.Placa === veiculo.Placa)
        
        if (retorno.data.Excluir) 
          this.veiculos.splice(this.veiculos.indexOf(veiculoLocalizado), 1)
        else if (veiculoLocalizado != null) 
          this.veiculos[this.veiculos.indexOf(veiculoLocalizado)] = veiculo
        else
          this.veiculos.push(veiculo)

        if (retorno.data.Excluir) {
          // Exibe uma propagando na saída do veículo
          setTimeout(() => {
            this.showInterstitialAds()
          }, 3000);
          this.utils.mostrarToast('Conslusão dos serviços realizada com sucesso', 'success')
        }
        else
          this.utils.mostrarToast(inclusao ? 'Veículo adicionado com sucesso' : 'Alteração realizada com sucesso', 'success')

        // Trata a impressão do recibo
        if (this.bluetooth.dispositivoSalvo != null) {
          this.bluetooth.validarConexao().then((conexao) => {
            if (conexao)
              retorno.data.Excluir ? this.bluetooth.imprimirReciboSaida : this.bluetooth.imprimirReciboEntrada(veiculo)
            else {
              this.veiculoFalhaImpressao = retorno.data
              // Tenta conectar novamente para imprimir se conseguir
              // Veja onDefinirDispositivo no construtor
              // Aguarda 5 segundos para que o usuário possa visualizar a mensagem de sucesso no registro
              setTimeout(() => { this.bluetooth.conectarDispositivo(this.bluetooth.dispositivoSalvo) }, 2000);
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
          this.cadastrarEntrada(veiculo)
        else
          this.utils.mostrarToast('Não localizamos o código informado.', 'danger')
        }
     }).catch(err => {
      this.utils.mostrarToast('Não localizamos o código informado.', 'danger')
     });
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
