import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-validar-acesso',
  templateUrl: './validar-acesso.page.html',
  styleUrls: ['./validar-acesso.page.scss'],
})
export class ValidarAcessoPage implements OnInit {

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }

  cancelar() {
    this.modalCtrl.dismiss(false)
  }

  concluir() {
    this.modalCtrl.dismiss(true)
  }
}
