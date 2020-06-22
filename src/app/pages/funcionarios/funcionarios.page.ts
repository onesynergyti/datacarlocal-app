import { Component, OnInit } from '@angular/core';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';
import { Funcionario } from 'src/app/models/funcionario';
import { ModalController } from '@ionic/angular';
import { CadastroFuncionarioPage } from './cadastro-funcionario/cadastro-funcionario.page';
import { UtilsLista } from 'src/app/utils/utils-lista';
import { FuncionariosService } from 'src/app/dbproviders/funcionarios.service';

@Component({
  selector: 'app-funcionarios',
  templateUrl: './funcionarios.page.html',
  styleUrls: ['./funcionarios.page.scss'],
  animations: [
    trigger('listAnimation', [
      transition('* <=> *', [
        query(':enter',
          [style({ opacity: 0 }), stagger('40ms', animate('800ms ease-out', style({ opacity: 1 })))],
          { optional: true }
        ),
        query(':leave',
          [style({ opacity: 1 }), stagger('40ms', animate('800ms ease-out', style({ opacity: 0 })))],
          { optional: true }
        )
      ])
    ])
  ]
})
export class FuncionariosPage implements OnInit {

  funcionarios = []
  carregandoFuncionarios = false

  constructor(
    private modalController: ModalController,
    private utilsLista: UtilsLista,
    private providerFuncionarios: FuncionariosService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.atualizarFuncionarios()
  }

  async cadastrarFuncionario(funcionario = null) {
    let funcionarioEdicao = new Funcionario(funcionario)
    const modal = await this.modalController.create({
      component: CadastroFuncionarioPage,
      componentProps: {
        'funcionario': funcionarioEdicao      
      }
    });

    modal.onWillDismiss().then((retorno) => {
      if (retorno.data != null)
        this.utilsLista.atualizarLista(this.funcionarios, retorno.data, true)
    })

    return await modal.present(); 
  }

  atualizarFuncionarios() {
    this.funcionarios = []
    this.carregandoFuncionarios = true
    this.providerFuncionarios.lista().then((lista: any) => {
      this.funcionarios = lista
    })    
    // Em caso de erro
    .catch(() => {
      alert(JSON.stringify('Não foi possível carregar os funcionários.'))
    })
    .finally(() => {
      this.carregandoFuncionarios = false
    })
  }
}
