import { Component, OnInit } from '@angular/core';
import { Configuracoes } from 'src/app/models/configuracoes';
import { ConfiguracoesService } from 'src/app/services/configuracoes.service';
import { Utils } from 'src/app/utils/utils';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';
import { NavController, ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { SenhaAdministradorPage } from '../senha-administrador/senha-administrador.page';

@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.page.html',
  styleUrls: ['./configuracoes.page.scss'],
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
export class ConfiguracoesPage implements OnInit {

  configuracoes: Configuracoes
  pagina = null

  constructor(
    private configuracoesService: ConfiguracoesService,
    public utils: Utils,
    private navController: NavController,
    private route: ActivatedRoute,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe( parametros => {
      if (parametros['pagina']) {
        this.pagina = parametros['pagina']
      }
    });
  }

  ionViewWillEnter() {
    this.configuracoes = this.configuracoesService.configuracoes
  }

  ionViewWillLeave() {
    this.configuracoesService.configuracoes = this.configuracoes
  }

  abrirPagina(pagina) {
    this.pagina = pagina
  }

  async abrirSenhaAdministrador() {
    const modal = await this.modalController.create({
      component: SenhaAdministradorPage,
      componentProps: {}
    });

    modal.onWillDismiss().then((retorno) => {
      if (retorno != null) {
        this.utils.mostrarToast('Senha alterada com sucesso', 'success')
      }
    })

    return await modal.present(); 
  }

  fecharItem() {
    if (this.pagina == null)
      this.navController.back()
    else
      this.pagina = null
  }
}
