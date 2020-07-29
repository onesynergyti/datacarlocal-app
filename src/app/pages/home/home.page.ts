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
  ) { 
    // Propagando ao entrar no sistema
    setTimeout(() => {
      this.propagandaService.showInterstitialAds()
    }, 2000);
  }

  ionViewWillEnter() {
    this.veiculos = []
    this.carregandoVeiculos = true
    setTimeout(() => {
      this.atualizarPatio()
    }, 1000);
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
    if (!this.configuracoesService.configuracoes.Seguranca.ExigirSenhaExcluirVeiculoPatio) {
      const alert = await this.alertController.create({
        header: 'Excluir veículo ' + veiculo.Placa,
        message: 'Deseja realmente excluir o veículo?',
        buttons: [
          {
            text: 'Não',
            role: 'cancel',
            cssClass: 'secondary',
          }, {
            text: 'Sim',
            handler: () => {
              this.confirmarExclusao(veiculo)
            }
          }
        ]  
      });
    
      await alert.present();
    }
    else {
      const modal = await this.modalController.create({
        component: ValidarAcessoPage,
        componentProps: {
          'mensagem': 'Informe a senha de administrador para excluir o veículo.'
        }  
      });
  
      modal.onWillDismiss().then((retorno) => {
        if (retorno.data == true)
          this.confirmarExclusao(veiculo)
      })
  
      return await modal.present(); 
    }
  }

  abrirWhatsapp(veiculo) {
    if (veiculo.Telefone && veiculo.Telefone.length >= 10)
      this.utils.abrirWhatsapp(veiculo.Telefone)
    else
      this.utils.mostrarToast('Não foi registrado o contato para esse veículo', 'danger')
  }

  async verificarConfiguracoesPendentes() {
    return new Promise((resolve, reject) => {
      // O estacionamento ou os serviços devem estar ativos
      // Se houver utilização de estacionamento, tem que ter a tabela configurada
      if (this.configuracoesService.configuracoes.Estacionamento.UtilizarEstacionamento && 
      !this.configuracoesService.configuracoes.Estacionamento.UtilizaDiaria &&
      !this.configuracoesService.configuracoes.Estacionamento.UtilizaFracao15Minutos &&
      !this.configuracoesService.configuracoes.Estacionamento.UtilizaFracao30Minutos &&
      !this.configuracoesService.configuracoes.Estacionamento.UtilizaHora &&
      !this.configuracoesService.configuracoes.Estacionamento.UtilizaPrimeirosMinutos) {
        reject({ Titulo: 'Configurar estacionamento', Mensagem: 'É necessário configurar a tabela de estacionamento ou desabilitar essa função antes de prosseguir. Deseja acessar as configurações agora?', Rota: 'configuracoes?pagina=estacionamento' })
      }
      // Se configurar que utiliza minutos iniciais, deve informar a quantidade de minutos
      if (this.configuracoesService.configuracoes.Estacionamento.UtilizarEstacionamento && 
      this.configuracoesService.configuracoes.Estacionamento.UtilizaPrimeirosMinutos &&
      (this.configuracoesService.configuracoes.Estacionamento.QuantidadePrimeirosMinutos == null || this.configuracoesService.configuracoes.Estacionamento.QuantidadePrimeirosMinutos <= 0)) {
        reject({ Titulo: 'Configurar estacionamento', Mensagem: 'Você optou por cobrar um valor fixo nos minutos iniciais, mas não definiu a quantidade de minutos. Deseja acessar as configurações agora?', Rota: 'configuracoes?pagina=estacionamento' })
      }
      // O cliente deve utilizar o campo do veículo ou do cartão pelo menos para identificação do usuário
      if (!this.configuracoesService.configuracoes.Patio.CampoCartao && 
      !this.configuracoesService.configuracoes.Patio.CampoVeiculo) {
        reject({ Titulo: 'Configurar patio', Mensagem: 'Suas configurações de identificação do veículo são inválidas. Habilite o campo do veículo ou do cartão de identificação no pátio. Deseja acessar a tela de configurações agora?', Rota: 'configuracoes?pagina=patio' })
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
      if (retorno.data.Operacao == 'finalizar') { 
        this.validarSaida(retorno.data.Veiculo)
      }
      else if (retorno.data.Operacao == 'excluir') {
        this.confirmarExclusao(retorno.data.Veiculo)
      }
      // Operações de saída do veículo
      else if (retorno.data.Operacao == 'postergar' || retorno.data.Operacao == 'pagamento') {
        // No caso do pagamento o retorno é do movimento
        const veiculo = retorno.data.Movimento.Veiculos[0]
        const veiculoLocalizado = this.veiculos.find(itemAtual => itemAtual.Placa === veiculo.Placa)
        this.veiculos.splice(this.veiculos.indexOf(veiculoLocalizado), 1)
        this.utils.mostrarToast(retorno.data.Operacao == 'postergar' ? 'Pagamento acumulado com sucesso' : 'Pagamento realizado com sucesso', 'success')

        if (this.bluetooth.dispositivoSalvo != null && this.configuracoesService.configuracoes.Recibo.ImprimirReciboSaida) { 
          await this.bluetooth.exibirProcessamento('Comunicando com a impressora...')
          this.bluetooth.imprimirRecibo(retorno.data.Movimento, retorno.data.Operacao)
        }

        this.propagandaService.showInterstitialAds()
      }
      // Alteração ou inclusão de veículo
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
          
          if (this.bluetooth.dispositivoSalvo != null && this.configuracoesService.configuracoes.Recibo.ImprimirReciboEntrada) { 
            await this.bluetooth.exibirProcessamento('Comunicando com a impressora...')
            this.bluetooth.imprimirRecibo(retorno.data.Veiculo)
          }

          this.propagandaService.showInterstitialAds()
        }
      }
    }
  }

  async leituraQrCode() {
    const options = {
      prompt : "Se não possuir um código de barras retorne e consulte a placa.",

    }
    this.barcodeScanner.scan(options).then(barcodeData => {      
      if (barcodeData.text != '') {
        let veiculo = this.veiculos.find(itemAtual => (this.utils.stringPura(itemAtual.Placa) == this.utils.stringPura(barcodeData.text)) || (this.utils.stringPura(itemAtual.CodigoCartao) == this.utils.stringPura(barcodeData.text)))
        if (veiculo != null) {
          // Se houver serviços pendentes abre o cadastro do veículo para poder alterar
          if (veiculo.PossuiServicosPendentes) 
            this.cadastrarEntrada(veiculo)
          else
            this.validarSaida(veiculo)
        }
        else
          this.utils.mostrarToast('Não localizamos o código informado.', 'danger')
      }
    })
  }

  async imprimirReciboEntrada(veiculo) {
    await this.bluetooth.exibirProcessamento('Comunicando com a impressora...')
    this.bluetooth.imprimirRecibo(veiculo)
  }
   
  async procederRegistroSaida(veiculo: Veiculo) {
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

  async validarSaida(veiculo: Veiculo) {
    if (veiculo.TotalServicos < 0)
      this.utils.mostrarToast('O valor total dos serviços está menor que zero. Verifique os descontos concedidos.', 'danger', 3000)
    else if (veiculo.PossuiServicosPendentes) {
      const alert = await this.alertController.create({
        header: 'Serviços pendentes',
        message: 'Existem serviços não realizados nesse veículo. Confirma a realização deles para registrar a saída?',
        buttons: [
          {
            text: 'Não',
            role: 'cancel',
            cssClass: 'secondary',
          }, {
            text: 'Sim',
            handler: () => {
              veiculo.Servicos.forEach(servicoAtual => {
                servicoAtual.Executado = true
              })
              this.registrarSaida(veiculo)
            }
          }
        ]  
      });
    
      await alert.present();
    }
    else {
      this.registrarSaida(veiculo)
    }
  }

  async registrarSaida(veiculo: Veiculo) {
    veiculo.Saida = new Date()
    // Calcula os valores do serviço de estacionamento
    let servicoEstacionamento = veiculo.PossuiServicoEstacionamento
    if (servicoEstacionamento != null) {
      servicoEstacionamento.PrecoMoto = this.calculadoraEstacionamentoService.calcularPrecos(veiculo.Entrada, veiculo.Saida, 1)
      servicoEstacionamento.PrecoVeiculoPequeno = this.calculadoraEstacionamentoService.calcularPrecos(veiculo.Entrada, veiculo.Saida, 2)
      servicoEstacionamento.PrecoVeiculoMedio = this.calculadoraEstacionamentoService.calcularPrecos(veiculo.Entrada, veiculo.Saida, 3)
      servicoEstacionamento.PrecoVeiculoGrande = this.calculadoraEstacionamentoService.calcularPrecos(veiculo.Entrada, veiculo.Saida, 4)
    }

    // Se for veículo de mensalista zera os serviços contratados
    if (veiculo.IdMensalista > 0) {
      await this.providerMensalistas.exibirProcessamento('Calculando valores...')
      this.providerMensalistas.lista(veiculo.IdMensalista).then(mensalistas => {
        if (mensalistas.length > 0) {
          // Zera os valores dos serviços contratados pelo mensalista no momento do pagamento
          mensalistas[0].IdsServicos.forEach(idServico => {
            const servicoLocalizado = veiculo.Servicos.find(servicoAtual => servicoAtual.Id == idServico)
            if (servicoLocalizado != null) {
              servicoLocalizado.PrecoMoto = 0
              servicoLocalizado.PrecoVeiculoPequeno = 0
              servicoLocalizado.PrecoVeiculoMedio = 0
              servicoLocalizado.PrecoVeiculoGrande = 0
            }
          });
        }
        this.procederRegistroSaida(veiculo)
      })
    }
    else
      this.procederRegistroSaida(veiculo)
  }
}
