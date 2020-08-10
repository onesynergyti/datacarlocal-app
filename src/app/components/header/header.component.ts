import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global.service';
import { ProdutosService } from 'src/app/dbproviders/produtos.service';
import { AvisosService } from 'src/app/services/avisos.service';
import { AvisosPage } from '../avisos/avisos.page';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input() titulo: string
  @Input() ocultarRetorno: boolean = false
  @Input() ocultarAvisos: boolean = false
  @Input() ocultarMenu: boolean = false
  @Input() iconeBotaoAdicional: string
  @Output() onClickBotaoAdicional: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private navController: NavController,
    public avisosService: AvisosService,
    private modalController: ModalController
  ) { }

  ngOnInit() {}

  async abrirAvisos() {
    const modal = await this.modalController.create({
      component: AvisosPage
    });

    return await modal.present(); 
  }

  clickBotaoAdicional() {
      this.onClickBotaoAdicional.emit()
  }

  retornar() {
    this.navController.back()
  }
}
