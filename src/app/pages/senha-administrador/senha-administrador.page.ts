import { Component, OnInit } from '@angular/core';
import { ConfiguracoesService } from 'src/app/services/configuracoes.service';
import { ModalController } from '@ionic/angular';
import { Configuracoes } from 'src/app/models/configuracoes';
import {Md5} from 'ts-md5/dist/md5'
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'app-senha-administrador',
  templateUrl: './senha-administrador.page.html',
  styleUrls: ['./senha-administrador.page.scss'],
})
export class SenhaAdministradorPage implements OnInit {

  senhaAtual
  senhaNova
  senhaConfirmacao
  configuracoes: Configuracoes

  constructor(
    private configuracoesService: ConfiguracoesService,
    private modalCtrl: ModalController,
    private utils: Utils
  ) { 
    this.configuracoes = this.configuracoesService.configuracoes
  }

  ngOnInit() {
  }
  
  cancelar() {
    this.modalCtrl.dismiss()
  }

  concluir() {
    if ((this.configuracoes.Seguranca.SenhaAdministrador != null) && (this.senhaAtual == null || this.configuracoes.Seguranca.SenhaAdministrador != Md5.hashStr(this.senhaAtual)))
      this.utils.mostrarToast('A senha atual é inválida.', 'danger')
    else if (this.senhaNova != this.senhaConfirmacao)
      this.utils.mostrarToast('A confirmação da senha está inválida.', 'danger')
    else {
      this.configuracoes.Seguranca.SenhaAdministrador = Md5.hashStr(this.senhaNova)
      this.configuracoesService.configuracoes = this.configuracoes
      this.modalCtrl.dismiss({ retorno: 'Sucesso' })
    }
  }
}
