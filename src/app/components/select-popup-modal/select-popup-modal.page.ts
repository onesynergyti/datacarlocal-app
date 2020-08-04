import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';
import { Utils } from 'src/app/utils/utils';
import { FuncionariosService } from 'src/app/dbproviders/funcionarios.service';
import { Funcionario } from 'src/app/models/funcionario';
import { CadastroFuncionarioPage } from 'src/app/pages/funcionarios/cadastro-funcionario/cadastro-funcionario.page';
import { UtilsLista } from 'src/app/utils/utils-lista';
import { ServicosService } from 'src/app/dbproviders/servicos.service';
import { CadastroServicoPage } from 'src/app/pages/configuracoes/servicos/cadastro-servico/cadastro-servico.page';
import { Servico } from 'src/app/models/servico';
import { ValidarAcessoPage } from 'src/app/pages/validar-acesso/validar-acesso.page';
import { ConfiguracoesService } from 'src/app/services/configuracoes.service';
import { ProdutosService } from 'src/app/dbproviders/produtos.service';
import { Produto } from 'src/app/models/produto';
import { CadastroProdutoPage } from 'src/app/pages/configuracoes/produtos/cadastro-produto/cadastro-produto.page';

@Component({
  selector: 'app-select-popup-modal',
  templateUrl: './select-popup-modal.page.html',
  styleUrls: ['./select-popup-modal.page.scss'],
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
export class SelectPopupModalPage {

  lista: any
  keyField = 'Nome'
  titulo = 'Sem título'
  pesquisa
  icone
  classe
  carregandoLista = false

  constructor( 
    public modalCtrl: ModalController,
    public navParams: NavParams,
    private utils: Utils,
    private providerFuncionarios: FuncionariosService,
    private providerServicos: ServicosService,
    private providerProdutos: ProdutosService,
    private utilsLista: UtilsLista,
    public configuracoesService: ConfiguracoesService
  ) { 
    this.classe = navParams.get('classe')
    this.icone = navParams.get('icone')
    
    // Se não houver classe, trabalha com a listagem do parâmetro
    if (this.classe == null)
      this.lista = navParams.get('lista')
    else {
      switch (this.classe) {
        case 'funcionario': {
          this.atualizarFuncionarios()
          break
        }
        case 'servico': {
          this.atualizarServicos()
          break
        }
        case 'produto': {
          this.atualizarProdutos()
          break
        }
      }
    }      

    if (navParams.get('keyField') != null)
      this.keyField = navParams.get('keyField')
    if (navParams.get('titulo') != null)
      this.titulo = navParams.get('titulo')
  }

  adicionar() {
    switch (this.classe) {
      case 'funcionario': {
        this.adicionarFuncionario()
        break
      }
      case 'servico': {
        this.adicionarServico()
        break
      }
      case 'produto': {
        this.adicionarProduto()
        break
      }
    }
  }

  async procederAdicionarFuncionario() {
    let funcionarioEdicao = new Funcionario()
    const modal = await this.modalCtrl.create({
      component: CadastroFuncionarioPage,
      componentProps: {
        'funcionario': funcionarioEdicao,
        'inclusao': true
      }
    });

    modal.onWillDismiss().then((retorno) => {
      if (retorno.data != null) {
        if (retorno.data.Operacao == 'cadastro')
          this.utilsLista.atualizarLista(this.lista, retorno.data.Funcionario, true)
      }      
    })

    return await modal.present(); 
  }

  async adicionarFuncionario() {
    if (!this.configuracoesService.configuracoes.Seguranca.ExigirSenhaCadastroFuncionarios) {
      this.procederAdicionarFuncionario()
    }
    else {
      const modal = await this.modalCtrl.create({
        component: ValidarAcessoPage,
        componentProps: {
          'mensagem': 'Informe a senha de administrador para inserir um funcionário.'
        }  
      });

      modal.onWillDismiss().then((retorno) => {
        if (retorno.data == true)
          this.procederAdicionarFuncionario()
      })

      return await modal.present(); 
    }
  }

  async procederAdicionarServico() {
    let servicoEdicao = new Servico()

    const modal = await this.modalCtrl.create({
      component: CadastroServicoPage,
      componentProps: {
        'servico': servicoEdicao,
        'inclusao': true
      }
    });

    modal.onWillDismiss().then((retorno) => {
      if (retorno.data != null) {
        this.utilsLista.atualizarLista(this.lista, retorno.data.Servico)
      }
    })

    return await modal.present(); 
  }

  async adicionarServico() {
    if (!this.configuracoesService.configuracoes.Seguranca.ExigirSenhaCadastroServicos) {
      this.procederAdicionarServico()
    }
    else {
      const modal = await this.modalCtrl.create({
        component: ValidarAcessoPage,
        componentProps: {
          'mensagem': 'Informe a senha de administrador para inserir um serviço.'
        }  
      });

      modal.onWillDismiss().then((retorno) => {
        if (retorno.data == true)
          this.procederAdicionarServico()
      })

      return await modal.present(); 
    }
  }


  async procederAdicionarProduto() {
    let produtoEdicao = new Produto()

    const modal = await this.modalCtrl.create({
      component: CadastroProdutoPage,
      componentProps: {
        'produto': produtoEdicao,
        'inclusao': true
      }
    });

    modal.onWillDismiss().then((retorno) => {
      if (retorno.data != null) {
        this.utilsLista.atualizarLista(this.lista, retorno.data.Servico)
      }
    })

    return await modal.present(); 
  }

  async adicionarProduto() {
    if (!this.configuracoesService.configuracoes.Seguranca.ExigirSenhaCadastroProdutos) {
      this.procederAdicionarProduto()
    }
    else {
      const modal = await this.modalCtrl.create({
        component: ValidarAcessoPage,
        componentProps: {
          'mensagem': 'Informe a senha de administrador para inserir um produto.'
        }  
      });

      modal.onWillDismiss().then((retorno) => {
        if (retorno.data == true)
          this.procederAdicionarProduto()
      })

      return await modal.present(); 
    }
  }


  atualizarFuncionarios() {
    this.carregandoLista = true
    this.providerFuncionarios.lista().then(funcionarios => {
      this.lista = funcionarios
    })
    .finally(() => {
      this.carregandoLista = false
    })
  }

  atualizarServicos() {
    this.carregandoLista = true
    this.providerServicos.lista().then(servicos => {
      this.lista = servicos
    })
    .finally(() => {
      this.carregandoLista = false
    })
  }

  atualizarProdutos() {
    this.carregandoLista = true
    this.providerProdutos.lista().then(produtos => {
      this.lista = produtos
    })
    .finally(() => {
      this.carregandoLista = false
    })
  }

  async concluir(item) {
    this.modalCtrl.dismiss(item);
  }

  cancelar() {
    this.modalCtrl.dismiss()
  }

  get listaFiltrada() {
    if (this.pesquisa != null)
      return this.lista.filter(itemAtual => this.utils.stringPura(itemAtual[this.keyField].toUpperCase()).includes(this.utils.stringPura(this.pesquisa.toUpperCase())))
    else
      return this.lista
  }
}
