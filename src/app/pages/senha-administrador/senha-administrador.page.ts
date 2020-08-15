import { Component, OnInit } from '@angular/core';
import { ConfiguracoesService } from 'src/app/services/configuracoes.service';
import { ModalController, NavParams } from '@ionic/angular';
import { Configuracoes } from 'src/app/models/configuracoes';
import { Md5 } from 'ts-md5/dist/md5'
import { Utils } from 'src/app/utils/utils';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-senha-administrador',
  templateUrl: './senha-administrador.page.html',
  styleUrls: ['./senha-administrador.page.scss'],
})
export class SenhaAdministradorPage implements OnInit {

  senhaAtual = ''
  senhaNova
  senhaConfirmacao
  configuracoes: Configuracoes
  recuparandoSenha = false
  codigoRecuperacao

  constructor(
    public configuracoesService: ConfiguracoesService,
    private modalCtrl: ModalController,
    private utils: Utils,
    private navParams: NavParams,
  ) { 
    this.configuracoes = this.configuracoesService.configuracoes

    if (this.navParams.get('recuparandoSenha') == true)
      this.recuperarSenha()
  }

  ngOnInit() {
  }
  
  cancelar() {
    this.modalCtrl.dismiss()
  }

  concluir() {
    let senhaRecuperacao = ''
    if (this.configuracoes.Seguranca.CodigoRecuperacao != null) 
      senhaRecuperacao = Md5.hashStr(environment.chaveMD5 + this.configuracoes.Seguranca.EmailAdministrador + this.configuracoes.Seguranca.CodigoRecuperacao).toString().toUpperCase().substr(4, 8)

    if ((this.senhaAtual == '') || (this.configuracoes.Seguranca.SenhaAdministrador != Md5.hashStr(environment.chaveMD5 + this.senhaAtual) && senhaRecuperacao != this.senhaAtual))
      this.utils.mostrarToast('A senha atual é inválida.', 'danger')
    else if (this.senhaNova == null || this.senhaNova.length < 4)
      this.utils.mostrarToast('Informe uma senha com no mínimo 4 dígitos.', 'danger')
    else if (this.senhaNova != this.senhaConfirmacao)
      this.utils.mostrarToast('A confirmação da senha está inválida.', 'danger')
    else {
      // Limpa o código de recuperação sempre que alterar a senha
      this.configuracoes.Seguranca.CodigoRecuperacao = null
      this.configuracoesService.configuracoes = this.configuracoes
      
      this.configuracoes.Seguranca.SenhaAdministrador = Md5.hashStr(environment.chaveMD5 + this.senhaNova)
      this.configuracoesService.configuracoes = this.configuracoes
      this.modalCtrl.dismiss(true)
    }
  }

  recuperarSenha() {
    // Cria um código de recuperação se não existir
    if (this.configuracoes.Seguranca.CodigoRecuperacao == null) {
      this.configuracoes.Seguranca.CodigoRecuperacao = 100000 + Math.floor(899999 * Math.random());
    }
    this.codigoRecuperacao = this.configuracoes.Seguranca.CodigoRecuperacao

    // Salva o código no localstorage
    this.configuracoesService.configuracoes = this.configuracoes

    this.recuparandoSenha = true
  }

  solicitarRecuperacaoWhatsapp() {
    this.utils.abrirWhatsapp(environment.whatsappSuporte, `Necessito de ajuda para recuperação de senha. O código para recuperação é ${this.configuracoes.Seguranca.CodigoRecuperacao} e o e-mail de administrador é ${this.configuracoes.Seguranca.EmailAdministrador}.`)
  }
}
