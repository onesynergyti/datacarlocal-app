import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { MensalistasService } from 'src/app/dbproviders/mensalistas.service';
import { VeiculoCadastro } from 'src/app/models/veiculo-cadastro';
import { CadastroVeiculoPage } from './cadastro-veiculo/cadastro-veiculo.page';
import { UtilsLista } from 'src/app/utils/utils-lista';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';
import { Movimento } from 'src/app/models/movimento';
import { CadastroPagamentoPage } from './cadastro-pagamento/cadastro-pagamento.page';

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
  mensalista
  movimentos = []

  constructor(
    private modalCtrl: ModalController,
    public navParams: NavParams,
    private mensalistasProvider: MensalistasService,
    private utilsLista: UtilsLista
  ) {
    this.mensalista = navParams.get('mensalista')
    this.atualizarPagamentos()
  }

  ngOnInit() {
  }

  async atualizarPagamentos() {
    this.mensalistasProvider.listaPagamentos(this.mensalista.Id).then(movimentos => {
      this.movimentos = movimentos
      alert(JSON.stringify(movimentos))
    })
  }

  async cadastrarVeiculo(veiculo = null) {
    let veiculoMensalistaEdicao = new VeiculoCadastro(veiculo)
    const modal = await this.modalCtrl.create({
      component: CadastroVeiculoPage,
      componentProps: {
        'veiculoMensalista': veiculoMensalistaEdicao,
      }
    });

    modal.onWillDismiss().then((retorno) => {
      if (retorno.data != null)
        this.utilsLista.atualizarLista(this.mensalista.Veiculos, retorno.data, true)
    })

    return await modal.present(); 
  }

  async cadastrarPagamento(movimento = null) {
    let movimentoEdicao = new Movimento(movimento)
    movimentoEdicao.IdMensalista = this.mensalista.Id
    movimentoEdicao.Descricao = 'Pagamento de mensalidade'
    const modal = await this.modalCtrl.create({
      component: CadastroPagamentoPage,
      componentProps: {
        'movimento': movimentoEdicao,
      }
    });

    modal.onWillDismiss().then((retorno) => {
      if (retorno.data != null)
        this.utilsLista.atualizarLista(this.movimentos, retorno.data, true)
    })

    return await modal.present(); 
  }

  cancelar() {
    this.modalCtrl.dismiss()
  }

  async concluir(){
    await this.mensalistasProvider.exibirProcessamento('Salvando mensalista...')
    this.mensalistasProvider.salvar(this.mensalista, this.movimentos).then(mensalista => {
      this.modalCtrl.dismiss(mensalista)
    })
    .catch(erro => {
      alert(JSON.stringify(erro))
    })
  }

}
