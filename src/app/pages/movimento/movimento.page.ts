import { Component, OnInit } from '@angular/core';
import { MovimentoService } from 'src/app/dbproviders/movimento.service';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';

@Component({
  selector: 'app-movimento',
  templateUrl: './movimento.page.html',
  styleUrls: ['./movimento.page.scss'],
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
export class MovimentoPage implements OnInit {

  carregandoMovimentos
  movimentos = []

  constructor(
    private providerMovimentos: MovimentoService
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.atualizarMovimentos()
  }

  atualizarMovimentos() {
    this.movimentos = []
    this.carregandoMovimentos = true
    this.providerMovimentos.lista().then((lista: any) => {
      this.movimentos = lista
    })    
    // Em caso de erro
    .catch((erro) => {
      alert(JSON.stringify('Não foi possível carregar os movimentos.'))
    })
    .finally(() => {
      this.carregandoMovimentos = false
    })
  }

}
