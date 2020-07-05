import { Component } from '@angular/core';
import { Veiculo } from '../../models/veiculo';
import { PatioService } from '../../dbproviders/patio.service';
import { ModalController, ActionSheetController, NavController, AlertController } from '@ionic/angular';
import { EntradaPage } from './entrada/entrada.page';
import { BluetoothService } from '../../services/bluetooth.service';
import { Utils } from 'src/app/utils/utils';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ConfiguracoesService } from 'src/app/services/configuracoes.service';
import { ServicoVeiculo } from 'src/app/models/servico-veiculo';
import { SaidaPage } from './saida/saida.page';
import { Movimento } from 'src/app/models/movimento';
import { PropagandasService } from 'src/app/services/propagandas.service';
import { CalculadoraEstacionamentoService } from 'src/app/services/calculadora-estacionamento.service';
import { MensalistasService } from 'src/app/dbproviders/mensalistas.service';
import { ServicosService } from 'src/app/dbproviders/servicos.service';
import { ValidarAcessoPage } from '../validar-acesso/validar-acesso.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
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
export class HomePage {

  carregandoVeiculos = false
  veiculos = []
  placa
  pontos = 0
  pesquisa = ''

  constructor(
    private providerPatio: PatioService,
    private modalController: ModalController,
    public bluetooth: BluetoothService,
    private utils: Utils,
    private barcodeScanner: BarcodeScanner,
    public configuracoesService: ConfiguracoesService,
    public propagandaService: PropagandasService,
    private calculadoraEstacionamentoService: CalculadoraEstacionamentoService,
    private providerMensalistas: MensalistasService,
    private navController: NavController,
    private alertController: AlertController,
    private providerServicos: ServicosService
  ) { }

  ionViewDidEnter() {
    this.atualizarPatio()
  }

  atualizarPatio() {
    this.veiculos = []
    this.carregandoVeiculos = true
    this.providerPatio.lista().then((lista: any) => {
      this.veiculos = lista
    })    
    // Em caso de erro
    .catch((erro) => {
      alert(JSON.stringify('Não foi possível carregar os veículos do pátio. ' + erro))
    })
    .finally(() => {
      this.carregandoVeiculos = false
    })
  }

  get listaFiltrada() {
    if (this.pesquisa == '')
      return this.veiculos

    return this.veiculos.filter(itemAtual => this.utils.stringPura(itemAtual.Placa).includes(this.utils.stringPura(this.pesquisa)))
  }

  async confirmarExclusao(veiculo) {
    await this.providerPatio.exibirProcessamento('Excluindo veículo...')
    this.providerPatio.excluir(veiculo.Id)
    .then(() => {
      this.veiculos.splice(this.veiculos.indexOf(veiculo), 1)
    })
    .catch(() => {
      this.utils.mostrarToast('Não foi possível excluir o veículo.', 'danger')
    })
  }

  async excluir(veiculo) {
    const modal = await this.modalController.create({
      component: ValidarAcessoPage
    });

    modal.onWillDismiss().then((retorno) => {
      if (retorno.data == true)
        this.confirmarExclusao(veiculo)
    })

    return await modal.present(); 
  }

  abrirWhatsapp(veiculo) {
    if (veiculo.Telefone && veiculo.Telefone.length >= 10)
      veiculo.enviarMensagemWhatsapp(veiculo.Telefone)
    else
      this.utils.mostrarToast('Não foi registrado o contato para esse veículo', 'danger')
  }

