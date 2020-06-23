import { Component, OnInit, ViewChild } from '@angular/core';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';
import { HistoricoVeiculosService } from 'src/app/dbproviders/historico-veiculos.service';
import { Chart } from 'chart.js';

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
        ),
        query(':leave',
          [style({ opacity: 1 }), stagger('40ms', animate('800ms ease-out', style({ opacity: 0 })))],
          { optional: true }
        )
      ])
    ])
  ]
})
export class HistoricoVeiculosPage implements OnInit {

  @ViewChild('graficoEvolucaoReceita') graficoEvolucaoReceita;

  vendas = []
  dataInicio: Date
  dataFim: Date = new Date()
  pagina = 'vendas'
  carregandoHistorico = false
  idMaximo = 0
  finalizouCarregamento = false

  constructor(
    private providerHistorico: HistoricoVeiculosService
  ) { 
    const dataAtual = new Date()
    this.dataFim = dataAtual
    // A data de início é o primeiro dia do mês
    this.dataInicio = new Date(dataAtual.getFullYear() + '-' + (dataAtual.getMonth() + 1) + '-01')
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.atualizarHistorico()
    this.criarGraficosReceitas()
  }

  atualizarHistorico(event = null) {
    this.carregandoHistorico = true
    let inseriuItem = false
    this.providerHistorico.lista(this.dataInicio, this.dataFim, this.idMaximo).then((lista: any) => {
      alert(JSON.stringify(lista))

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

  criarGraficosReceitas() {
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

      new Chart(this.graficoEvolucaoReceita.nativeElement, {
        type: 'line',
        data: {
          labels: labels,
          datasets: dataset
        }
      });
    })
    .catch((erro) => {
      alert(erro)
    })
  }  
}
