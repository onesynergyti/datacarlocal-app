import { Component, OnInit } from '@angular/core';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';

@Component({
  selector: 'app-mensalistas',
  templateUrl: './mensalistas.page.html',
  styleUrls: ['./mensalistas.page.scss'],
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
export class MensalistasPage implements OnInit {

  mensalistas = []

  constructor() { }

  ngOnInit() {
  }

  cadastrarMensalista(mensalista = null) {

  }
}
