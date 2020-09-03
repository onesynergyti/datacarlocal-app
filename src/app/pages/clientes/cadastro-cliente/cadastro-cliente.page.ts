import { Component, OnInit } from '@angular/core';
import { Cliente } from 'src/app/models/cliente';
import { AlertController, ModalController, NavParams } from '@ionic/angular';
import { ClientesService } from 'src/app/dbproviders/clientes.service';
import { UtilsLista } from 'src/app/utils/utils-lista';
import { Utils } from 'src/app/utils/utils';
import { PlanoCliente } from 'src/app/models/plano-cliente';
import { CadastroPlanoPage } from './cadastro-plano/cadastro-plano.page';
import { SelectPopupModalPage } from 'src/app/components/select-popup-modal/select-popup-modal.page';
import { Categoria } from 'src/app/models/categoria';

@Component({
  selector: 'app-cadastro-cliente',
  templateUrl: './cadastro-cliente.page.html',
  styleUrls: ['./cadastro-cliente.page.scss'],
})
export class CadastroClientePage implements OnInit {
  pagina = 'cliente'
  cliente: Cliente
  planos: PlanoCliente[] = []
  carregandoPlanos = false
  movimentosExclusao = []
  avaliouFormulario = false
  listaPlanos = []
  inclusao

  constructor(
    private alertController: AlertController,
    private modalCtrl: ModalController,
    public navParams: NavParams,
    private clientesProvider: ClientesService,
    private utilsLista: UtilsLista,
    public utils: Utils
  ) {
    this.cliente = navParams.get('cliente')
    this.inclusao = navParams.get('inclusao')
    this.atualizarPlanos()
  }

  ngOnInit() {
  }

  async atualizarPlanos() {
    this.carregandoPlanos = true
    this.clientesProvider.listaPlanos(this.cliente.Documento).then(planos => {
      this.planos = planos
      alert(JSON.stringify(this.planos))
    })
    .finally(() => {
      this.carregandoPlanos = false
    })
  }

  async cadastrarPlano(plano = null) {
    let planoEdicao = new PlanoCliente(plano)
    if (plano == null) {
      planoEdicao.ValidadeInicial = new Date()
      planoEdicao.ValidadeFinal = new Date()
    }
    const modal = await this.modalCtrl.create({
      component: CadastroPlanoPage,
      componentProps: {
        'plano': planoEdicao,
        'inclusao': plano == null
      }
    });

    modal.onWillDismiss().then((retorno) => {
      if (retorno.data != null) {
        const planoRetorno = retorno.data.Plano
        if (retorno.data.Operacao == 'excluir') {
          this.utilsLista.excluirDaLista(this.planos, planoRetorno)
        }
        else {          
          if (!planoRetorno.Id) {
            // Se for uma inclusão verifica se já existe um plano com o serviço informado
            if (plano == null) {              
              if (!this.planos.find(itemAtual => !itemAtual.Id && itemAtual.Servico.Id == planoRetorno.Servico.Id))
                this.planos.unshift(planoRetorno)
              else {
                this.utils.mostrarToast('Já existe um plano com esse serviço.', 'danger')
              }
            }
            else {
              const index = this.planos.findIndex(itemAtual => !itemAtual.Id && itemAtual.Servico.Id == planoRetorno.Servico.Id)
              if (index)
                this.planos[index] = planoRetorno
              else
                this.utils.mostrarToast('Não foi possível alterar o plano.', 'danger')
            }
          }
          else {
            this.utilsLista.atualizarLista(this.planos, planoRetorno)
          }
        }
      }
    })

    return await modal.present(); 
  }

  cancelar() {
    this.modalCtrl.dismiss()
  }

  async concluir(){
    this.avaliouFormulario = true
    if (this.cliente.Nome != null && this.cliente.Nome.length > 0 && this.cliente.Documento != null && this.cliente.Documento.length > 0)    
    {
      await this.clientesProvider.exibirProcessamento('Salvando cliente...')
      this.clientesProvider.salvar(this.cliente, this.planos).then(() => {
        this.modalCtrl.dismiss(true)
      })
      .catch(erro => {
        alert(erro + JSON.stringify(erro))
        this.utils.mostrarToast('Não foi possível inserir o cliente. Verifique se o documento já existe.', 'danger')
      })
    }
  }

  async alterarCategoria() {
    const modal = await this.modalCtrl.create({
      component: SelectPopupModalPage,
      componentProps: {
        'classe': 'categoria',
        'titulo': 'Categorias',
        'icone': 'grid'
      }
    })

    modal.onWillDismiss().then((retorno) => {
      let categoria = retorno.data
      if (categoria != null) 
        this.cliente.Categoria = new Categoria(categoria)
    })

    return await modal.present(); 
  }

  selecionarDataNascimento() {
    const dataNascimento = this.cliente.Nascimento != null ? new Date(this.cliente.Nascimento) : new Date()
    this.utils.selecionarData(dataNascimento)
    .then(data => {
      this.cliente.Nascimento = data
    });
  }
}
