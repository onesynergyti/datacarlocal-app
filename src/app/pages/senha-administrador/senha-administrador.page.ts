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
  recuparandoSenha = false
  codigoRecuperacao
  configuracoesLocais

  constructor(
    public configuracoesService: ConfiguracoesService,
    private modalCtrl: ModalController,
    private utils: Utils,
    private navParams: NavParams,
  ) { 
    this.configuracoesLocais = this.configuracoesService.configuracoesLocais
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
    if (this.configuracoesLocais.Seguranca.CodigoRecuperacao != null) 
      senhaRecuperacao = Md5.hashStr(environment.chaveMD5 + this.configuracoesLocais.Seguranca.EmailAdministrador + this.configuracoesLocais.Seguranca.CodigoRecuperacao).toString().toUpperCase().substr(4, 8)

    if ((this.senhaAtual == '') || (this.configuracoesLocais.Seguranca.SenhaAdministrador != Md5.hashStr(environment.chaveMD5 + this.senhaAtual) && senhaRecuperacao != this.senhaAtual))
      this.utils.mostrarToast('A senha atual é inválida.', 'danger')
    else if (this.senhaNova == null || this.senhaNova.length < 4)
      this.utils.mostrarToast('Informe uma senha com no mínimo 4 dígitos.', 'danger')
    else if (this.senhaNova != this.senhaConfirmacao)
      this.utils.mostrarToast('A confirmação da senha está inválida.', 'danger')
    else {
      // Limpa o código de recuperação sempre que alterar a senha
      this.configuracoesLocais.Seguranca.CodigoRecuperacao = null
      this.configuracoesLocais.Seguranca.SenhaAdministrador = Md5.hashStr(environment.chaveMD5 + this.senhaNova)
      this.configuracoesService.configuracoesLocais = this.configuracoesLocais
      this.modalCtrl.dismiss(true)
    }
  }

  recuperarSenha() {
    // Cria um código de recuperação se não existir
    if (this.configuracoesLocais.Seguranca.CodigoRecuperacao == null) {
      this.configuracoesLocais.Seguranca.CodigoRecuperacao = 100000 + Math.floor(899999 * Math.random());
    }
    this.codigoRecuperacao = this.configuracoesLocais.Seguranca.CodigoRecuperacao

    // Salva o código no localstorage
    this.configuracoesService.configuracoes = this.configuracoesLocais

    this.recuparandoSenha = true
  }

  solicitarRecuperacaoWhatsapp() {
    this.utils.abrirWhatsapp(environment.whatsappSuporte, `Necessito de ajuda para recuperação de senha. O código para recuperação é ${this.configuracoesService.configuracoes.Seguranca.CodigoRecuperacao} e o e-mail de administrador é ${this.configuracoesService.configuracoes.Seguranca.EmailAdministrador}.`)
  }
}
