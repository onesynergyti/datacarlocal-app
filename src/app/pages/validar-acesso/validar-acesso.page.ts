import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ConfiguracoesService } from 'src/app/services/configuracoes.service';
import { Md5 } from 'ts-md5/dist/md5'
import { Utils } from 'src/app/utils/utils';
import { SenhaAdministradorPage } from '../senha-administrador/senha-administrador.page';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-validar-acesso',
  templateUrl: './validar-acesso.page.html',
  styleUrls: ['./validar-acesso.page.scss'],
})
export class ValidarAcessoPage implements OnInit {

  mensagem = ''
  senha = ''
  @ViewChild('inputSenha') inputSenha;

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private configuracoesService: ConfiguracoesService,
    private utils: Utils
  ) { 
    this.mensagem = this.navParams.get('mensagem')
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.inputSenha.setFocus();
    }, 100);
  }

  ngOnInit() {
  }

  async abrirSenhaAdministrador() {
    const modal = await this.modalCtrl.create({
      component: SenhaAdministradorPage,
      componentProps: {
        'recuparandoSenha': true
      }
    });

    modal.onWillDismiss().then((retorno) => {
      if (retorno.data) {
        this.utils.mostrarToast('Senha alterada com sucesso', 'success')
      }
    })

    return await modal.present(); 
  }

  async cancelar() {
    await this.modalCtrl.dismiss(false)
  }

  async concluir() {
    if (this.configuracoesService.configuracoesLocais.Seguranca.SenhaAdministrador == Md5.hashStr(environment.chaveMD5 + this.senha))
      await this.modalCtrl.dismiss(true)
    else
      this.utils.mostrarToast('Senha inválida.', 'danger')
  }
}