  async verificarConfiguracoesPendentes() {
    return new Promise((resolve, reject) => {
      // O estacionamento ou os serviços devem estar ativos
      if (!this.configuracoesService.configuracoes.Estacionamento.UtilizarEstacionamento && !this.configuracoesService.configuracoes.UtilizaServicos) {
        reject({ Titulo: 'Configuração inválida', Mensagem: 'Você deve habilitar a função de estacionamento ou serviços. Deseja acessar as configurações agora?', Rota: 'configuracoes' })
      }
      // Se houver utilização de estacionamento, tem que ter a tabela configurada
      else if (this.configuracoesService.configuracoes.Estacionamento.UtilizarEstacionamento && 
      !this.configuracoesService.configuracoes.Estacionamento.UtilizaDiaria &&
      !this.configuracoesService.configuracoes.Estacionamento.UtilizaFracao15Minutos &&
      !this.configuracoesService.configuracoes.Estacionamento.UtilizaFracao30Minutos &&
      !this.configuracoesService.configuracoes.Estacionamento.UtilizaHora &&
      !this.configuracoesService.configuracoes.Estacionamento.UtilizaPrimeirosMinutos) {
        reject({ Titulo: 'Configurar estacionamento', Mensagem: 'É necessário configurar a tabela de estacionamento ou desabilitar essa função antes de prosseguir. Deseja acessar as configurações agora?', Rota: 'configuracoes?pagina=estacionamento' })
      }
      else {
        // Se não utiliza estacionamento, então tem que ter algum serviço cadastrado
        this.providerServicos.lista().then(servicos => {
          if (!this.configuracoesService.configuracoes.Estacionamento.UtilizarEstacionamento && servicos.length == 0)
            reject({ Titulo: 'Configurar serviços', Mensagem: 'É necessário cadastrar pelo menos um serviço antes de prosseguir. Deseja acessar as configurações agora?', Rota: 'servicos' })
          else
            resolve()
        })
        .catch(erro => {
          reject({ Titulo: 'Erro na verificação', Mensagem: 'Não foi possível verificar as configurações. Tente novamente' })
        })
      }
    })
  }

  async procederCadastroEntrada(veiculo) {
    let inclusao = false
    let veiculoEdicao: Veiculo

    // Define os parâmetros iniciais se não houver veículo indicado para edição
    if (veiculo == null) {
      // Trata mensagens e ações quando for ateração ou inclusão de novo veículo
      inclusao = true

      veiculoEdicao = new Veiculo()      

      // Define serviços de estacionamento se for configurado para incluir automaticamente
      if (this.configuracoesService.configuracoes.Estacionamento.UtilizarEstacionamento && this.configuracoesService.configuracoes.Estacionamento.IncluirServicoEstacionamento) {
        let servico = new ServicoVeiculo()
        servico.Id = 0
        servico.Nome = 'Estacionamento'
        veiculoEdicao.Servicos.push(servico)
      }      
    }
    else 
      veiculoEdicao = new Veiculo(veiculo)    

    const modal = await this.modalController.create({
      component: EntradaPage,
      componentProps: {
        'veiculo': veiculoEdicao,
        'inclusao': inclusao
      }
    });

    modal.onWillDismiss().then((retorno) => {
      this.avaliarRetornoVeiculo(retorno, inclusao)
    })

    return await modal.present(); 
  }

  async exibirErroCadastroEntrada(erro) {
    let botoes

    if (erro.Rota == null) {
      botoes = [
        {
          text: 'Ok',
        }
      ]
    }
    else {
      botoes = [
        {
          text: 'Não',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Sim',
          handler: () => {
            if (erro.Rota != null)
              this.navController.navigateForward(erro.Rota)
          }
        }
      ]
    }

    const alert = await this.alertController.create({
      header: erro.Titulo,
      message: erro.Mensagem,
      buttons: botoes
    });
  
    await alert.present();
  }

  async cadastrarEntrada(veiculo = null) {
    this.verificarConfiguracoesPendentes().then(() => {
      this.procederCadastroEntrada(veiculo)
    })
    .catch(erro => {
      this.exibirErroCadastroEntrada(erro)
    })
  }

