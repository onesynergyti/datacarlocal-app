import { Component, OnInit } from '@angular/core';
import { PortalService } from 'src/app/dbproviders/portal.service';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { Configuracoes } from 'src/app/models/configuracoes';
import { ConfiguracoesService } from 'src/app/services/configuracoes.service';
import { Utils } from 'src/app/utils/utils';
import { ComprasService } from 'src/app/services/compras.service';

@Component({
  selector: 'app-portal',
  templateUrl: './portal.page.html',
  styleUrls: ['./portal.page.scss'],
})
export class PortalPage implements OnInit {

  configuracoesLocais
  IdDispositivo
  verificandoIdDispositivo = false
  erro

  constructor(
    private providerPortal: PortalService,
    private clipboard: Clipboard,
    public configuracoesService: ConfiguracoesService,
    public utils: Utils,
    public comprasService: ComprasService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.definirDispositivo()
    this.configuracoesLocais = this.configuracoesService.configuracoesLocais
  }

  ionViewWillLeave() {
    this.configuracoesService.configuracoesLocais = this.configuracoesLocais
  }

  copiar() {
    this.clipboard.copy(this.IdDispositivo)
  }

  definirDispositivo() {
    // Obtem o Id do dispositivo, cria se necessário
    this.erro = null
    this.verificandoIdDispositivo = true
    this.IdDispositivo = 'Obtendo valor'
    this.configuracoesService.obterInformacoesPortal().then(portal => {
      if (portal.IdDispositivo == null) {
        this.configuracoesService.gerarIdDispositivo(portal).then(idDispositivo => {
          this.IdDispositivo = idDispositivo
          this.erro = false
        })
        .catch(() => {
          this.IdDispositivo = 'Erro ao definir dispositivo'
          this.erro = true
        })
        .finally(() => {
          this.verificandoIdDispositivo = false
        })        
      }
      else {
        this.erro = false
        this.IdDispositivo = portal.IdDispositivo
        this.verificandoIdDispositivo = false
      }
    })
    .catch((erro) => {
      this.verificandoIdDispositivo = false
      this.utils.mostrarToast('Não foi possível gerar a chave de segurança. Entre em contato com o suporte.', 'danger')
    })
  }  

  enviar() {
    this.providerPortal.enviarRemessa().then()
  }
}
