import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NavController } from '@ionic/angular';


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

  constructor(
    private navController: NavController
  ) { }

  ngOnInit() {}

  clickBotaoAdicional() {
      this.onClickBotaoAdicional.emit()
  }

  retornar() {
    this.navController.back()
  }
}
