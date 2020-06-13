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
import { SaidaPage } from './saida/saida.page';
import { Movimento } from 'src/app/models/movimento';

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
  pesquisa = ''

  constructor(
    private providerPatio: PatioService,
    private admobFree: AdMobFree,
    private modalController: ModalController,
    public bluetooth: BluetoothService,
    private utils: Utils,
    private actionSheetController: ActionSheetController,
    private barcodeScanner: BarcodeScanner,
    private configuracoesService: ConfiguracoesService
  ) { 
    this.showBannerAd()
  }

  ionViewDidEnter() {
    this.atualizarPatio()
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

  abrirWhatsapp(veiculo) {
    if (veiculo.Telefone && veiculo.Telefone.length >= 10)
      veiculo.enviarMensagemWhatsapp(veiculo.Telefone)
    else
      this.utils.mostrarToast('Não foi registrado o contato para esse veículo', 'danger')
  }

  async cadastrarEntrada(veiculo = null) {
    let inclusao = false
    let veiculoEdicao: Veiculo

    // Define os parâmetros iniciais se não houver veículo indicado para edição
    if (veiculo == null) {
      // Trata mensagens e ações quando for ateração ou inclusão de novo veículo
      inclusao = true

      veiculoEdicao = new Veiculo()      

      // Define serviços de estacionamento
      if (this.configuracoesService.configuracoes.UtilizaEstacionamento) {
        let servico = new ServicoVeiculo()
        servico.Id = 0
        servico.Nome = 'Estacionamento'
        veiculoEdicao.Servicos.push(servico)
      }      
    }
    else 
      veiculoEdicao = new Veiculo(veiculo)    

    const modal = await this.modalController.create({
      component: EntradaPage,
      componentProps: {
        'veiculo': veiculoEdicao,
        'inclusao': inclusao
      }
    });

    modal.onWillDismiss().then((retorno) => {
      this.avaliarRetornoVeiculo(retorno, inclusao)
    })

    return await modal.present(); 
  }

  async avaliarRetornoVeiculo(retorno, inclusao) {
    if (retorno.data != null) {        
      alert('chegou aqui' + JSON.stringify(retorno))
      // A saída do veículo retorna o movimento completo
      let veiculo = retorno.data.Operacao == 'excluir' ? retorno.data.Movimento.Veiculo : retorno.data.Veiculo
      
      // Atualiza a listagem com as alterações
      const veiculoLocalizado = this.veiculos.find(itemAtual => itemAtual.Placa === veiculo.Placa)

      // Saída de veículo, exclui o item
      if (retorno.data.Operacao == 'excluir') {
        alert('vai excluir')
        this.veiculos.splice(this.veiculos.indexOf(veiculoLocalizado), 1)
        if (this.bluetooth.dispositivoSalvo != null) {
          await this.bluetooth.exibirProcessamento('Comunicando com a impressora...')
          this.bluetooth.imprimirRecibo(retorno.data.Movimento, 'saida')
        }
      }
      // Alteração do veículo, altera o item
      else if (veiculoLocalizado != null) {
        this.veiculos[this.veiculos.indexOf(veiculoLocalizado)] = veiculo
      }
      // Inclusão do veículo, adiciona o item
      else {
        // Se for inclusão imprime o recibo
        this.veiculos.push(veiculo)
        if (this.bluetooth.dispositivoSalvo != null) { 
          await this.bluetooth.exibirProcessamento('Comunicando com a impressora...')
          this.bluetooth.imprimirRecibo(retorno.data.Veiculo)
        }
      }

      if (retorno.data.Operacao == 'excluir') {
        // Exibe uma propagando na saída do veículo
        setTimeout(() => {
          this.showInterstitialAds()
        }, 3000);
        this.utils.mostrarToast('Conclusão dos serviços realizada com sucesso', 'success')
      }
      else
        this.utils.mostrarToast(inclusao ? 'Veículo adicionado com sucesso' : 'Alteração realizada com sucesso', 'success')        
    }
  }

  async leituraQrCode() {
    this.barcodeScanner.scan().then(barcodeData => {      
      if (barcodeData.text != '') {
        let veiculo = this.veiculos.find(itemAtual => this.utils.stringPura(itemAtual.Placa) == this.utils.stringPura(barcodeData.text))
        if (veiculo != null)
          this.cadastrarEntrada(veiculo)
        else
          this.utils.mostrarToast('Não localizamos o código informado.', 'danger')
      }
    })
  }

  async imprimirReciboEntrada(veiculo) {
    await this.bluetooth.exibirProcessamento('Comunicando com a impressora...')
    this.bluetooth.imprimirRecibo(veiculo)
  }
   
  async registrarSaida(veiculo) {
    if (veiculo.PossuiServicosPendentes) 
      this.utils.mostrarToast('Existem serviços pendentes de execução. Você deve finalizar todos os serviços ou excluir antes de realizar o pagamento.', 'danger', 3000)
    else {
      let movimento = new Movimento()
      movimento.Data = new Date
      movimento.Veiculo = veiculo

      const modal = await this.modalController.create({
        component: SaidaPage,
        componentProps: {
          'movimento': movimento
        }
      });
  
      modal.onWillDismiss().then((retorno) => {
        this.avaliarRetornoVeiculo(retorno, false)
      })
  
      return await modal.present(); 
    }
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
