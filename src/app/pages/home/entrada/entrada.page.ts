import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Veiculo } from 'src/app/models/veiculo';
import { PatioService } from 'src/app/dbproviders/patio.service';
import { SelectPopupModalPage } from 'src/app/components/select-popup-modal/select-popup-modal.page';
import { ServicosService } from 'src/app/dbproviders/servicos.service';
import { ServicoVeiculo } from 'src/app/models/servico-veiculo';
import { ConfiguracoesService } from 'src/app/services/configuracoes.service';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';

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
  inclusao: boolean
  veiculo: Veiculo
  
  constructor(
    private modalCtrl: ModalController,
    private patioProvider: PatioService,
    private servicosProvider: ServicosService,
    private configuracoesService: ConfiguracoesService,
    public navParams: NavParams
  ) { 
    this.inclusao = navParams.get('veiculo') == null
    this.veiculo = this.inclusao ? new Veiculo() : navParams.get('veiculo')

    // Inicia valores quando for um novo veículo
    if (this.inclusao) {
      // Define a data de entrada
      this.veiculo.Entrada = new Date();

      // Define serviços de estacionamento
      if (this.configuracoesService.configuracoes.UtilizaEstacionamento) {
        let servico = new ServicoVeiculo()
        servico.Id = 0
        servico.Nome = 'Estacionamento'
        servico.Preco = 0
        this.veiculo.Servicos.push(servico)
      }      
    }
    alert(this.veiculo != null)
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
    this.patioProvider.adicionar(this.veiculo)
    .then(() => {
      this.modalCtrl.dismiss(this.veiculo)
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
    alert(JSON.stringify(this.veiculo))
  }
}
