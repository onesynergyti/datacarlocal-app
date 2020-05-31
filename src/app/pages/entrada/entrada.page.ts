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
  ) { 
    this.veiculo.Entrada = new Date();
  }

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

  get dataFormatada() {
    return this.veiculo.Entrada.getDate() + '/' +
      (this.veiculo.Entrada.getMonth() + 1) + '/' +
      this.veiculo.Entrada.getFullYear() + ' - ' +
      this.veiculo.Entrada.getHours() + ':' +
      this.veiculo.Entrada.getMinutes()
  }

  selecionarTipoVeiculo(tipoVeiculo) {
    this.veiculo.TipoVeiculo = tipoVeiculo
    alert(JSON.stringify(this.veiculo))
  }
}
