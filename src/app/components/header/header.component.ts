import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NavController } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global.service';
import { ProdutosService } from 'src/app/dbproviders/produtos.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input() titulo: string
  @Input() ocultarRetorno: boolean = false
  @Input() ocultarMenu: boolean = false
  @Input() iconeBotaoAdicional: string
  @Output() onClickBotaoAdicional: EventEmitter<any> = new EventEmitter<any>();
  produtosAlerta = 0

  constructor(
    private navController: NavController,
    private globalService: GlobalService,
    private providerProdutos: ProdutosService
  ) { 
    this.globalService.onRealizarVenda.subscribe(() => {
      this.providerProdutos.produtosAlerta().then(quantidade => { 
        this.produtosAlerta = quantidade
      })
    })
    this.globalService.onAlterarProduto.subscribe(() => {
      this.providerProdutos.produtosAlerta().then(quantidade => { 
        this.produtosAlerta = quantidade
      })
    })
  }

  ngOnInit() {}

  clickBotaoAdicional() {
      this.onClickBotaoAdicional.emit()
  }

  retornar() {
    this.navController.back()
  }
}
