import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Veiculo } from 'src/app/models/veiculo';
import { PatioService } from 'src/app/dbproviders/patio.service';
import { SelectPopupModalPage } from 'src/app/components/select-popup-modal/select-popup-modal.page';
import { ServicosService } from 'src/app/dbproviders/servicos.service';
import { ServicoVeiculo } from 'src/app/models/servico-veiculo';
import { ConfiguracoesService } from 'src/app/services/configuracoes.service';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';
import { SaidaPage } from '../saida/saida.page';

@Component({
  selector: 'app-entrada',
  templateUrl: './entrada.page.html',
  styleUrls: ['./entrada.page.scss'],
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
export class EntradaPage implements OnInit {

  pesquisa
  inclusao
  veiculo: Veiculo
  
  constructor(
    private modalCtrl: ModalController,
    private patioProvider: PatioService,
    private servicosProvider: ServicosService,
    public navParams: NavParams,
    private modalController: ModalController
  ) { 
    this.veiculo = navParams.get('veiculo')
    this.inclusao = navParams.get('inclusao')
  }

  ngOnInit() {
  }

  cancelar() {
    this.modalCtrl.dismiss()
  }

  async adicionarServico() {
    await this.servicosProvider.exibirProcessamento('Listando serviços...')
    this.servicosProvider.lista().then((servicos => {
      this.selecionarServico(servicos)
    }))    
  }

  async selecionarServico(servicos) {
    const modal = await this.modalCtrl.create({
      component: SelectPopupModalPage,
      componentProps: {
        'lista': servicos,
        'keyField': 'Nome',
        'titulo': 'Serviços',
        'icone': 'construct'
      }
    })

    modal.onWillDismiss().then((retorno) => {
      let servico = retorno.data
      if (servico != null) {
        let servicoVeiculo = new ServicoVeiculo()
        servicoVeiculo.Nome = servico.Nome
        servicoVeiculo.Preco = servico.PrecoMoto
        this.veiculo.Servicos.push(servicoVeiculo)
      }
    })

    return await modal.present(); 
  }

  async concluir() {
    await this.patioProvider.exibirProcessamento('Registrando entrada...')
    this.patioProvider.salvar(this.veiculo, this.inclusao)
    .then(() => {
      this.modalCtrl.dismiss({ Excluir: false, Veiculo: this.veiculo })
    })
    .catch(() => {
      alert('Não foi possível inserir o veículo')
    })
  }

  get dataFormatada() {
    return this.veiculo.Entrada.getDate() + '/' +
      (this.veiculo.Entrada.getMonth() + 1) + '/' +
      this.veiculo.Entrada.getFullYear() + ' - ' +
      this.veiculo.Entrada.getHours() + ':' +
      this.veiculo.Entrada.getMinutes()
  }

  selecionarTipoVeiculo(tipoVeiculo) {
    this.veiculo.TipoVeiculo = tipoVeiculo
  }

  async finalizarSaida() {
    await this.patioProvider.exibirProcessamento('Atualizando listagem...')
    // Precisa do settimeout para ocultar a tela corretamente
    setTimeout(() => {
      this.patioProvider.ocultarProcessamento()
      this.modalCtrl.dismiss({ Excluir: true, Veiculo: this.veiculo })
    }, 300);
  }

  async registrarSaida() {
    const modal = await this.modalController.create({
      component: SaidaPage,
      componentProps: {
        'veiculo': this.veiculo
      }
    });

    modal.onWillDismiss().then((retorno) => {
      if (retorno.data)
        this.finalizarSaida()
    })

    return await modal.present(); 
  }
}
