import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { MensalistasService } from 'src/app/dbproviders/mensalistas.service';
import { VeiculoMensalista } from 'src/app/models/veiculo-mensalista';
import { CadastroVeiculoPage } from './cadastro-veiculo/cadastro-veiculo.page';
import { UtilsLista } from 'src/app/utils/utils-lista';

@Component({
  selector: 'app-cadastro-mensalista',
  templateUrl: './cadastro-mensalista.page.html',
  styleUrls: ['./cadastro-mensalista.page.scss'],
})
export class CadastroMensalistaPage implements OnInit {

  mensalista

  constructor(
    private modalCtrl: ModalController,
    public navParams: NavParams,
    private mensalistasProvider: MensalistasService,
    private utilsLista: UtilsLista
  ) {
    this.mensalista = navParams.get('mensalista')
  }

  ngOnInit() {
  }

  async cadastrarVeiculo(veiculo = null) {
    let veiculoMensalistaEdicao = new VeiculoMensalista(veiculo)
    alert('chamou aqui')
    const modal = await this.modalCtrl.create({
      component: CadastroVeiculoPage,
      componentProps: {
        'veiculoMensalista': veiculoMensalistaEdicao,
      }
    });

    modal.onWillDismiss().then((retorno) => {
      if (retorno.data != null)
        this.utilsLista.atualizarLista(this.mensalista.Veiculos, retorno.data, true)
    })

    return await modal.present(); 
  }

  cancelar() {
    this.modalCtrl.dismiss()
  }

  async concluir(){
    await this.mensalistasProvider.exibirProcessamento('Salvando mensalista...')
    this.mensalistasProvider.salvar(this.mensalista).then(mensalista => {
      this.modalCtrl.dismiss(mensalista)
    })
    .catch(erro => {
      alert(JSON.stringify(erro))
    })
  }

}
