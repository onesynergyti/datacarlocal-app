import { Component, OnInit } from '@angular/core';
import { AvisosService } from 'src/app/services/avisos.service';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-avisos',
  templateUrl: './avisos.page.html',
  styleUrls: ['./avisos.page.scss'],
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
export class AvisosPage implements OnInit {

  constructor(
    public avisosService: AvisosService,
    public modalCtrl: ModalController
  ) { 

  }

  ngOnInit() {
  }

  cancelar() {
    this.modalCtrl.dismiss()
  } 
}
