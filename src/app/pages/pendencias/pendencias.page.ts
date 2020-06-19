import { Component, OnInit } from '@angular/core';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';
import { PatioService } from 'src/app/dbproviders/patio.service';
import { ModalController } from '@ionic/angular';
import { Utils } from 'src/app/utils/utils';
import { ConfiguracoesService } from 'src/app/services/configuracoes.service';
import { Movimento } from 'src/app/models/movimento';
import { SaidaPage } from '../home/saida/saida.page';
import { PropagandasService } from 'src/app/services/propagandas.service';
import { BluetoothService } from 'src/app/services/bluetooth.service';

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
  pesquisa

  constructor(
    private providerPatio: PatioService,
    private modalController: ModalController,
    private utils: Utils,
    public propagandaService: PropagandasService,
    public bluetooth: BluetoothService
  ) { }

  ngOnInit() {
  }

  atualizarPatio() {
    this.veiculos = []
    this.carregandoVeiculos = true
    this.providerPatio.lista(false, true).then((lista: any) => {
      this.veiculos = lista
    })    
    // Em caso de erro
    .catch((erro) => {
      alert(JSON.stringify('Não foi possível carregar as pendências de pagamento.'))
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

  async avaliarRetornoVeiculo(retorno, inclusao) {
    if (retorno.data != null) {        
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
          this.propagandaService.showInterstitialAds()
        }, 3000);
        this.utils.mostrarToast('Conclusão dos serviços realizada com sucesso', 'success')
      }
      else
        this.utils.mostrarToast(inclusao ? 'Veículo adicionado com sucesso' : 'Alteração realizada com sucesso', 'success')        
    }
  }

  async registrarSaida(veiculo) {
/*    if (veiculo.PossuiServicosPendentes) 
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
    }*/
  }

}
