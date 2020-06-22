import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, AlertController } from '@ionic/angular';
import { Veiculo } from 'src/app/models/veiculo';
import { PatioService } from 'src/app/dbproviders/patio.service';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';
import { SaidaPage } from '../saida/saida.page';
import { Utils } from 'src/app/utils/utils';
import { Movimento } from 'src/app/models/movimento';
import { CalculadoraEstacionamentoService } from 'src/app/services/calculadora-estacionamento.service';
import { CadastroServicoPage } from './cadastro-servico/cadastro-servico.page';
import { UtilsLista } from 'src/app/utils/utils-lista';

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
    public navParams: NavParams,
    private modalController: ModalController,
    public utils: Utils,
    public utilsLista: UtilsLista,
    private alertController: AlertController,
  ) { 
    this.veiculo = navParams.get('veiculo')
    this.inclusao = navParams.get('inclusao')
  }

  ngOnInit() {
  }

  cancelar() {
    this.modalCtrl.dismiss()
  }

  consultarPlaca() {
    if (this.veiculo.Placa && this.veiculo.Placa.length >= 3) {
      this.patioProvider.consultaHistoricoPlaca(this.veiculo.Placa).then(veiculo => {
        this.veiculo.Nome = veiculo.Nome
        this.veiculo.TipoVeiculo = veiculo.TipoVeiculo
        this.veiculo.Telefone = veiculo.Telefone
        this.veiculo.Modelo = veiculo.Modelo
      })
    }
  }

  async cadastrarServico(servico = null) {
    if (!this.veiculo.TipoVeiculo) {
      this.utils.mostrarToast('Informe o tipo do veículo antes de adicionar um serviço', 'danger')
    }

    const modal = await this.modalCtrl.create({
      component: CadastroServicoPage,
      componentProps: {
        'servicoVeiculo': servico,
        'tipoVeiculo': this.veiculo.TipoVeiculo,
        'inclusao': servico == null
      }
    })

    modal.onWillDismiss().then((retorno) => {
      if (retorno.data != null) {
        const servico = retorno.data.ServicoVeiculo
        if (retorno.data.Operacao = 'cadastro') 
          this.utilsLista.atualizarLista(this.veiculo.Servicos, servico)
        else
          this.utilsLista.excluirDaLista(this.veiculo.Servicos, servico)
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
      this.patioProvider.salvar(this.veiculo)
      .then((veiculo) => {
        this.modalCtrl.dismiss({ Operacao: 'entrada', Veiculo: veiculo })
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

  async excluirServico(servico) {
    const alert = await this.alertController.create({
      header: 'Excluir serviço?',
      message: `Tem certeza que deseja excluir o serviço <string>${servico.Nome}</strong>`,
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Sim',
          handler: () => {
            this.veiculo.excluirServico(servico)
          }
        }
      ]
    });

    await alert.present();
  }

  registrarSaida() {
    if (this.veiculo.PossuiServicosPendentes) 
      this.utils.mostrarToast('Existem serviços pendentes de execução. Você deve excluir ou finalizar antes de realizar o pagamento.', 'danger', 3000)      
    else {
      this.modalController.dismiss({ Operacao: 'finalizar', Veiculo: this.veiculo })
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
