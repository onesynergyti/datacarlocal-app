import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ConfiguracoesService } from 'src/app/services/configuracoes.service';
import { Md5 } from 'ts-md5/dist/md5'
import { Utils } from 'src/app/utils/utils';


@Component({
  selector: 'app-validar-acesso',
  templateUrl: './validar-acesso.page.html',
  styleUrls: ['./validar-acesso.page.scss'],
})
export class ValidarAcessoPage implements OnInit {

  mensagem = ''
  senha = ''

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private configuracoesService: ConfiguracoesService,
    private utils: Utils
  ) { 
    this.mensagem = this.navParams.get('mensagem')
  }

  ngOnInit() {
  }

  async cancelar() {
    await this.modalCtrl.dismiss(false)
  }

  async concluir() {
    if (this.configuracoesService.configuracoes.Seguranca.SenhaAdministrador == Md5.hashStr(this.senha))
      await this.modalCtrl.dismiss(true)
    else
      this.utils.mostrarToast('Senha inválida.', 'danger')
  }
}
