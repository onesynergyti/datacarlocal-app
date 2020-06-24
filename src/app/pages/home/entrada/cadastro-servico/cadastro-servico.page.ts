import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ServicosService } from 'src/app/dbproviders/servicos.service';
import { ServicoVeiculo } from 'src/app/models/servico-veiculo';
import { SelectPopupModalPage } from 'src/app/components/select-popup-modal/select-popup-modal.page';
import { ConfiguracoesService } from 'src/app/services/configuracoes.service';
import { Servico } from 'src/app/models/servico';
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'app-cadastro-servico',
  templateUrl: './cadastro-servico.page.html',
  styleUrls: ['./cadastro-servico.page.scss'],
})
export class CadastroServicoPage implements OnInit {

  servicoVeiculo: ServicoVeiculo
  tipoVeiculo
  inclusao

  constructor(
    private modalCtrl: ModalController,
    private servicosProvider: ServicosService,
    public navParams: NavParams,
    public configuracoesService: ConfiguracoesService,
    public utils: Utils
  ) { 
    this.inclusao = navParams.get('inclusao')
    this.tipoVeiculo = navParams.get('tipoVeiculo')
    this.servicoVeiculo = navParams.get('servicoVeiculo')
    // O serviço deve ser selecionado
    if (this.servicoVeiculo == null)
      this.selecionarServico()
  }

  ngOnInit() {
  }

  async abrirModalServico(servicos) {
    const modal = await this.modalCtrl.create({
      component: SelectPopupModalPage,
      componentProps: {
        'lista': servicos,
        'keyField': 'Nome',
        'titulo': 'Serviços',
        'icone': 'construct'
      }
    })

    modal.onWillDismiss().then((retorno) => {
      let servico = retorno.data
      if (servico != null) {
        this.servicoVeiculo = new ServicoVeiculo()
        this.servicoVeiculo.Id = servico.Id
        this.servicoVeiculo.Nome = servico.Nome
        this.servicoVeiculo.PrecoMoto = servico.PrecoMoto
        this.servicoVeiculo.PrecoVeiculoPequeno = servico.PrecoVeiculoPequeno
        this.servicoVeiculo.PrecoVeiculoMedio = servico.PrecoVeiculoMedio
        this.servicoVeiculo.PrecoVeiculoGrande = servico.PrecoVeiculoGrande
      }
      else if (this.servicoVeiculo == null) // A seleção de um serviço é obrigatória
        this.cancelarOperacao()
    })

    return await modal.present(); 
  }
  
  cancelar() {
    this.modalCtrl.dismiss()
  }

  async cancelarOperacao() {
    await this.servicosProvider.exibirProcessamento('Atualizando serviços...')
    setTimeout(() => {
      this.servicosProvider.ocultarProcessamento()
      this.cancelar()
    }, 500);
  }

  concluir() {
    this.modalCtrl.dismiss({ Operacao: 'cadastro', ServicoVeiculo: this.servicoVeiculo})
  }

  excluir() {
    this.modalCtrl.dismiss({ Operacao: 'excluir', ServicoVeiculo: this.servicoVeiculo})
  }

  async selecionarServico() {
    await this.servicosProvider.exibirProcessamento('Listando serviços...')
    this.servicosProvider.lista().then((servicos => {
      // Se utilizar estacionamento adiciona automaticamente o serviço equivalente
      if (this.configuracoesService.configuracoes.Estacionamento.UtilizarEstacionamento)
      {
        const servicoEstacionamento = new Servico()
        servicoEstacionamento.Id = 0
        servicoEstacionamento.Nome = "Estacionamento"
        servicos.unshift(servicoEstacionamento)
      }

      this.abrirModalServico(servicos)
    }))    
  }

}
