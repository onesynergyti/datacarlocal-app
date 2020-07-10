import { Component, OnInit, ViewChild } from '@angular/core';
import { MovimentoService } from 'src/app/dbproviders/movimento.service';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';
import { Chart } from 'chart.js';
import { Utils } from 'src/app/utils/utils';
import { DatePipe } from '@angular/common';
import { Movimento } from 'src/app/models/movimento';
import { ModalController, AlertController } from '@ionic/angular';
import { CadastroMovimentoPage } from './cadastro-movimento/cadastro-movimento.page';
import { UtilsLista } from 'src/app/utils/utils-lista';
import { SaidaPage } from '../home/saida/saida.page';

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
  dataMaxima = null
  finalizouCarregamento = false
  saldoPeriodo = null

  constructor(
    private providerMovimentos: MovimentoService,
    private utils: Utils,
    private modalController: ModalController,
    private alertController: AlertController
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
    this.atualizarSaldoPeriodo()
  }

  async abrirMovimento(movimento = null, debito = false) {
    // Movimento de veículo exibe a tela de finalização dos serviços
    if (movimento != null && movimento.Veiculos[0] != null) {
      const modal = await this.modalController.create({
        component: SaidaPage,
        componentProps: {
          'movimento': movimento,
          'somenteLeitura': true
        }
      });
  
      modal.onWillDismiss().then((retorno) => {
        
      })
  
      return await modal.present(); 
    }
    else {
      let movimentoEdicao = new Movimento(movimento)
      const edicaoDebito = (movimentoEdicao.ValorDebito < 0) || (movimentoEdicao.ValorCredito < 0) || (movimentoEdicao.ValorDinheiro < 0) || debito 
      // Define so valores como positivos
      movimentoEdicao.ValorCredito = Math.abs(movimentoEdicao.ValorCredito)
      movimentoEdicao.ValorDebito = Math.abs(movimentoEdicao.ValorDebito)
      movimentoEdicao.ValorDinheiro = Math.abs(movimentoEdicao.ValorDinheiro)
      
      const modal = await this.modalController.create({
        component: CadastroMovimentoPage,
        componentProps: {
          'movimento': movimentoEdicao,
          'debito': edicaoDebito,
          'inclusao': movimento == null
        }
      });
  
      modal.onWillDismiss().then((retorno) => {
        if (retorno.data != null) {
          if (retorno.data.Operacao == 'excluir') {
            this.excluir(retorno.data.Movimento)
          }
          else {
            this.utils.mostrarToast(movimento == null ? 'Movimento inserido com sucesso.' : 'Movimento alterado com sucesso.', 'success')
            this.atualizarMovimentos(true)
            this.criarGraficosReceitas()
            this.atualizarSaldoPeriodo()
          }
        }
      })
  
      return await modal.present(); 
    }
  }

  atualizarMovimentos(recarregar = false, event = null) {
    if (recarregar) {
      this.saldoPeriodo = null
      this.dataMaxima = null
      this.movimentos = []
      this.finalizouCarregamento = false
    }

    this.carregandoMovimentos = event == null
    
    // Faz o carregamento parcial dos itens
    let inseriuItem = false    
    this.providerMovimentos.lista(this.dataInicio, this.dataFim, this.dataMaxima).then((lista: any) => {
      lista.forEach(itemAtual => {
        if (this.movimentos.find(itemExistente => itemExistente.Id === itemAtual.Id) == null) {
          this.movimentos.push(itemAtual)
          inseriuItem = true
        }
      })
      if (inseriuItem)
        this.dataMaxima = new DatePipe('en-US').transform(this.movimentos[this.movimentos.length -1].Data, 'yyyy-MM-dd HH:mm')
      else if (event != null)
      // Se não houve nenhum item novo inserido significa que finalizou o carregamento
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

  atualizarSaldoPeriodo() {
    this.providerMovimentos.saldoPeriodo(this.dataInicio, this.dataFim).then(saldos => {
      this.saldoPeriodo = saldos.ValorCredito + saldos.ValorDebito + saldos.ValorDinheiro
    })
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

  async confirmarExclusao(movimento) {
    await this.providerMovimentos.exibirProcessamento('Excluindo veículo...')
    this.providerMovimentos.excluir(movimento.Id)
    .then(() => {
      this.atualizarMovimentos(true)
      this.criarGraficosReceitas()
      this.atualizarSaldoPeriodo()
    })
    .catch(() => {
      this.utils.mostrarToast('Não foi possível excluir o serviço.', 'danger')
    })
  }

  async excluir(movimento) {
    const alert = await this.alertController.create({
      header: 'Excluir movimento',
      message: `Deseja realmente excluir o movimento?`,
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Sim',
          handler: () => {
            this.confirmarExclusao(movimento)
          }
        }
      ]  
    });
  
    await alert.present();
  }

  exibirCabecalhoData(index) {
    return (index == 0) || (new DatePipe('en-US').transform(this.movimentos[index].Data, 'yyyy-MM-dd').toString() != new DatePipe('en-US').transform(this.movimentos[index -1].Data, 'yyyy-MM-dd').toString())
  }

  selecionarDataInicial(dataAtual) {
    this.utils.selecionarData(dataAtual ? new Date(dataAtual) : new Date())
    .then(data => {
      this.dataInicio = data
      this.atualizarMovimentos(true)
      this.criarGraficosReceitas()
      this.atualizarSaldoPeriodo()
    });
  }

  selecionarDataFinal(dataAtual) {
    this.utils.selecionarData(dataAtual ? new Date(dataAtual) : new Date())
    .then(data => {
      this.dataFim = data
      this.atualizarMovimentos(true)
      this.criarGraficosReceitas()
      this.atualizarSaldoPeriodo()
    });
  }
}
