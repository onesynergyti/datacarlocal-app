import { Component, OnInit } from '@angular/core';
import { MovimentoService } from 'src/app/dbproviders/movimento.service';

@Component({
  selector: 'app-movimento',
  templateUrl: './movimento.page.html',
  styleUrls: ['./movimento.page.scss'],
})
export class MovimentoPage implements OnInit {

  constructor(
    private movimentos: MovimentoService
  ) { }

  ngOnInit() {
  }

  exibirMovimentos() {
/*    this.movimentos.lista().then(lista => 
      alert(JSON.stringify(lista)))*/
  }

}
