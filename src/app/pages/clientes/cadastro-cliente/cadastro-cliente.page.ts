import { Component, OnInit } from '@angular/core';
import { Cliente } from 'src/app/models/cliente';
import { AlertController, ModalController, NavParams } from '@ionic/angular';
import { ClientesService } from 'src/app/dbproviders/clientes.service';
import { UtilsLista } from 'src/app/utils/utils-lista';
import { Utils } from 'src/app/utils/utils';
import { PlanoCliente } from 'src/app/models/plano-cliente';
import { CadastroPlanoPage } from './cadastro-plano/cadastro-plano.page';

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

  constructor(
    private alertController: AlertController,
    private modalCtrl: ModalController,
    public navParams: NavParams,
    private clientesProvider: ClientesService,
    private utilsLista: UtilsLista,
    public utils: Utils
  ) {
    this.cliente = navParams.get('cliente')
    this.atualizarPlanos()
  }

  ngOnInit() {
  }

  async atualizarPlanos() {
    this.carregandoPlanos = true
    this.clientesProvider.listaPlanos(this.cliente.Id).then(planos => {
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
    if (this.cliente.Nome != null && this.cliente.Nome.length > 0)
    {
      await this.clientesProvider.exibirProcessamento('Salvando cliente...')
      this.clientesProvider.salvar(this.cliente, this.planos).then(() => {
        this.modalCtrl.dismiss(true)
      })
      .catch(erro => {
        alert(JSON.stringify(erro))
      })
    }
  }
}
