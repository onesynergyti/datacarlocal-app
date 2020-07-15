import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, AlertController } from '@ionic/angular';
import { MensalistasService } from 'src/app/dbproviders/mensalistas.service';
import { VeiculoCadastro } from 'src/app/models/veiculo-cadastro';
import { CadastroVeiculoPage } from './cadastro-veiculo/cadastro-veiculo.page';
import { UtilsLista } from 'src/app/utils/utils-lista';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';
import { Movimento } from 'src/app/models/movimento';
import { CadastroPagamentoPage } from './cadastro-pagamento/cadastro-pagamento.page';
import { Utils } from 'src/app/utils/utils';
import { Mensalista } from 'src/app/models/mensalista';
import { SelectPopupModalPage } from 'src/app/components/select-popup-modal/select-popup-modal.page';

@Component({
  selector: 'app-cadastro-mensalista',
  templateUrl: './cadastro-mensalista.page.html',
  styleUrls: ['./cadastro-mensalista.page.scss'],
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
export class CadastroMensalistaPage implements OnInit {

  pagina = 'veiculos'
  mensalista: Mensalista
  movimentos = []
  carregandoMovimentos = false
  movimentosExclusao = []
  avaliouFormulario = false
  listaServicos = []

  constructor(
    private alertController: AlertController,
    private modalCtrl: ModalController,
    public navParams: NavParams,
    private mensalistasProvider: MensalistasService,
    private utilsLista: UtilsLista,
    public utils: Utils
  ) {
    this.mensalista = navParams.get('mensalista')
    this.listaServicos = navParams.get('servicos')
    this.atualizarPagamentos()
  }

  ngOnInit() {
  }

  get servicosMensalista() {
    if (this.mensalista != null && this.listaServicos != null)
      return this.listaServicos.filter(servicoAtual => this.mensalista.IdsServicos.find(idAtual => idAtual == servicoAtual.Id) != null)
    else
      return []
  }

  async atualizarPagamentos() {
    this.carregandoMovimentos = true
    this.mensalistasProvider.listaPagamentos(this.mensalista.Id).then(movimentos => {
      this.movimentos = movimentos    
    })
    .finally(() => {
      this.carregandoMovimentos = false
    })
  }

  async cadastrarVeiculo(veiculo = null) {
    let veiculoMensalistaEdicao = new VeiculoCadastro(veiculo)
    const modal = await this.modalCtrl.create({
      component: CadastroVeiculoPage,
      componentProps: {
        'veiculoMensalista': veiculoMensalistaEdicao,
        'inclusao': veiculo == null
      }
    });

    modal.onWillDismiss().then((retorno) => {
      if (retorno.data != null) {
        if (retorno.data.Operacao == 'cadastro') {
          const veiculoLocalizado = this.mensalista.Veiculos.find(veiculoAtual => veiculoAtual.Placa == retorno.data.Veiculo.Placa)
          if (veiculoLocalizado == null)
            this.mensalista.Veiculos.push(retorno.data.Veiculo)
          else
            this.mensalista.Veiculos[this.mensalista.Veiculos.indexOf(veiculoLocalizado)] = retorno.data.Veiculo
        }
        else
          this.excluir(retorno.data.Veiculo)
      }
    })

    return await modal.present(); 
  }

  async cadastrarPagamento(movimento = null) {
    let movimentoEdicao = new Movimento(movimento)    
    movimentoEdicao.IdMensalista = this.mensalista.Id
    movimentoEdicao.Descricao = 'Pagamento de mensalidade'

    // Se for um novo movimento, calcula a data da próxima validade
    if (movimento == null) {
      // Inicia o cálculo com a data do dia anterior, porque o cálculo é feito sempre obtendo o próximo dia baseado no último dia válido de mensalidade
      let maiorData = new Date()
      maiorData.setDate(maiorData.getDate() - 1)

      // Obtem a maior validade atual do mensalista
      if (this.movimentos.length) {
        maiorData = new Date(Math.max.apply(null, this.movimentos.map(movimentoAtual => movimentoAtual.Fim)));
      }
      
      // Obtem o início do periodo um dia depois
      movimentoEdicao.Inicio = new Date(maiorData)
      movimentoEdicao.Inicio.setDate(maiorData.getDate() + 1)

      // Obtem o final do período um mês depois
      movimentoEdicao.Fim = new Date(maiorData)
      movimentoEdicao.Fim.setMonth(maiorData.getMonth() + 1)
    }

    const modal = await this.modalCtrl.create({
      component: CadastroPagamentoPage,
      componentProps: {
        'movimento': movimentoEdicao,
        'inclusao': movimento == null
      }
    });

    modal.onWillDismiss().then((retorno) => {
      if (retorno.data != null) {
        if (retorno.data.Operacao == 'excluir')
          this.excluir(movimento)
        else if (movimento == null)
          this.movimentos.push(retorno.data.Movimento)
        else {
          this.movimentos[this.movimentos.findIndex(movimentoAtual => movimentoAtual.Id == movimento.Id && movimento.Data.getTime() == movimentoAtual.Data.getTime())] = retorno.data.Movimento
        }
      }
    })

    return await modal.present(); 
  }

  async cadastrarServico() {
    const modal = await this.modalCtrl.create({
      component: SelectPopupModalPage,
      componentProps: {
        'lista': this.listaServicos,
        'keyField': 'Nome',
        'titulo': 'Serviços',
        'icone': 'construct'
      }
    })

    modal.onWillDismiss().then((retorno) => {
      let servico = retorno.data
      if (servico != null) {
        this.mensalista.IdsServicos.push(servico.Id)
      }
    })

    return await modal.present(); 
  }

  cancelar() {
    this.modalCtrl.dismiss()
  }

  async concluir(){
    this.avaliouFormulario = true
    if (this.mensalista.Nome != null && this.mensalista.Nome.length > 0 && this.mensalista.Veiculos.length > 0 && this.mensalista.IdsServicos.length > 0)
    {
      await this.mensalistasProvider.exibirProcessamento('Salvando mensalista...')
      this.mensalistasProvider.salvar(this.mensalista, this.movimentos, this.movimentosExclusao).then(() => {
        this.modalCtrl.dismiss(true)
      })
      .catch(erro => {
        alert(erro)
      })
    }
  }

  async excluir(veiculo) {
    const alert = await this.alertController.create({
      header: 'Excluir funcionário',
      message: `Deseja realmente excluir o funcionário ${veiculo.Placa}?`,
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Sim',
          handler: () => {
            this.mensalista.Veiculos.splice(this.mensalista.Veiculos.findIndex(veiculoAtual => veiculoAtual.Placa == veiculo.Placa), 1)
          }
        }
      ]  
    });
  
    await alert.present();
  }

  async excluirMovimento(movimento: Movimento) {
    const alert = await this.alertController.create({
      header: 'Excluir funcionário',
      message: `Deseja realmente excluir o movimento?`,
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Sim',
          handler: () => {
            // Se o Id for zero significa que não inseriu no banco e não precisa marcar para atualizar
            if (movimento.Id) 
              this.movimentosExclusao.push(movimento)
            
            // Exclui da lista
            this.movimentos.splice(this.movimentos.findIndex(movimentoAtual => movimentoAtual.Id == movimento.Id && movimento.Data.getTime() == movimentoAtual.Data.getTime()), 1)
          }
        }
      ]  
    });
  
    await alert.present();
  }
}
