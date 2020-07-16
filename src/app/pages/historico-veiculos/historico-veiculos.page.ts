import { Component, OnInit, ViewChild } from '@angular/core';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';
import { HistoricoVeiculosService } from 'src/app/dbproviders/historico-veiculos.service';
import { Chart } from 'chart.js';
import { Utils } from 'src/app/utils/utils';
import { FuncionariosService } from 'src/app/dbproviders/funcionarios.service';

@Component({
  selector: 'app-historico-veiculos',
  templateUrl: './historico-veiculos.page.html',
  styleUrls: ['./historico-veiculos.page.scss'],
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
export class HistoricoVeiculosPage implements OnInit {

  @ViewChild('graficoEvolucaoReceita') graficoEvolucaoReceita;
  @ViewChild('graficoTotalReceita') graficoTotalReceita;

  vendas = []
  dataInicio: Date
  dataFim: Date = new Date()
  pagina = 'vendas'
  carregandoHistorico = false
  idMaximo = 0
  finalizouCarregamento = false
  saldoPeriodo = null
  carregandoGraficos = false
  funcionarios = []

  constructor(
    private providerHistorico: HistoricoVeiculosService,
    private providerFuncionarios: FuncionariosService,
    public utils: Utils
  ) { 
    const dataAtual = new Date()
    this.dataFim = dataAtual
    // A data de início é o primeiro dia do mês
    this.dataInicio = new Date(dataAtual.getFullYear() + '-' + (dataAtual.getMonth() + 1) + '-01')
    this.dataInicio.setMonth(this.dataInicio.getMonth() - 6)
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    // Carrega a lista de funcionários antes de carregar o histórico
    this.providerFuncionarios.lista(true).then((funcionarios: any) => {
      this.funcionarios = funcionarios
      this.atualizarHistorico(true)
      this.criarGraficosReceitas()
      this.atualizarSaldoPeriodo() 
    })
  }

  ionViewDidEnter() {
  }

  atualizarHistorico(recarregar = false, event = null) {
    if (recarregar) {
      this.idMaximo = 0
      this.vendas = []
      this.finalizouCarregamento = false
    }

    this.carregandoHistorico = true
    let inseriuItem = false
    this.providerHistorico.lista(this.dataInicio, this.dataFim, this.idMaximo).then((lista: any) => {
      lista.forEach(itemAtual => {
        if (this.vendas.find(itemExistente => itemExistente.Id === itemAtual.Id) == null) {
          this.vendas.push(itemAtual)
          inseriuItem = true
        }
      })
      if (inseriuItem)
        this.idMaximo = this.vendas[this.vendas.length -1].Id
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
      this.carregandoHistorico = false
    })
  }

  atualizarSaldoPeriodo() {
    this.saldoPeriodo = null
    this.providerHistorico.saldoPeriodo(this.dataInicio, this.dataFim).then(saldo => {      
      this.saldoPeriodo = saldo.Valor
    })
    .catch(erro => {alert(erro)})
  }

  criarGraficosReceitas() {
    this.carregandoGraficos = true
    let promessas = []
    
    promessas.push(new Promise((resolve, reject) => {
      this.providerHistorico.receitaXfuncionario(this.dataInicio, this.dataFim).then((receitas: any) => {
        // Grafico de evolução de receita
        let labels = []
        let funcionarios = []
        let dataset = []
        receitas.forEach(receitaAtual => {
          // Insere os períodos
          if (!labels.find(itemAtual => itemAtual == receitaAtual.Periodo))
            labels.push(receitaAtual.Periodo)
  
          if (!funcionarios.find(itemAtual => itemAtual == receitaAtual.Funcionario.Nome))
            funcionarios.push(receitaAtual.Funcionario.Nome)
        });
  
        funcionarios.forEach(funcionarioAtual => {
          let data = { label: funcionarioAtual, fill: false, borderColor: 'green', data: [] }
          // Percorre o período informando o valor
  
          labels.forEach(periodoAtual => {
            const receitaLocalizada = receitas.find(receitaAtual => receitaAtual.Periodo == periodoAtual && receitaAtual.Funcionario.Nome == funcionarioAtual)
            data.data.push(receitaLocalizada != null ? receitaLocalizada.Valor : 0)
          })
  
          dataset.push(data)
        })
  
        const canvasgraficoEvolucaoReceita = this.graficoEvolucaoReceita.nativeElement.getContext('2d');
        canvasgraficoEvolucaoReceita.clearRect(0, 0, this.graficoEvolucaoReceita.nativeElement.width, this.graficoEvolucaoReceita.nativeElement.height);
        new Chart(this.graficoEvolucaoReceita.nativeElement, {
          type: 'line',
          data: {
            labels: labels,
            datasets: dataset
          }
        });

        resolve()
      })
      .catch((erro) => {
        reject()
      })
    }))

    promessas.push(new Promise((resolve, reject) => {
      // Grafico de total de receita
      this.providerHistorico.receitaXfuncionario(this.dataInicio, this.dataFim, false).then((receitas: any) => { 
        let labels = []
        let dataset = []
        receitas.forEach(receitaAtual => {
          labels.push(receitaAtual.Funcionario.Nome)
          dataset.push(receitaAtual.Valor)
        });

        const canvasgraficoTotalReceita = this.graficoTotalReceita.nativeElement.getContext('2d');
        canvasgraficoTotalReceita.clearRect(0, 0, this.graficoTotalReceita.nativeElement.width, this.graficoTotalReceita.nativeElement.height);
        new Chart(this.graficoTotalReceita.nativeElement, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: 'Receita do período',
              data: dataset,
              backgroundColor: 'rgb(38, 194, 129)', // array should have same number of elements as number of dataset
              borderColor: 'rgb(38, 194, 129)',// array should have same number of elements as number of dataset
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            }
          }        
        });
        resolve()
      })
      .catch(() => {
        reject()
      })
    }))

    // Executa a busca dos gráficos em paralelo
    Promise.all(promessas).finally(() => { this.carregandoGraficos = false })
  }  

  nomeFuncionario(idFuncionario) {
    let funcionario = this.funcionarios.find(itemAtual => itemAtual.Id == idFuncionario)
    return funcionario == null ? 'Não informado' : funcionario.Nome
  }

  selecionarDataInicial(dataAtual) {
    this.utils.selecionarData(dataAtual ? new Date(dataAtual) : new Date())
    .then(data => {
      this.dataInicio = data
      this.atualizarHistorico(true)
      this.criarGraficosReceitas()
      this.atualizarSaldoPeriodo()
    });
  }

  selecionarDataFinal(dataAtual) {
    this.utils.selecionarData(dataAtual ? new Date(dataAtual) : new Date())
    .then(data => {
      this.dataFim = data
      this.atualizarHistorico(true)
      this.criarGraficosReceitas()
      this.atualizarSaldoPeriodo()
    });
  }
}
