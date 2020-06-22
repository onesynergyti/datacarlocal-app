import { Component, OnInit, ViewChild } from '@angular/core';
import { MovimentoService } from 'src/app/dbproviders/movimento.service';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';
import { Chart } from 'chart.js';
import { Utils } from 'src/app/utils/utils';
import { DatePipe } from '@angular/common';
import { Movimento } from 'src/app/models/movimento';
import { ModalController } from '@ionic/angular';
import { CadastroMovimentoPage } from './cadastro-movimento/cadastro-movimento.page';
import { UtilsLista } from 'src/app/utils/utils-lista';

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
  @ViewChild('contentMovimentos') contentMovimentos;  

  bars: any;
  colorArray: any;
  carregandoMovimentos
  movimentos = []
  dataInicio: Date
  dataFim: Date = new Date()
  pagina = 'movimentos'
  dataMaxima = null
  finalizouCarregamento = false

  constructor(
    private providerMovimentos: MovimentoService,
    private utils: Utils,
    private modalController: ModalController,
    private utilsLista: UtilsLista
  ) { 
    const dataAtual = new Date()
    this.dataFim = dataAtual
    // A data de início é o primeiro dia do mês
    this.dataInicio = new Date(dataAtual.getFullYear() + '-' + (dataAtual.getMonth() + 1) + '-01')
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.finalizouCarregamento = false
    this.movimentos = []
    this.dataMaxima = null
  }

  ionViewDidEnter() {
    this.atualizarMovimentos()
    this.criarGraficosReceitas()
  }

  atualizarMovimentos(event = null) {
    this.carregandoMovimentos = true
    let inseriuItem = false
    this.providerMovimentos.lista(this.dataInicio, this.dataFim, this.dataMaxima).then((lista: any) => {
      alert(JSON.stringify(lista))

      lista.forEach(itemAtual => {
        if (this.movimentos.find(itemExistente => itemExistente.Id === itemAtual.Id) == null) {
          this.movimentos.push(itemAtual)
          inseriuItem = true
        }
      })
      if (inseriuItem)
        this.dataMaxima = new DatePipe('en-US').transform(this.movimentos[this.movimentos.length -1].Data, 'yyyy-MM-dd HH:mm')
      else if (event != null)
        this.finalizouCarregamento = true
    })    
    // Em caso de erro
    .catch((erro) => {
      alert(JSON.stringify('Não foi possível carregar os movimentos.' + erro))
    })
    .finally(() => {
      if (event != null)
        event.target.complete();
      this.carregandoMovimentos = false
    })
  }

  async cadastrarMovimento(movimento = null, debito = false) {
    let movimentoEdicao = new Movimento(movimento)
    const modal = await this.modalController.create({
      component: CadastroMovimentoPage,
      componentProps: {
        'movimento': movimentoEdicao,
        'debito': (movimentoEdicao.ValorDebito < 0) || (movimentoEdicao.ValorCredito < 0) || (movimentoEdicao.ValorDinheiro < 0) || debito
      }
    });

    modal.onWillDismiss().then((retorno) => {
      if (retorno.data != null)
        this.utilsLista.atualizarLista(this.movimentos, retorno.data, true)
    })

    return await modal.present(); 
  }

  criarGraficosReceitas() {
    this.providerMovimentos.valorXtipoReceita(this.dataInicio, this.dataFim).then((movimentosMes: any) => {
      // Grafico de tipo de receita 
      this.bars = new Chart(this.graficoTipoReceita.nativeElement, {
        type: 'pie',
        data: {
          labels: ['Dinheiro', 'Debito', 'Credito'],
          datasets: [{
            label: 'Total',
            data: [
              movimentosMes.reduce((acumulador, movimento) => acumulador + movimento.ReceitaValorDinheiro, 0),
              movimentosMes.reduce((acumulador, movimento) => acumulador + movimento.ReceitaValorDebito, 0),
              movimentosMes.reduce((acumulador, movimento) => acumulador + movimento.ReceitaValorCredito, 0)
            ],
            backgroundColor: ['red', 'green', 'blue'],
            borderWidth: 1
          }]
        }
      });

      // Grafico de evolução de receita
      let labels = []
      let dataReceita = []
      let dataDespesa = []
      movimentosMes.forEach(itemAtual => {
        labels.push(itemAtual.Periodo)
        dataReceita.push(itemAtual.ReceitaValorCredito + itemAtual.ReceitaValorDebito + itemAtual.ReceitaValorDinheiro)
        dataDespesa.push(Math.abs(itemAtual.DespesaValorCredito + itemAtual.DespesaValorDebito + itemAtual.DespesaValorDinheiro))
      });

      this.bars = new Chart(this.graficoEvolucaoReceita.nativeElement, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Receita',
              fill: false,
              borderColor: 'green',
              data: dataReceita,
            },
            {
              label: 'Despesa',
              fill: false,
              borderColor: 'red',
              data: dataDespesa,
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
      this.dataMaxima = null
      this.movimentos = []
      this.dataInicio = data
      this.finalizouCarregamento = false
      this.contentMovimentos.scrollToTop()
      this.atualizarMovimentos()
      this.criarGraficosReceitas()
    });
  }

  selecionarDataFinal(dataAtual) {
    this.utils.selecionarData(dataAtual ? new Date(dataAtual) : new Date())
    .then(data => {
      this.dataMaxima = null
      this.movimentos = []
      this.dataFim = data
      this.contentMovimentos.scrollToTop()
      this.finalizouCarregamento = false
      this.atualizarMovimentos()
      this.criarGraficosReceitas()
    });
  }
}
