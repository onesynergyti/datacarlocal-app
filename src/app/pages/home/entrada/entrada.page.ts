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
import { FuncionariosService } from 'src/app/dbproviders/funcionarios.service';
import { SelectPopupModalPage } from 'src/app/components/select-popup-modal/select-popup-modal.page';
import { Funcionario } from 'src/app/models/funcionario';

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
    private funcionariosProvider: FuncionariosService
  ) { 
    this.veiculo = navParams.get('veiculo')
    this.inclusao = navParams.get('inclusao')
  }

  ngOnInit() {
  }

  async abrirModalFuncionarios(funcionarios) {
    const modal = await this.modalCtrl.create({
      component: SelectPopupModalPage,
      componentProps: {
        'lista': funcionarios,
        'keyField': 'Nome',
        'titulo': 'Funcionários',
        'icone': 'person'
      }
    })

    modal.onWillDismiss().then((retorno) => {
      let funcionario = retorno.data
      if (funcionario != null) 
        this.veiculo.Funcionario = new Funcionario(funcionario)
    })

    return await modal.present(); 
  }

  async alterarFuncionario() {
    await this.funcionariosProvider.exibirProcessamento('Carregando funcionários...')
    this.funcionariosProvider.lista().then(funcionarios => {
      this.abrirModalFuncionarios(funcionarios)
    })
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

  async concluir(operacao = 'entrada') {
    this.avaliouFormulario = true

    const valido = this.veiculo.Placa && 
      this.veiculo.TipoVeiculo && 
      (!this.veiculo.EntregaAgendada || (this.veiculo.EntregaAgendada && this.veiculo.PossuiServicoAgendavel)) && // Agendamento exige um serviço que permita previsão
      (this.veiculo.Servicos != null && this.veiculo.Servicos.length > 0)
    if (!valido) {
      this.utils.mostrarToast('Preencha os campos corretamente', 'danger')
    }
    else {
      // Para finalizar o atendimento tem que finalizar os serviços
      if (operacao == 'finalizar' && this.veiculo.PossuiServicosPendentes) 
        this.utils.mostrarToast('Existem serviços pendentes de execução. Você deve excluir ou finalizar antes de realizar o pagamento.', 'danger', 3000)      
      else {
        await this.patioProvider.exibirProcessamento('Registrando entrada...')
        this.patioProvider.salvar(this.veiculo)
        .then((veiculo) => {
          this.modalCtrl.dismiss({ Operacao: operacao, Veiculo: veiculo })
        })
        .catch((erro) => {
          alert('Não foi possível inserir o veículo. ' + JSON.stringify(erro))
        })
      }
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
