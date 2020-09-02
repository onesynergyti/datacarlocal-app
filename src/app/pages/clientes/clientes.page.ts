import { Component, OnInit } from '@angular/core';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';
import { ClientesService } from 'src/app/dbproviders/clientes.service';
import { Utils } from 'src/app/utils/utils';
import { ModalController } from '@ionic/angular';
import { ConfiguracoesService } from 'src/app/services/configuracoes.service';
import { UtilsLista } from 'src/app/utils/utils-lista';
import { Cliente } from 'src/app/models/cliente';
import { CadastroClientePage } from './cadastro-cliente/cadastro-cliente.page';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
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
export class ClientesPage implements OnInit {

  pesquisa = ''
  clientes = []
  finalizouCarregamento = false
  carregandoClientes = false

  constructor(
    private providerClientes: ClientesService,
    private utils: Utils,
    private modalController: ModalController,
    private configuracoesService: ConfiguracoesService,
    private utilsLista: UtilsLista
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.finalizouCarregamento = false
    this.clientes = []
    this.atualizarClientes(true)
  }

  atualizarClientes(recarregar = false, event = null) {
    this.carregandoClientes = true
    if (recarregar) {
      this.finalizouCarregamento = false
      this.clientes = []
    }

    let inseriuItem = false
    this.providerClientes.lista().then((lista: any) => {
      lista.forEach(itemAtual => {
        if (this.clientes.find(itemExistente => itemExistente.Documento === itemAtual.Documento) == null) {
          this.clientes.push(itemAtual)
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
      alert('Não foi possível carregar os clientes.' + JSON.stringify(erro))
    })
    .finally(() => {
      if (event != null)
        event.target.complete();
      this.carregandoClientes = false
    })
  }

  async cadastrarCliente(cliente = null) {
    let clienteEdicao = new Cliente(cliente)
    const modal = await this.modalController.create({
      component: CadastroClientePage,
      componentProps: {
        'cliente': clienteEdicao,
        'inclusao': cliente == null
      }
    });

    modal.onWillDismiss().then((retorno) => {
      if (retorno.data != null) {
        this.atualizarClientes(true)
        this.utils.mostrarToast(cliente == null ? 'Cliente cadastrado com sucesso' : 'Cliente alterado com sucesso', 'success')
      }
    })

    return await modal.present(); 
  }

  get listaFiltrada() {
    if (this.pesquisa == '')
      return this.clientes

    return this.clientes.filter(itemAtual => this.utils.stringPura(itemAtual.Nome + itemAtual.Documento).includes(this.utils.stringPura(this.pesquisa)))
  }
}
