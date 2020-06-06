import { Component } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { PatioService } from 'src/app/dbproviders/patio.service';
import { CalculadoraEstacionamentoService } from 'src/app/services/calculadora-estacionamento.service';
import { Veiculo } from 'src/app/models/veiculo';

@Component({
  selector: 'app-saida',
  templateUrl: './saida.page.html',
  styleUrls: ['./saida.page.scss'],
})
export class SaidaPage {

  veiculo: Veiculo
  saida: Date
  preco: number
  minutos: number

  constructor(
    private modalCtrl: ModalController,
    public navParams: NavParams,
    private patio: PatioService,
    private calculadoraEstacionamentoService: CalculadoraEstacionamentoService
  ) { 
    this.veiculo = navParams.get('veiculo')
    this.saida = new Date();

    this.preco = this.calculadoraEstacionamentoService.calcularPrecos(this.veiculo.Entrada, this.saida, this.veiculo.TipoVeiculo)
    this.minutos = this.calculadoraEstacionamentoService.calcularMinutos(this.veiculo.Entrada, this.saida)

  }

  cancelar() {
    this.modalCtrl.dismiss()
  }

  async concluir() {
    await this.patio.exibirProcessamento('Registrando saida...')
    this.patio.registrarSaida(this.veiculo, 10, 10, 10, this.saida, 1)
    .then(() => {
      this.modalCtrl.dismiss(this.veiculo)
    })
    .catch((erro) => {
      alert(JSON.stringify(erro))
    })
  }  
}
