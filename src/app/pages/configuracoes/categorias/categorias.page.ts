import { Component, OnInit } from '@angular/core';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';
import { Utils } from 'src/app/utils/utils';
import { UtilsLista } from 'src/app/utils/utils-lista';
import { ModalController, AlertController } from '@ionic/angular';
import { CategoriasService } from 'src/app/dbproviders/categorias.service';
import { Categoria } from 'src/app/models/categoria';
import { CadastroCategoriaPage } from './cadastro-categoria/cadastro-categoria.page';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.page.html',
  styleUrls: ['./categorias.page.scss'],
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
export class CategoriasPage implements OnInit {

  carregandoCategorias = false
  pesquisa = ''
  categorias = []

  constructor(
    private utils: Utils,
    private utilsLista: UtilsLista,
    private modalController: ModalController,
    private alertController: AlertController,
    private providerCategorias: CategoriasService,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.atualizaCategorias()
  }

  atualizaCategorias() {
    this.categorias = []
    this.carregandoCategorias = true
    this.providerCategorias.lista().then((lista: any) => {
      this.categorias = lista
    })    
    // Em caso de erro
    .catch(() => {
      alert(JSON.stringify('Não foi possível carregar as categorias.'))
    })
    .finally(() => {
      this.carregandoCategorias = false
    })
  }

  async cadastrarCategoria(categoria = null) {
    let categoriaEdicao = new Categoria(categoria)

    const inclusao = categoriaEdicao.Id == 0

    const modal = await this.modalController.create({
      component: CadastroCategoriaPage,
      componentProps: {
        'categoria': categoriaEdicao,
        'inclusao': inclusao
      }
    });

    modal.onWillDismiss().then((retorno) => {
      if (retorno.data != null) {
        if (retorno.data.Operacao == 'excluir')
          this.confirmarExclusao(categoria)
        else {
          this.utilsLista.atualizarLista(this.categorias, retorno.data.Categoria)
          this.utils.mostrarToast(inclusao ? 'Categoria cadastrada com sucesso' : 'Categoria alterada com sucesso', 'success')
        }
      }
    })

    return await modal.present(); 
  }

  async confirmarExclusao(categoria) {
    await this.providerCategorias.exibirProcessamento('Excluindo categoria...')
    this.providerCategorias.excluir(categoria.Id)
    .then(() => {
      this.categorias.splice(this.categorias.indexOf(categoria), 1)
    })
    .catch(() => {
      this.utils.mostrarToast('Não foi possível excluir a categoria.', 'danger')
    })
  }

  async excluir(categoria) {
    const alert = await this.alertController.create({
      header: 'Excluir categoria',
      message: `Deseja realmente excluir a categoria ${categoria.Nome}?`,
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Sim',
          handler: () => {
            this.confirmarExclusao(categoria)
          }
        }
      ]  
    });
  
    await alert.present();
  }

  get listaFiltrada() {
    if (this.pesquisa == '')
      return this.categorias
    else
      return this.categorias.filter(itemAtual => this.utils.stringPura(itemAtual.Nome).includes(this.utils.stringPura(this.pesquisa)))
  }
}
