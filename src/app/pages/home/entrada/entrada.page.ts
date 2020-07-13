import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, AlertController } from '@ionic/angular';
import { Veiculo } from 'src/app/models/veiculo';
import { PatioService } from 'src/app/dbproviders/patio.service';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';
import { Utils } from 'src/app/utils/utils';
import { CadastroServicoPage } from './cadastro-servico/cadastro-servico.page';
import { UtilsLista } from 'src/app/utils/utils-lista';
import { FuncionariosService } from 'src/app/dbproviders/funcionarios.service';
import { SelectPopupModalPage } from 'src/app/components/select-popup-modal/select-popup-modal.page';
import { Funcionario } from 'src/app/models/funcionario';
import { ConfiguracoesService } from 'src/app/services/configuracoes.service';
import { ValidarAcessoPage } from '../../validar-acesso/validar-acesso.page';
import { MensalistasService } from 'src/app/dbproviders/mensalistas.service';

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
  inclusao = false
  veiculo: Veiculo
  avaliouFormulario = false
  
  constructor(
    private modalCtrl: ModalController,
    private patioProvider: PatioService,
    public navParams: NavParams,
    public utils: Utils,
    public utilsLista: UtilsLista,
    private alertController: AlertController,
    private funcionariosProvider: FuncionariosService,
    public configuracoesService: ConfiguracoesService,
    private providerMensalistas: MensalistasService
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

  tratarPlaca(valor: string) {    
    if (valor != null && valor.length >= 3) {
      this.patioProvider.consultaHistoricoPlaca(valor).then(veiculo => {
        this.veiculo.Nome = veiculo.Nome
        this.veiculo.TipoVeiculo = veiculo.TipoVeiculo
        this.veiculo.Telefone = veiculo.Telefone
        this.veiculo.Modelo = veiculo.Modelo
      })
    }

    return valor.toUpperCase().replace(/[^a-zA-Z0-9]/g,'')
  }

  async procederCadastroServico(servico) {
    const inclusao = servico == null
    const modal = await this.modalCtrl.create({
      component: CadastroServicoPage,
      componentProps: {
        'servicoVeiculo': servico,
        'tipoVeiculo': this.veiculo.TipoVeiculo,
        'inclusao': inclusao
      }
    })

    modal.onWillDismiss().then((retorno) => {
      if (retorno.data != null) {
        const servico = retorno.data.ServicoVeiculo
        if (retorno.data.Operacao = 'cadastro') {
          // Não permite incluir serviço repetido
          if (inclusao && (this.veiculo.Servicos.find(servicoAtual => servicoAtual.Id == servico.Id )))
            this.utils.mostrarToast('O serviço informado já existe.', 'danger')
          else
            this.utilsLista.atualizarLista(this.veiculo.Servicos, servico)
        }
        else
          this.utilsLista.excluirDaLista(this.veiculo.Servicos, servico)
      }
    })

    return await modal.present(); 
  }

  async cadastrarServico(servico = null) {
    if (!this.veiculo.TipoVeiculo) {
      this.utils.mostrarToast('Informe o tipo do veículo antes de adicionar um serviço', 'danger')    
    }
    else {
      // Verifica permissão para editar serviços
      if (!this.configuracoesService.configuracoes.Seguranca.ExigirSenhaEditarServicosVeiculo || this.inclusao) {
        this.procederCadastroServico(servico)
      }
      else {
        const modal = await this.modalCtrl.create({
          component: ValidarAcessoPage,
          componentProps: {
            'mensagem': 'Informe a senha de administrador para prorrogar o pagamento.'
          }  
        });
    
        modal.onWillDismiss().then((retorno) => {
          if (retorno.data == true)
            this.procederCadastroServico(servico)
        })
    
        return await modal.present(); 
      }
    }
  }

  async concluir(operacao = 'entrada') {
    this.avaliouFormulario = true

    const valido = (this.veiculo.Placa && this.veiculo.Placa.length == 7) &&
      this.veiculo.TipoVeiculo && 
      (!this.veiculo.Modelo || this.veiculo.Modelo.length <= 30) && 
      (!this.veiculo.Nome || this.veiculo.Nome.length <= 100) && 
      (!this.veiculo.Localizacao || this.veiculo.Localizacao.length <= 50) && 
      (!this.veiculo.EntregaAgendada || (this.veiculo.EntregaAgendada && this.veiculo.PossuiServicoAgendavel)) && // Agendamento exige um serviço que permita previsão
      (this.veiculo.Servicos != null && this.veiculo.Servicos.length > 0) &&
      (!this.veiculo.Telefone || [0, 10, 11].includes(this.veiculo.Telefone.length))
    if (valido) {
      // Para finalizar o atendimento tem que finalizar os serviços
      if (operacao == 'finalizar' && this.veiculo.PossuiServicosPendentes) 
        this.utils.mostrarToast('Existem serviços pendentes de execução. Você deve excluir ou finalizar antes de realizar o pagamento.', 'danger', 3000)      
      // Edição ou inclusão
      else if (operacao != 'excluir') {
        await this.patioProvider.exibirProcessamento('Registrando entrada...')
        this.providerMensalistas.validarMensalista(this.veiculo.Entrada, this.veiculo.Placa).then((mensalistaValido: boolean) => {
          this.veiculo.Mensalista = mensalistaValido

          this.patioProvider.salvar(this.veiculo)
          .then((veiculo) => {
            this.modalCtrl.dismiss({ Operacao: operacao, Veiculo: veiculo })
          })
          .catch((erro) => {
            alert('Não foi possível inserir o veículo. ' + JSON.stringify(erro))
          })
        })
        .finally(() => {
          this.patioProvider.ocultarProcessamento()
        })
      }
      // Exclusão
      else 
        this.modalCtrl.dismiss({ Operacao: operacao, Veiculo: this.veiculo })
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
            this.utilsLista.excluirDaLista(this.veiculo.Servicos, servico)
          }
        }
      ]
    });

    await alert.present();
  }

  selecionarDataPrevisao() {
    const dataPrevisao = this.veiculo.PrevisaoEntrega != null ? new Date(this.veiculo.PrevisaoEntrega) : new Date()
    this.utils.selecionarData(dataPrevisao)
    .then(data => {
      data.setHours(dataPrevisao.getHours())
      data.setMinutes(dataPrevisao.getMinutes())
      this.veiculo.PrevisaoEntrega = data
    });
  }

  selecionarHoraPrevisao() {
    const dataPrevisao = this.veiculo.PrevisaoEntrega != null ? new Date(this.veiculo.PrevisaoEntrega) : new Date()
    this.utils.selecionarHora(dataPrevisao)
    .then(hora => {
      this.veiculo.PrevisaoEntrega = hora
    });
  }
}
