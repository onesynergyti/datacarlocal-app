import { Component, OnInit } from '@angular/core';
import { Categoria } from 'src/app/models/categoria';
import { ModalController, NavParams, AlertController } from '@ionic/angular';
import { CategoriasService } from 'src/app/dbproviders/categorias.service';
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'app-cadastro-categoria',
  templateUrl: './cadastro-categoria.page.html',
  styleUrls: ['./cadastro-categoria.page.scss'],
})
export class CadastroCategoriaPage implements OnInit {

  categoria: Categoria
  inclusao: boolean
  avaliouFormulario = false

  constructor(
    private modalController: ModalController,
    private providerCategorias: CategoriasService,
    public navParams: NavParams,
    public utils: Utils,
    private alertController: AlertController
  ) { 
    this.categoria = navParams.get('categoria')
    this.inclusao = navParams.get('inclusao')
  }

  ngOnInit() {
  }

  cancelar() {
    this.modalController.dismiss()
  }

  async concluir(operacao = 'cadastro') {
    if (operacao != 'cadastro') {
      this.modalController.dismiss({ Operacao: operacao, Categoria: this.categoria })
    }
    else {
      this.avaliouFormulario = true

      if (this.categoria.Nome != null && this.categoria.Nome.length) {
        await this.providerCategorias.exibirProcessamento('Salvando categoria...')
        this.providerCategorias.salvar(this.categoria)
        .then(() => {
          this.modalController.dismiss({ Operacao: operacao, Categoria: this.categoria })
        })
        .catch(() => {
          alert('Não foi possível salvar a categoria')
        })
      }      
    }
  }

  async excluir() {
    const alert = await this.alertController.create({
      header: 'Excluir categoria',
      message: `Deseja realmente excluir a categoria ${this.categoria.Nome}?`,
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Sim',
          handler: () => {
            this.modalController.dismiss({ Operacao: 'excluir', Categoria: this.categoria })
          }
        }
      ]  
    });
  
    await alert.present();
  }
}
