import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Funcionario } from 'src/app/models/funcionario';
import { FuncionariosService } from 'src/app/dbproviders/funcionarios.service';
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'app-cadastro-funcionario',
  templateUrl: './cadastro-funcionario.page.html',
  styleUrls: ['./cadastro-funcionario.page.scss'],
})
export class CadastroFuncionarioPage implements OnInit {

  funcionario: Funcionario
  inclusao: boolean = false
  avaliouFormulario = false

  constructor(
    private modalCtrl: ModalController,
    public navParams: NavParams,
    private funcionariosProvider: FuncionariosService,
    public utils: Utils
  ) { 
    this.funcionario = navParams.get('funcionario')
    this.inclusao = navParams.get('inclusao')
  }

  ngOnInit() {
  }

  cancelar() {
    this.modalCtrl.dismiss()
  }

  async concluir(operacao = 'cadastro') {
    if (operacao != 'cadastro') {
      this.modalCtrl.dismiss({ Operacao: operacao, Funcionario: this.funcionario })
    }
    else {
      this.avaliouFormulario = true

      if (this.funcionario.Nome.length > 0) {
        await this.funcionariosProvider.exibirProcessamento('Salvando funcionário...')
        this.funcionariosProvider.salvar(this.funcionario).then(funcionario => {
          this.modalCtrl.dismiss({ Operacao: operacao, Funcionario: funcionario })
        })
      }
    }
  }
}
