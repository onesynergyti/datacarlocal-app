import { Component, OnInit } from '@angular/core';
import { Utils } from 'src/app/utils/utils';
import { UtilsLista } from 'src/app/utils/utils-lista';
import { ProdutosService } from 'src/app/dbproviders/produtos.service';
import { ModalController, AlertController } from '@ionic/angular';
import { ConfiguracoesService } from 'src/app/services/configuracoes.service';
import { Produto } from 'src/app/models/produto';
import { CadastroProdutoPage } from './cadastro-produto/cadastro-produto.page';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.page.html',
  styleUrls: ['./produtos.page.scss'],
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
export class ProdutosPage implements OnInit {

  carregandoProdutos = false
  pesquisa = ''
  produtos = []
  configuracoes

  constructor(
    private utils: Utils,
    private utilsLista: UtilsLista,
    private providerProdutos: ProdutosService,
    private modalController: ModalController,
    private configuracoesService: ConfiguracoesService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.atualizarProdutos()
    this.configuracoes = this.configuracoesService.configuracoes
  }

  ionViewWillLeave() {
    this.configuracoesService.configuracoes = this.configuracoes
  }

  atualizarProdutos() {
    this.produtos = []
    this.carregandoProdutos = true
    this.providerProdutos.lista().then((lista: any) => {
      this.produtos = lista
    })    
    // Em caso de erro
    .catch(() => {
      alert(JSON.stringify('Não foi possível carregar os produtos.'))
    })
    .finally(() => {
      this.carregandoProdutos = false
    })
  }

  async cadastrarProduto(produto = null) {
    let produtoEdicao = new Produto(produto)
    
    const inclusao = produtoEdicao.Id == 0

    const modal = await this.modalController.create({
      component: CadastroProdutoPage,
      componentProps: {
        'produto': produtoEdicao,
        'inclusao': inclusao
      }
    });

    modal.onWillDismiss().then((retorno) => {
      if (retorno.data != null) {
        if (retorno.data.Operacao == 'excluir')
          this.excluir(produto)
        else {
          this.utilsLista.atualizarLista(this.produtos, retorno.data.Produto)
          this.utils.mostrarToast(inclusao ? 'Produto cadastrado com sucesso' : 'Produto alterado com sucesso', 'success')
        }
      }
    })

    return await modal.present(); 
  }

  async confirmarExclusao(produto) {
    await this.providerProdutos.exibirProcessamento('Excluindo produto...')
    this.providerProdutos.excluir(produto.Id)
    .then(() => {
      this.produtos.splice(this.produtos.indexOf(produto), 1)
    })
    .catch(() => {
      this.utils.mostrarToast('Não foi possível excluir o produto.', 'danger')
    })
  }

  async excluir(produto) {
    const alert = await this.alertController.create({
      header: 'Excluir produto',
      message: `Deseja realmente excluir o produto ${produto.Nome}?`,
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Sim',
          handler: () => {
            this.confirmarExclusao(produto)
          }
        }
      ]  
    });
  
    await alert.present();
  }

  get listaFiltrada() {
    if (this.pesquisa == '')
      return this.produtos
    else
      return this.produtos.filter(itemAtual => this.utils.stringPura(itemAtual.Nome + itemAtual.Codigo).includes(this.utils.stringPura(this.pesquisa)))
  }
}
