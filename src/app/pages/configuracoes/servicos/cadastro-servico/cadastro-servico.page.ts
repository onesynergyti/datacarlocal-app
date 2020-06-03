import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Servico } from 'src/app/models/servico';
import { ServicosService } from 'src/app/dbproviders/servicos.service';

@Component({
  selector: 'app-cadastro-servico',
  templateUrl: './cadastro-servico.page.html',
  styleUrls: ['./cadastro-servico.page.scss'],
})
export class CadastroServicoPage implements OnInit {

  servico: Servico

  constructor(
    private modalController: ModalController,
    private providerServico: ServicosService,
    public navParams: NavParams
  ) { 
    this.servico = navParams.get('servico')
  }

  ngOnInit() {
  }

  cancelar() {
    this.modalController.dismiss()
  }

  async concluir() {
    await this.providerServico.exibirProcessamento('Salvando servico...')
    this.providerServico.salvar(this.servico)
    .then(() => {
      this.modalController.dismiss(this.servico)
    })
    .catch(() => {
      alert('Não foi possível salvar o serviço')
    })
  }

}
