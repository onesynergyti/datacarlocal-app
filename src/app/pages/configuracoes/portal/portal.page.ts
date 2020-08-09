import { Component, OnInit } from '@angular/core';
import { PortalService } from 'src/app/dbproviders/portal.service';
import { Clipboard } from '@ionic-native/clipboard/ngx';

@Component({
  selector: 'app-portal',
  templateUrl: './portal.page.html',
  styleUrls: ['./portal.page.scss'],
})
export class PortalPage implements OnInit {

  IdDispositivo
  verificandoIdDispositivo = false

  constructor(
    private providerPortal: PortalService,
    private clipboard: Clipboard
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    alert('Entrou na página')
    // Obtem o Id do dispositivo, cria se necessário
    this.verificandoIdDispositivo = true
    this.providerPortal.obterInformacoesPortal().then(portal => {
      alert('valor salvo ' + JSON.stringify(portal))
      if (portal.IdDispositivo == null) {
        alert('vai gerar valor')
        this.providerPortal.gerarIdDispositivo().then(idDispositivo => {
          alert('valor gerado ' + idDispositivo)
          this.IdDispositivo = idDispositivo
        })
        .finally(() => {
          this.verificandoIdDispositivo = false
        })
      }
      else 
        this.IdDispositivo = portal.IdDispositivo
    })
    .catch((erro) => {
      this.verificandoIdDispositivo = false
      alert('Ocorreu um erro: ' + erro)
    })
  }

  copiar() {
    this.clipboard.copy(this.IdDispositivo)
  }

  enviar() {
    this.providerPortal.enviarRemessa().then()
  }
}
