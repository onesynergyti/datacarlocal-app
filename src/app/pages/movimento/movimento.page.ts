import { Component, OnInit, ViewChild } from '@angular/core';
import { MovimentoService } from 'src/app/dbproviders/movimento.service';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';
import { Chart } from 'chart.js';
import { Utils } from 'src/app/utils/utils';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-movimento',
  templateUrl: './movimento.page.html',
  styleUrls: ['./movimento.page.scss'],
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
export class MovimentoPage implements OnInit {

  @ViewChild('graficoTipoReceita') graficoTipoReceita;
  @ViewChild('graficoEvolucaoReceita') graficoEvolucaoReceita;

  bars: any;
  colorArray: any;
  carregandoMovimentos
  movimentos = []
  dataInicio: Date
  dataFim: Date = new Date()
  pagina = 'movimentos'

  constructor(
    private providerMovimentos: MovimentoService,
    private utils: Utils
  ) { 
    const dataAtual = new Date()
    this.dataFim = dataAtual
    // A data de início é o primeiro dia do mês
    this.dataInicio = new Date(dataAtual.getFullYear() + '-' + (dataAtual.getMonth() + 1) + '-01')
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.atualizarMovimentos()
  }

  atualizarMovimentos() {
    this.movimentos = []
    this.carregandoMovimentos = true
    this.providerMovimentos.lista(this.dataInicio, this.dataFim).then((lista: any) => {
      this.movimentos = lista
      this.criarGraficosReceitas()
    })    
    // Em caso de erro
    .catch((erro) => {
      alert(JSON.stringify('Não foi possível carregar os movimentos.' + erro))
    })
    .finally(() => {
      this.carregandoMovimentos = false
    })
  }

  criarGraficosReceitas() {
    this.providerMovimentos.valorXtipoReceita(this.dataInicio, this.dataFim).then((movimentosMes: any) => {
      alert(JSON.stringify(movimentosMes))
      alert(movimentosMes.reduce((acumulador, movimento) => { acumulador + movimento.ValorDinheiro }, 0))
      // Grafico de tipo de receita 
      this.bars = new Chart(this.graficoTipoReceita.nativeElement, {
        type: 'pie',
        data: {
          labels: ['Dinheiro', 'Debito', 'Credito'],
          datasets: [{
            label: 'Total',
            data: [
              movimentosMes.reduce((acumulador, movimento) => acumulador + movimento.ValorDinheiro, 0),
              movimentosMes.reduce((acumulador, movimento) => acumulador + movimento.ValorDebito, 0),
              movimentosMes.reduce((acumulador, movimento) => acumulador + movimento.ValorCredito, 0)
            ],
            backgroundColor: ['red', 'green', 'blue'],
            borderWidth: 1
          }]
        }
      });

      // Grafico de evolução de receita
      let dataReceita = []
      let labelsGrafico = []
      movimentosMes.forEach(itemAtual => {
        const valor = itemAtual.ValorCredito + itemAtual.ValorDebito + itemAtual.ValorDinheiro
        labelsGrafico.push(itemAtual.Periodo)
        dataReceita.push(valor)
      });
      this.bars = new Chart(this.graficoEvolucaoReceita.nativeElement, {
        type: 'line',
        data: {
          labels: labelsGrafico,
          datasets: [
            {
              label: 'Receita',
              fill: false,
              lineTension: 0.1,
              backgroundColor: 'rgba(75,192,192,0.4)',
              borderColor: 'rgba(75,192,192,1)',
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: 'rgba(75,192,192,1)',
              pointBackgroundColor: '#fff',
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: 'rgba(75,192,192,1)',
              pointHoverBorderColor: 'rgba(220,220,220,1)',
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: dataReceita,
              spanGaps: false,
            }
          ]
        }
      });
    })
    .catch((erro) => {
      alert(JSON.stringify(erro))
    })
  }

  exibirCabecalhoData(index) {
    return (index == 0) || (new DatePipe('en-US').transform(this.movimentos[index].Data, 'yyyy-MM-dd').toString() != new DatePipe('en-US').transform(this.movimentos[index -1].Data, 'yyyy-MM-dd').toString())
  }

  selecionarDataInicial(dataAtual) {
    this.utils.selecionarData(dataAtual ? new Date(dataAtual) : new Date())
    .then(data => {
      this.dataInicio = data
      this.atualizarMovimentos()
    });
  }

  selecionarDataFinal(dataAtual) {
    this.utils.selecionarData(dataAtual ? new Date(dataAtual) : new Date())
    .then(data => {
      this.dataFim = data
      this.atualizarMovimentos()
    });
  }
}
