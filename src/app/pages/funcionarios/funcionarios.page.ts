import { Component, OnInit } from '@angular/core';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';
import { Funcionario } from 'src/app/models/funcionario';
import { ModalController, AlertController } from '@ionic/angular';
import { CadastroFuncionarioPage } from './cadastro-funcionario/cadastro-funcionario.page';
import { UtilsLista } from 'src/app/utils/utils-lista';
import { FuncionariosService } from 'src/app/dbproviders/funcionarios.service';
import { Utils } from 'src/app/utils/utils';

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
    private providerFuncionarios: FuncionariosService,
    private alertController: AlertController,
    public utils: Utils
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.atualizarFuncionarios()
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

  async cadastrarFuncionario(funcionario = null) {
    let funcionarioEdicao = new Funcionario(funcionario)
    const modal = await this.modalController.create({
      component: CadastroFuncionarioPage,
      componentProps: {
        'funcionario': funcionarioEdicao,
        'inclusao': funcionario == null  
      }
    });

    modal.onWillDismiss().then((retorno) => {
      if (retorno.data != null) {
        if (retorno.data.Operacao == 'cadastro')
          this.utilsLista.atualizarLista(this.funcionarios, retorno.data.Funcionario, true)
        else if (retorno.data.Operacao == 'excluir') 
          this.excluir(retorno.data.Funcionario)        
      }      
    })

    return await modal.present(); 
  }

  async confirmarExclusao(funcionario) {
    await this.providerFuncionarios.exibirProcessamento('Excluindo veículo...')
    this.providerFuncionarios.excluir(funcionario.Id)
    .then(() => {
      this.utilsLista.excluirDaLista(this.funcionarios, funcionario)
    })
    .catch(() => {
      this.utils.mostrarToast('Não foi possível excluir o serviço.', 'danger')
    })
  }

  async excluir(funcionario) {
    const alert = await this.alertController.create({
      header: 'Excluir funcionário',
      message: `Deseja realmente excluir o funcionário ${funcionario.Nome}?`,
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Sim',
          handler: () => {
            this.confirmarExclusao(funcionario)
          }
        }
      ]  
    });
  
    await alert.present();
  }
}
