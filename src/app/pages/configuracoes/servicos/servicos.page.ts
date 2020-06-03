import { Component, OnInit } from '@angular/core';
import { Utils } from 'src/app/utils/utils';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';
import { ServicosService } from 'src/app/dbproviders/servicos.service';
import { ModalController } from '@ionic/angular';
import { CadastroServicoPage } from './cadastro-servico/cadastro-servico.page';
import { Servico } from 'src/app/models/servico';

@Component({
  selector: 'app-servicos',
  templateUrl: './servicos.page.html',
  styleUrls: ['./servicos.page.scss'],
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
export class ServicosPage implements OnInit {

  carregandoServicos = false
  pesquisa = ''
  servicos = []

  constructor(
    private utils: Utils,
    private providerServicos: ServicosService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.atualizarServicos()
  }

  atualizarServicos() {
    /*this.servicos = []
    this.carregandoServicos = true
    this.providerServicos.lista().then((lista: any) => {
      this.servicos = lista
    })
    .finally(() => {
      this.carregandoServicos = false
    })*/
  }

  async cadastrarServico(servico = null) {
    let servicoEdicao
    if (servico == null) 
      servicoEdicao = new Servico()

    const modal = await this.modalController.create({
      component: CadastroServicoPage,
      componentProps: {
        'servico': servicoEdicao
      }
    });

    modal.onWillDismiss().then((retorno) => {
    })

    return await modal.present(); 
  }

  async excluir(servico) {

  }

  get listaFiltrada() {
    if (this.pesquisa == '')
      return this.servicos

    return this.servicos.filter(itemAtual => this.utils.stringPura(itemAtual.Nome).includes(this.utils.stringPura(this.pesquisa)))
  }

}
