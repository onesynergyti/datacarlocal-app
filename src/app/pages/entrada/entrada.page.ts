import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Veiculo } from 'src/app/models/veiculo';
import { PatioService } from 'src/app/dbproviders/patio.service';

@Component({
  selector: 'app-entrada',
  templateUrl: './entrada.page.html',
  styleUrls: ['./entrada.page.scss'],
})
export class EntradaPage implements OnInit {

  pesquisa
  veiculo: Veiculo = new Veiculo()

  constructor(
    private modalCtrl: ModalController,
    private patio: PatioService
  ) { }

  ngOnInit() {
  }

  cancelar() {
    this.modalCtrl.dismiss()
  }

  async concluir() {
    await this.patio.exibirProcessamento('Registrando entrada...')
    this.patio.adicionar(this.veiculo)
    .then(veiculo => {
      this.modalCtrl.dismiss(this.veiculo)
    })
    .catch(() => {
      alert('Não foi possível inserir o veículo')
    })
  }

  selecionarTipoVeiculo(tipoVeiculo) {
    this.veiculo.TipoVeiculo = tipoVeiculo
    alert(JSON.stringify(this.veiculo))
  }
}
