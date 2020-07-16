import { Component, OnInit } from '@angular/core';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';
import { MensalistasService } from 'src/app/dbproviders/mensalistas.service';
import { UtilsLista } from 'src/app/utils/utils-lista';
import { ModalController } from '@ionic/angular';
import { Mensalista } from 'src/app/models/mensalista';
import { CadastroMensalistaPage } from './cadastro-mensalista/cadastro-mensalista.page';
import { Utils } from 'src/app/utils/utils';
import { ServicosService } from 'src/app/dbproviders/servicos.service';
import { ConfiguracoesService } from 'src/app/services/configuracoes.service';

@Component({
  selector: 'app-mensalistas',
  templateUrl: './mensalistas.page.html',
  styleUrls: ['./mensalistas.page.scss'],
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
export class MensalistasPage implements OnInit {

  pesquisa = ''
  mensalistas = []
  finalizouCarregamento = false
  carregandoMensalistas = false

  constructor(
    private providerMensalistas: MensalistasService,
    private providerServicos: ServicosService,
    private utils: Utils,
    private modalController: ModalController,
    private configuracoesService: ConfiguracoesService,
    private utilsLista: UtilsLista
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.finalizouCarregamento = false
    this.mensalistas = []
    this.atualizarMensalistas(true)
  }

  atualizarMensalistas(recarregar = false, event = null) {
    this.carregandoMensalistas = true
    if (recarregar) {
      this.finalizouCarregamento = false
      this.mensalistas = []
    }

    let inseriuItem = false
    this.providerMensalistas.lista().then((lista: any) => {
      lista.forEach(itemAtual => {
        if (this.mensalistas.find(itemExistente => itemExistente.Id === itemAtual.Id) == null) {
          this.mensalistas.push(itemAtual)
          inseriuItem = true
        }
      })
      //if (inseriuItem)
      //  this.dataMaxima = new DatePipe('en-US').transform(this.movimentos[this.movimentos.length -1].Data, 'yyyy-MM-dd HH:mm')
      //else if (event != null)
        this.finalizouCarregamento = true
    })    
    // Em caso de erro
    .catch((erro) => {
      alert(JSON.stringify('Não foi possível carregar os mensalistas.' + erro))
    })
    .finally(() => {
      if (event != null)
        event.target.complete();
      this.carregandoMensalistas = false
    })
  }

  async cadastrarMensalista(mensalista = null) {
    await this.providerServicos.exibirProcessamento('Carregando serviços...')
    this.providerServicos.lista().then(servicos => {
      this.procederCadastrarMensalista(mensalista, servicos)
    })
  }

  async procederCadastrarMensalista(mensalista = null, servicos) {
    let mensalistaEdicao = new Mensalista(mensalista)
    const modal = await this.modalController.create({
      component: CadastroMensalistaPage,
      componentProps: {
        'mensalista': mensalistaEdicao,
        'servicos': servicos
      }
    });

    modal.onWillDismiss().then((retorno) => {
      if (retorno.data != null) {
        this.atualizarMensalistas(true)
        this.utils.mostrarToast(mensalista == null ? 'Mensalista cadastrado com sucesso' : 'Mensalista alterado com sucesso', 'success')
      }
    })

    return await modal.present(); 
  }

  get listaFiltrada() {
    if (this.pesquisa == '')
      return this.mensalistas

    return this.mensalistas.filter(itemAtual => this.utils.stringPura(itemAtual.Nome).includes(this.utils.stringPura(this.pesquisa)) || this.utils.stringPura(itemAtual.Documento).includes(this.utils.stringPura(this.pesquisa)) || this.utils.stringPura(itemAtual.Telefone).includes(this.utils.stringPura(this.pesquisa)) || this.utils.stringPura(JSON.stringify(itemAtual.Veiculos)).includes(this.utils.stringPura(this.pesquisa)))
  }
}
