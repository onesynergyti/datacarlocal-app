import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'app-select-popup-modal',
  templateUrl: './select-popup-modal.page.html',
  styleUrls: ['./select-popup-modal.page.scss'],
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
export class SelectPopupModalPage {

  lista: any
  keyField = 'Nome'
  titulo = 'Sem título'
  pesquisa
  icone

  constructor( 
    public modalCtrl: ModalController,
    public navParams: NavParams,
    private utils: Utils
  ) { 
    this.icone = navParams.get('icone')
    this.lista = navParams.get('lista')
    if (navParams.get('keyField') != null)
      this.keyField = navParams.get('keyField')
    if (navParams.get('titulo') != null)
      this.titulo = navParams.get('titulo')
  }

  async concluir(item) {
    this.modalCtrl.dismiss(item);
  }

  cancelar() {
    this.modalCtrl.dismiss()
  }

  get listaFiltrada() {
    if (this.pesquisa != null)
      return this.lista.filter(itemAtual => this.utils.stringPura(itemAtual[this.keyField].toUpperCase()).includes(this.utils.stringPura(this.pesquisa.toUpperCase())))
    else
      return this.lista
  }
}
