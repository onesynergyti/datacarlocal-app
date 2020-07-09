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

  constructor(
    private alertController: AlertController,
    private modalCtrl: ModalController,
    public navParams: NavParams,
    private mensalistasProvider: MensalistasService,
    private utilsLista: UtilsLista,
    public utils: Utils
  ) {
    this.mensalista = navParams.get('mensalista')
    this.atualizarPagamentos()
  }

  ngOnInit() {
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

  cancelar() {
    this.modalCtrl.dismiss()
  }

  async concluir(){
    await this.mensalistasProvider.exibirProcessamento('Salvando mensalista...')
    this.mensalistasProvider.salvar(this.mensalista, this.movimentos, this.movimentosExclusao).then(mensalista => {
      this.modalCtrl.dismiss(mensalista)
    })
    .catch(erro => {
      alert(erro)
    })
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
