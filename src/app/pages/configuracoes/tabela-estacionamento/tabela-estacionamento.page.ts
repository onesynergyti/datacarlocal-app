import { Component, OnInit } from '@angular/core';
import { ConfiguracoesService } from 'src/app/services/configuracoes.service';
import { Utils } from 'src/app/utils/utils';
import { Configuracoes } from 'src/app/models/configuracoes';
import { PrecoEspecial } from 'src/app/models/preco-especial';
import { ModalController, AlertController } from '@ionic/angular';
import { CadastroPrecoEspecialPage } from './cadastro-preco-especial/cadastro-preco-especial.page';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';
import { UtilsLista } from 'src/app/utils/utils-lista';

@Component({
  selector: 'app-tabela-estacionamento',
  templateUrl: './tabela-estacionamento.page.html',
  styleUrls: ['./tabela-estacionamento.page.scss'],
  animations: [
    trigger('listAnimation', [
      transition('* <=> *', [
        query(':enter',
          [style({ opacity: 0 }), stagger('40ms', animate('800ms ease-out', style({ opacity: 1 })))],
          { optional: true }
        )
      ])
    ])
  ]
})
export class TabelaEstacionamentoPage implements OnInit {

  configuracoes: Configuracoes
  pagina = 'geral'

  constructor(
    private configuracoesService: ConfiguracoesService,
    public utils: Utils,
    private modalController: ModalController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.configuracoes = this.configuracoesService.configuracoes
  }

  ionViewWillLeave() {
    this.configuracoesService.configuracoes = this.configuracoes
  }

  async cadastrarPrecoEspecial(tipoVeiculo, precoEspecial = null) {
    let precoEspecialEdicao = new PrecoEspecial(precoEspecial)
    precoEspecialEdicao.TipoVeiculo = tipoVeiculo
    const modal = await this.modalController.create({
      component: CadastroPrecoEspecialPage,
      componentProps: {
        'precoEspecial': precoEspecialEdicao,
        'inclusao': precoEspecial == null
      }
    });

    modal.onWillDismiss().then((retorno) => {      
      if (retorno.data != null) {
        if (retorno.data.Operacao == 'cadastro') {          
          // Edição
          if (precoEspecial != null) {
            // Obtem o índice do cadastro que será editado
            let index = this.configuracoes.Estacionamento.PrecosEspeciais.findIndex(itemAtual => itemAtual.Minutos === precoEspecial.Minutos && itemAtual.TipoVeiculo === tipoVeiculo)
            // Confere se não existe um outro cadastro com o mesmo tempo informado na edição
            if (this.configuracoes.Estacionamento.PrecosEspeciais.findIndex(itemAtual => itemAtual.Minutos === retorno.data.Operacao.Minutos && itemAtual.Minutos !== precoEspecial.Minutos && itemAtual.TipoVeiculo === tipoVeiculo) < 0) {
              this.configuracoes.Estacionamento.PrecosEspeciais[index] = retorno.data.PrecoEspecial
            }
          }
          // Inclusão
          else {
            let index = this.configuracoes.Estacionamento.PrecosEspeciais.findIndex(itemAtual => itemAtual.Minutos === retorno.data.PrecoEspecial.Minutos && itemAtual.TipoVeiculo === tipoVeiculo)
            if (index < 0) {
              this.configuracoes.Estacionamento.PrecosEspeciais.push(retorno.data.PrecoEspecial)
            }
            else 
              this.utils.mostrarToast('Já existe um preço especial com esse tempo.', 'danger')
          }
        }
        else if (retorno.data.Operacao == 'excluir') {
          this.confirmarExclusaoPrecoEspecial(precoEspecial)
        }
      }
    })

    return await modal.present();
  }

  confirmarExclusaoPrecoEspecial(precoEspecial: PrecoEspecial) {
    let index = this.configuracoes.Estacionamento.PrecosEspeciais.findIndex(itemAtual => itemAtual.Minutos == precoEspecial.Minutos && itemAtual.TipoVeiculo == precoEspecial.TipoVeiculo)
    if (index >= 0) 
      this.configuracoes.Estacionamento.PrecosEspeciais.splice(index, 1)
  }

  async excluirPrecoEspecial(precoEspecial) {
    const alert = await this.alertController.create({
      header: 'Excluir produto',
      message: `Deseja realmente excluir o preço especial?`,
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Sim',
          handler: () => {
            this.confirmarExclusaoPrecoEspecial(precoEspecial)
          }
        }
      ]  
    });
  
    await alert.present();
  }
}
