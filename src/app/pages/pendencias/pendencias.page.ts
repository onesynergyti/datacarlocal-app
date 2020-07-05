import { Component, OnInit } from '@angular/core';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';
import { PatioService } from 'src/app/dbproviders/patio.service';
import { ModalController, AlertController } from '@ionic/angular';
import { Utils } from 'src/app/utils/utils';
import { PropagandasService } from 'src/app/services/propagandas.service';
import { BluetoothService } from 'src/app/services/bluetooth.service';
import { SaidaPage } from '../home/saida/saida.page';
import { Movimento } from 'src/app/models/movimento';
import { ConfiguracoesService } from 'src/app/services/configuracoes.service';
import { ValidarAcessoPage } from '../validar-acesso/validar-acesso.page';

@Component({
  selector: 'app-pendencias',
  templateUrl: './pendencias.page.html',
  styleUrls: ['./pendencias.page.scss'],
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
export class PendenciasPage implements OnInit {

  veiculos = []
  carregandoVeiculos = false
  pesquisa = ''

  constructor(
    private providerPatio: PatioService,
    private modalController: ModalController,
    private utils: Utils,
    public propagandaService: PropagandasService,
    public bluetooth: BluetoothService,
    public configuracoesService: ConfiguracoesService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.atualizarPendencias()
  }

  atualizarPendencias() {
    this.veiculos = []
    this.carregandoVeiculos = true
    this.providerPatio.lista(false, true).then((lista: any) => {
      this.veiculos = lista
    })    
    // Em caso de erro
    .catch((erro) => {
      alert(JSON.stringify('Não foi possível carregar as pendências de pagamento. ' + erro))
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
    if (!this.configuracoesService.configuracoes.Seguranca.ExigirSenhaExcluirVeiculoPatio) {
      const alert = await this.alertController.create({
        header: 'Excluir veículo ' + veiculo.Placa,
        message: 'Deseja realmente excluir o veículo?',
        buttons: [
          {
            text: 'Não',
            role: 'cancel',
            cssClass: 'secondary',
          }, {
            text: 'Sim',
            handler: () => {
              this.confirmarExclusao(veiculo)
            }
          }
        ]  
      });
    
      await alert.present();
    }
    else {
      const modal = await this.modalController.create({
        component: ValidarAcessoPage,
        componentProps: {
          'mensagem': 'Informe a senha de administrador para excluir o veículo.'
        }  
      });
  
      modal.onWillDismiss().then((retorno) => {
        if (retorno.data == true)
          this.confirmarExclusao(veiculo)
      })
  
      return await modal.present(); 
    }
  }

  async confirmarExclusao(veiculo) {
    await this.providerPatio.exibirProcessamento('Excluindo veículo...')
    this.providerPatio.excluir(veiculo.Id)
    .then(() => {
      this.veiculos.splice(this.veiculos.indexOf(veiculo), 1)
    })
    .catch(() => {
      this.utils.mostrarToast('Não foi possível excluir o veículo.', 'danger')
    })
  }

  abrirWhatsapp(veiculo) {
    if (veiculo.Telefone && veiculo.Telefone.length >= 10)
      veiculo.enviarMensagemWhatsapp(veiculo.Telefone)
    else
      this.utils.mostrarToast('Não foi registrado o contato para esse veículo', 'danger')
  }

  async avaliarRetornoVeiculo(retorno, inclusao) {
    if (retorno.data != null) {        
      if (retorno.data.Operacao == 'excluir') {
        this.excluir(retorno.data.Veiculo)
      }
      else {
        const veiculos = retorno.data.Movimento.Veiculos

        // Exclui os veículos
        veiculos.slice().forEach(veiculoAtual => {
          this.veiculos.splice(this.veiculos.indexOf(this.veiculos.find(itemAtual => itemAtual.Placa === veiculoAtual.Placa)), 1)
        });
        
        if (this.bluetooth.dispositivoSalvo != null) {
          await this.bluetooth.exibirProcessamento('Comunicando com a impressora...')
          alert(JSON.stringify(retorno.data.Movimento))
          this.bluetooth.imprimirRecibo(retorno.data.Movimento, 'pagamento')
        }
  
        // Exibe uma propagando na saída do veículo
        setTimeout(() => {
          this.propagandaService.showInterstitialAds()
        }, 3000);
  
        this.utils.mostrarToast('Pagamento dos serviços realizada com sucesso', 'success')
      }
    }
  }

  async registrarSaida(veiculos) {
    if (veiculos.length == 0) {
      this.utils.mostrarToast('Nenhuma pendência localizada.', 'danger')
      return
    }
    
    // Os veículos para pagamento devem ter a mesma placa e o mesmo tipo
    const veiculoBase = veiculos[0]
    if (veiculos.find(itemAtual => itemAtual.Placa != veiculoBase.Placa || itemAtual.TipoVeiculo != veiculoBase.TipoVeiculo)) {
      this.utils.mostrarToast('Pague sempre pendências de veículos iguais.', 'danger')
      return
    }

    let movimento = new Movimento()
    movimento.Data = new Date
    movimento.Veiculos = veiculos.slice()
    movimento.Descricao = 'Pagamentos de serviços pendentes'

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
