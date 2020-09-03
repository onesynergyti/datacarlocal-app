import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavParams } from '@ionic/angular';
import { UtilsLista } from 'src/app/utils/utils-lista';
import { Utils } from 'src/app/utils/utils';
import { SelectPopupModalPage } from 'src/app/components/select-popup-modal/select-popup-modal.page';
import { PlanoCliente } from 'src/app/models/plano-cliente';
import { CadastroPlacaPage } from './cadastro-placa/cadastro-placa.page';
import { ClientesService } from 'src/app/dbproviders/clientes.service';

@Component({
  selector: 'app-cadastro-plano',
  templateUrl: './cadastro-plano.page.html',
  styleUrls: ['./cadastro-plano.page.scss'],
})
export class CadastroPlanoPage implements OnInit {

  carregamentoHistorico
  historicoUso = []
  pagina = 'plano'
  plano: PlanoCliente
  inclusao
  avaliouFormulario = false

  constructor(
    private alertController: AlertController,
    private modalCtrl: ModalController,
    public navParams: NavParams,
    private utilsLista: UtilsLista,
    public utils: Utils,
    private providerCliente: ClientesService
  ) {
    this.plano = navParams.get('plano')
    this.inclusao = navParams.get('inclusao')
    this.atualizarHistorico()
  }

  ngOnInit() {
  }

  atualizarHistorico() {
    this.carregamentoHistorico = null 
    this.providerCliente.listaUsoPlano(this.plano.Id).then(planos => {
      this.historicoUso = planos
      this.carregamentoHistorico = true
    })
    .catch(() => { 
      this.carregamentoHistorico = false
    })
  }

  cancelar() {
    this.modalCtrl.dismiss()
  }

  async concluir(operacao = 'cadastro'){
    this.avaliouFormulario = true
    if (this.plano.Servico != null && this.plano.Servico.Nome.length && this.plano.ValidadeInicial.getTime() <= this.plano.ValidadeFinal.getTime())
      this.modalCtrl.dismiss({ Operacao: operacao, Plano: this.plano })
  }

  async cadastrarPlaca(placa = '') {
    const modal = await this.modalCtrl.create({
      component: CadastroPlacaPage,
      componentProps: {
        'placa': placa,
        'inclusao': placa == ''
      }
    });

    modal.onWillDismiss().then((retorno) => {
      if (retorno.data != null) {
        const placaRetorno = retorno.data.Placa
        if (retorno.data.Operacao == 'excluir') {
          const index = this.plano.Placas.findIndex(itemAtual => itemAtual == placaRetorno)
          if (index >= 0)
            this.plano.Placas.splice(index, 1)
        }
        else {
          // Se for uma inclusão
          if (placa == '') {
            // Se for uma inclusão verifica se já existe a placa informada
            if (!this.plano.Placas.find(itemAtual => itemAtual == placaRetorno))
              this.plano.Placas.unshift(placaRetorno)
            else {
              this.utils.mostrarToast('A placa informada já existe.', 'danger')
            }
          }
          else if (placa != placaRetorno) {
            // Se for uma inclusão verifica se já existe a placa informada
            if (!this.plano.Placas.find(itemAtual => itemAtual == placaRetorno)) {
              const index = this.plano.Placas.findIndex(itemAtual => itemAtual == placa)
              if (index >= 0) {
                this.plano.Placas[index] = placaRetorno
              }
            }
            else {
              this.utils.mostrarToast('A placa informada já existe.', 'danger')
            }
          }
        }
      }
    })

    return await modal.present(); 
  }

  async excluir() {
    const alert = await this.alertController.create({
      header: 'Excluir plano',
      message: 'Deseja realmente excluir o plano do cliente?',
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Sim',
          handler: () => {
            this.modalCtrl.dismiss({ Operacao: 'excluir', Plano: this.plano })
          }
        }
      ]  
    });
  
    await alert.present();
  }

  async excluirVeiculo(placa) {
    const alert = await this.alertController.create({
      header: 'Excluir plano',
      message: 'Deseja realmente excluir o veículo do plano?',
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Sim',
          handler: () => {
            const index = this.plano.Placas.findIndex(itemAtual => itemAtual == placa)
            if (index >= 0)
              this.plano.Placas.splice(index, 1)
          }
        }
      ]  
    });
  
    await alert.present();
  }

  async selecionarServico() {
    if (!this.inclusao) {
      this.utils.mostrarToast('O serviço não pode ser alterado.', 'danger')
    }
    else {
      const modal = await this.modalCtrl.create({
        component: SelectPopupModalPage,
        componentProps: {
          'classe': 'servico',
          'keyField': 'Nome',
          'titulo': 'Serviços',
          'icone': 'construct'
        }
      })
  
      modal.onWillDismiss().then((retorno) => {
        let servico = retorno.data
        if (servico != null)
          this.plano.Servico = servico
      })
  
      return await modal.present(); 
    }
  }

  selecionarDataInicial(dataAtual) {
    this.utils.selecionarData(dataAtual ? new Date(dataAtual) : new Date())
    .then(data => {
      this.plano.ValidadeInicial = data
    });
  }

  selecionarDataFinal(dataAtual) {
    this.utils.selecionarData(dataAtual ? new Date(dataAtual) : new Date())
    .then(data => {
      this.plano.ValidadeFinal = data
    });
  }

  get quantidadeLimitada() {
    return !this.plano.Quantidade
  }

  set quantidadeLimitada(limitada) {    
    this.plano.Quantidade = limitada ? 1 : 0
  }
}
