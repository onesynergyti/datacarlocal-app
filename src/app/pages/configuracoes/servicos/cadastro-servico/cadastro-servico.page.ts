import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Servico } from 'src/app/models/servico';
import { ServicosService } from 'src/app/dbproviders/servicos.service';
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'app-cadastro-servico',
  templateUrl: './cadastro-servico.page.html',
  styleUrls: ['./cadastro-servico.page.scss'],
})
export class CadastroServicoPage implements OnInit {

  servico: Servico
  inclusao: boolean

  constructor(
    private modalController: ModalController,
    private providerServico: ServicosService,
    public navParams: NavParams,
    public utils: Utils
  ) { 
    this.servico = navParams.get('servico')
    this.inclusao = navParams.get('inclusao')
  }

  ngOnInit() {
  }

  cancelar() {
    this.modalController.dismiss()
  }

  async concluir(operacao = 'cadastrar') {
    if (operacao != 'cadastrar') {
      this.modalController.dismiss({ Operacao: operacao, Servico: this.servico })
    }
    else {
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
