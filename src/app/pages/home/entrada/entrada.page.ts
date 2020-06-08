import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, AlertController } from '@ionic/angular';
import { Veiculo } from 'src/app/models/veiculo';
import { PatioService } from 'src/app/dbproviders/patio.service';
import { SelectPopupModalPage } from 'src/app/components/select-popup-modal/select-popup-modal.page';
import { ServicosService } from 'src/app/dbproviders/servicos.service';
import { ServicoVeiculo } from 'src/app/models/servico-veiculo';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';
import { SaidaPage } from '../saida/saida.page';
import { Utils } from 'src/app/utils/utils';

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

  pagina = 'veiculo'
  pesquisa
  inclusao
  veiculo: Veiculo
  avaliouFormulario = false
  
  constructor(
    private modalCtrl: ModalController,
    private patioProvider: PatioService,
    private servicosProvider: ServicosService,
    public navParams: NavParams,
    private modalController: ModalController,
    public utils: Utils,
    private alertController: AlertController
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
        servicoVeiculo.Id = servico.Id
        servicoVeiculo.Nome = servico.Nome
        servicoVeiculo.PrecoMoto = servico.PrecoMoto
        servicoVeiculo.PrecoVeiculoPequeno = servico.PrecoVeiculoPequeno
        servicoVeiculo.PrecoVeiculoMedio = servico.PrecoVeiculoMedio
        servicoVeiculo.PrecoVeiculoGrande = servico.PrecoVeiculoGrande
        this.veiculo.Servicos.push(servicoVeiculo)
      }
    })

    return await modal.present(); 
  }

  async concluir() {
    this.avaliouFormulario = true

    const valido = this.veiculo.Placa && 
      this.veiculo.TipoVeiculo && 
      (!this.veiculo.EntregaAgendada || (this.veiculo.EntregaAgendada && this.veiculo.PossuiServicoAgendavel)) // Agendamento exige um serviço que permita previsão
      this.veiculo.Servicos != null && this.veiculo.Servicos.length > 0

    if (!valido) {
      this.utils.mostrarToast('Preencha os campos corretamente', 'danger')
    }
    else {
      await this.patioProvider.exibirProcessamento('Registrando entrada...')
      this.patioProvider.salvar(this.veiculo, this.inclusao)
      .then(() => {
        this.modalCtrl.dismiss({ Operacao: 'entrada', Veiculo: this.veiculo })
      })
      .catch(() => {
        alert('Não foi possível inserir o veículo')
      })
    }
  }

  definirPrevisaoEntrega() {
    if (this.veiculo.PrevisaoEntrega == null)
      this.veiculo.PrevisaoEntrega = new Date()
  }

  selecionarTipoVeiculo(tipoVeiculo) {
    this.veiculo.TipoVeiculo = tipoVeiculo
  }

  async finalizarSaida() {
    await this.patioProvider.exibirProcessamento('Atualizando listagem...')
    // Precisa do settimeout para ocultar a tela corretamente
    setTimeout(() => {
      this.patioProvider.ocultarProcessamento()
      this.modalCtrl.dismiss({ Operacao: 'excluir', Veiculo: this.veiculo })
    }, 300);
  }

  async registrarSaida() {
    if (this.veiculo.PossuiServicosPendentes) 
      this.utils.mostrarToast('Existem serviços pendentes de execução. Você deve excluir ou finalizar antes de realizar o pagamento.', 'danger', 3000)      
    else {
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

  selecionarDataPrevisao() {
    this.utils.selecionarData(this.veiculo.PrevisaoEntrega ? new Date(this.veiculo.PrevisaoEntrega) : new Date())
    .then(data => {
      data.setHours(new Date(this.veiculo.PrevisaoEntrega).getHours())
      data.setMinutes(new Date(this.veiculo.PrevisaoEntrega).getMinutes())
      this.veiculo.PrevisaoEntrega = data
    });
  }

  selecionarHoraPrevisao() {
    this.utils.selecionarHora(new Date(this.veiculo.PrevisaoEntrega))
    .then(hora => {
      this.veiculo.PrevisaoEntrega = hora
    });
  }
}
