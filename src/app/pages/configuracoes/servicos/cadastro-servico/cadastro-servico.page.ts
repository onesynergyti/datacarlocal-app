import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Servico } from 'src/app/models/servico';
import { ServicosService } from 'src/app/dbproviders/servicos.service';
import { Utils } from 'src/app/utils/utils';
import { ConfiguracoesService } from 'src/app/services/configuracoes.service';
import { Configuracoes } from 'src/app/models/configuracoes';

@Component({
  selector: 'app-cadastro-servico',
  templateUrl: './cadastro-servico.page.html',
  styleUrls: ['./cadastro-servico.page.scss'],
})
export class CadastroServicoPage implements OnInit {

  servico: Servico
  inclusao: boolean
  avaliouFormulario = false
  configuracoes: Configuracoes

  constructor(
    private modalController: ModalController,
    private providerServico: ServicosService,
    public navParams: NavParams,
    public utils: Utils,
    public configuracoesService: ConfiguracoesService
  ) { 
    this.servico = navParams.get('servico')
    this.inclusao = navParams.get('inclusao')
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.configuracoes = this.configuracoesService.configuracoes
  }

  cancelar() {
    this.modalController.dismiss()
  }

  async concluir(operacao = 'cadastro') {
    if (operacao != 'cadastro') {
      this.modalController.dismiss({ Operacao: operacao, Servico: this.servico })
    }
    else {
      this.avaliouFormulario = true

      if (this.servico.Nome != null && this.servico.Nome.length) {
        await this.providerServico.exibirProcessamento('Salvando servico...')
        this.providerServico.salvar(this.servico)
        .then(() => {
          this.modalController.dismiss({ Operacao: operacao, Servico: this.servico })
        })
        .catch(() => {
          alert('Não foi possível salvar o serviço')
        })
      }      
    }
  }
}
