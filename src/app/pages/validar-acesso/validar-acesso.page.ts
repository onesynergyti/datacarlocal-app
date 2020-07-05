import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-validar-acesso',
  templateUrl: './validar-acesso.page.html',
  styleUrls: ['./validar-acesso.page.scss'],
})
export class ValidarAcessoPage implements OnInit {

  mensagem = ''

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams
  ) { 
    this.mensagem = navParams.get('mensagem')
  }

  ngOnInit() {
  }

  async cancelar() {
    await this.modalCtrl.dismiss(false)
  }

  async concluir() {
    await this.modalCtrl.dismiss(true)
  }
}