  async avaliarRetornoVeiculo(retorno, inclusao) {
    if (retorno.data != null) {             
      // Caso tenha solicitado a finalização, abre a tela de saída
      if (retorno.data.Operacao == 'finalizar') { 
        this.registrarSaida(retorno.data.Veiculo)
      }
      // Saída de veículo, exclui o item 
      // ESSE CASO CONSIDERA QUE PODEM TER MÚLTIPLOS PAGAMENTOS
      else if (retorno.data.Operacao != 'entrada') {
        // A saída do veículo retorna o movimento completo
        const veiculos = retorno.data.Movimento.Veiculos

        // Exclui os veículos
        veiculos.slice().forEach(veiculoAtual => {
          this.veiculos.splice(this.veiculos.indexOf(this.veiculos.find(itemAtual => itemAtual.Placa === veiculoAtual.Placa)), 1)
        });
        
        if (this.bluetooth.dispositivoSalvo != null) {
          await this.bluetooth.exibirProcessamento('Comunicando com a impressora...')
          // Se for pagamento imprime o comprovante, caso contrário passa o veículo para imprimir o indicador de débito pendente
          this.bluetooth.imprimirRecibo(retorno.data.Operacao == 'pagamento' ? retorno.data.Movimento : retorno.data.Movimento.Veiculos[0], retorno.data.Operacao)
        }

        // Exibe uma propagando na saída do veículo
        this.propagandaService.showInterstitialAds()
      }
      // Alteração do veículo, altera o item 
      // ESSE CASO CONSIDERA QUE SÓ PODE TER UM VEÍCULO ALTERADO
      else {
        const veiculo = retorno.data.Veiculo
        const veiculoLocalizado = this.veiculos.find(itemAtual => itemAtual.Placa === veiculo.Placa)

        if (veiculoLocalizado != null) {
          this.veiculos[this.veiculos.indexOf(veiculoLocalizado)] = veiculo
        }
        // Inclusão do veículo, adiciona o item
        else {
          // Se for inclusão imprime o recibo
          this.veiculos.push(veiculo)

          this.utils.mostrarToast(inclusao ? 'Veículo adicionado com sucesso' : 'Alteração realizada com sucesso', 'success')        

          if (this.bluetooth.dispositivoSalvo != null) { 
            await this.bluetooth.exibirProcessamento('Comunicando com a impressora...')
            this.bluetooth.imprimirRecibo(retorno.data.Veiculo)
          }
        }
      }
    }
  }

  async leituraQrCode() {
    this.barcodeScanner.scan().then(barcodeData => {      
      if (barcodeData.text != '') {
        let veiculo = this.veiculos.find(itemAtual => this.utils.stringPura(itemAtual.Placa) == this.utils.stringPura(barcodeData.text))
        if (veiculo != null)
          this.cadastrarEntrada(veiculo)
        else
          this.utils.mostrarToast('Não localizamos o código informado.', 'danger')
      }
    })
  }

  async imprimirReciboEntrada(veiculo) {
    await this.bluetooth.exibirProcessamento('Comunicando com a impressora...')
    this.bluetooth.imprimirRecibo(veiculo)
  }
   
  async registrarSaida(veiculo) {
    if (veiculo.PossuiServicosPendentes) 
      this.utils.mostrarToast('Existem serviços pendentes de execução. Você deve finalizar todos os serviços ou excluir antes de realizar o pagamento.', 'danger', 3000)
    else {
      veiculo.Saida = new Date()
      let servicoEstacionamento = veiculo.PossuiServicoEstacionamento
      if (servicoEstacionamento) {
        await this.providerMensalistas.exibirProcessamento('Avaliando mensalistas...')
        this.providerMensalistas.validarMensalista(veiculo.Saida, veiculo.Placa).then(mensalistaValido => {
          if (mensalistaValido) {
            servicoEstacionamento.PrecoMoto = 0
            servicoEstacionamento.PrecoVeiculoPequeno = 0
            servicoEstacionamento.PrecoVeiculoMedio = 0
            servicoEstacionamento.PrecoVeiculoGrande = 0
          }
          else {
            servicoEstacionamento.PrecoMoto = this.calculadoraEstacionamentoService.calcularPrecos(veiculo.Entrada, veiculo.Saida, 1)
            servicoEstacionamento.PrecoVeiculoPequeno = this.calculadoraEstacionamentoService.calcularPrecos(veiculo.Entrada, veiculo.Saida, 2)
            servicoEstacionamento.PrecoVeiculoMedio = this.calculadoraEstacionamentoService.calcularPrecos(veiculo.Entrada, veiculo.Saida, 3)
            servicoEstacionamento.PrecoVeiculoGrande = this.calculadoraEstacionamentoService.calcularPrecos(veiculo.Entrada, veiculo.Saida, 4)
          }
        })
        .catch(erro => {
          alert('erro: ' + JSON.stringify(erro))
        })
      }
      let movimento = new Movimento()
      movimento.Veiculos.push(veiculo)
      movimento.Data = new Date()
      movimento.Descricao = 'Cobrança de veículo'

      const modal = await this.modalController.create({
        component: SaidaPage,
        componentProps: {
          'movimento': movimento
        }
      });
  
      modal.onWillDismiss().then((retorno) => {
        this.avaliarRetornoVeiculo(retorno, false)
      })
  
      return await modal.present(); 
    }
  }
}
