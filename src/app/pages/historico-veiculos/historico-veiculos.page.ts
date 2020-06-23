import { Component, OnInit } from '@angular/core';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';
import { HistoricoVeiculosService } from 'src/app/dbproviders/historico-veiculos.service';

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
}
