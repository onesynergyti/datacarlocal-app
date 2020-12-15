import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-sql-client',
  templateUrl: './sql-client.component.html',
  styleUrls: ['./sql-client.component.scss'],
})
export class SqlClientComponent implements OnInit {

  constructor(public viewCtrl: ModalController) { }

  private ocultarResultado = true
  sql = ''

  ngOnInit() {}

  fechar() {
    this.viewCtrl.dismiss();
    }
}
