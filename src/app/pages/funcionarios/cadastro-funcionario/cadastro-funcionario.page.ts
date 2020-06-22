import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Funcionario } from 'src/app/models/funcionario';
import { FuncionariosService } from 'src/app/dbproviders/funcionarios.service';

@Component({
  selector: 'app-cadastro-funcionario',
  templateUrl: './cadastro-funcionario.page.html',
  styleUrls: ['./cadastro-funcionario.page.scss'],
})
export class CadastroFuncionarioPage implements OnInit {

  funcionario: Funcionario

  constructor(
    private modalCtrl: ModalController,
    public navParams: NavParams,
    private funcionariosProvider: FuncionariosService
  ) { 
    this.funcionario = navParams.get('funcionario')
  }

  ngOnInit() {
  }

  cancelar() {
    this.modalCtrl.dismiss()
  }

  async concluir() {
    await this.funcionariosProvider.exibirProcessamento('Salvando funcionário...')
    this.funcionariosProvider.salvar(this.funcionario).then(funcionario => {
      this.modalCtrl.dismiss(funcionario)
    })
  }
}
