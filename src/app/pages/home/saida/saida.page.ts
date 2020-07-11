import { Component } from '@angular/core';
import { ModalController, NavParams, AlertController } from '@ionic/angular';
import { PatioService } from 'src/app/dbproviders/patio.service';
import { Utils } from 'src/app/utils/utils';
import { Movimento } from 'src/app/models/movimento';
import { ConfiguracoesService } from 'src/app/services/configuracoes.service';
import { ValidarAcessoPage } from '../../validar-acesso/validar-acesso.page';

@Component({
  selector: 'app-saida',
  templateUrl: './saida.page.html',
  styleUrls: ['./saida.page.scss'],
})
export class SaidaPage {

  movimento: Movimento
  somenteLeitura: boolean = false

  constructor(
    private modalCtrl: ModalController,
    public navParams: NavParams,
    private patio: PatioService,
    public utils: Utils,
    public configuracoesService: ConfiguracoesService,
    private alertController: AlertController
  ) { 
    this.movimento = navParams.get('movimento')
    this.somenteLeitura = navParams.get('somenteLeitura') != null && navParams.get('somenteLeitura')
  }

  cancelar() {
    this.modalCtrl.dismiss()
  }

  async concluir(operacao = 'pagamento') {
    if (operacao == 'pagamento') {
      if (this.totalPago < this.movimento.TotalServicos)
        this.utils.mostrarToast('O valor pago não foi suficiente.', 'danger')
      else if (this.troco > this.movimento.ValorDinheiro) {
        this.utils.mostrarToast('O valor pago em dinheiro não permite troco.', 'danger')
      }
      else {
        await this.patio.exibirProcessamento('Registrando saida...')
        this.patio.registrarSaida(this.movimento)
        .then(() => {
          this.modalCtrl.dismiss({ Operacao: operacao, Movimento: this.movimento })
        })
        .catch((erro) => {
          alert(JSON.stringify(erro))
        })
      }
    }
    // Qualquer outra operação que não seja pagamento retorna somente o veículo
    else {
      this.modalCtrl.dismiss({ Operacao: operacao, Veiculo: this.movimento.Veiculos[0] })
    }
  }  

  async concluirDepois() {
    // Verifica permissão para pagar depois
    if (!this.configuracoesService.configuracoes.Seguranca.ExigirSenhaPagarDepois) {
      const alert = await this.alertController.create({
        header: 'Prorrogar pagamento',
        message: 'Deseja realmente prorrogar o pagamento desse veículo?',
        buttons: [
          {
            text: 'Não',
            role: 'cancel',
            cssClass: 'secondary',
          }, {
            text: 'Sim',
            handler: () => {
              this.confirmarConcluirDepois()
            }
          }
        ]  
      });
    
      await alert.present();
    }
    else {
      const modal = await this.modalCtrl.create({
        component: ValidarAcessoPage,
        componentProps: {
          'mensagem': 'Informe a senha de administrador para prorrogar o pagamento.'
        }  
      });
  
      modal.onWillDismiss().then((retorno) => {
        if (retorno.data == true)
          this.confirmarConcluirDepois()
      })
  
      return await modal.present(); 
    }
  }  

  async confirmarConcluirDepois() {
    await this.patio.exibirProcessamento('Salvando pagamento...')
    setTimeout(() => {
      this.movimento.Veiculos[0].Ativo = false
      this.patio.salvar(this.movimento.Veiculos[0])
      .then(() => {
        this.modalCtrl.dismiss({ Operacao: 'postergar', Movimento: this.movimento })
      })
      .catch((erro) => {
        alert(JSON.stringify(erro))
      })
    }, 200);
  }

  get tamanhoBotaoExcluir() {
    return this.somenteLeitura ? 12 : 2
  }

  get totalPago() {
    return this.movimento.ValorCredito + this.movimento.ValorDebito + this.movimento.ValorDinheiro
  }

  get troco() {
    const troco = this.totalPago - this.movimento.TotalServicos
    return troco > 0 ? troco : 0
  }
}
