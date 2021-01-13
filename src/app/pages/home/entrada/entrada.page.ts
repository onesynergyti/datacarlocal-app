import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, AlertController } from '@ionic/angular';
import { Veiculo } from 'src/app/models/veiculo';
import { PatioService } from 'src/app/dbproviders/patio.service';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';
import { Utils } from 'src/app/utils/utils';
import { CadastroServicoPage } from './cadastro-servico/cadastro-servico.page';
import { UtilsLista } from 'src/app/utils/utils-lista';
import { FuncionariosService } from 'src/app/dbproviders/funcionarios.service';
import { SelectPopupModalPage } from 'src/app/components/select-popup-modal/select-popup-modal.page';
import { Funcionario } from 'src/app/models/funcionario';
import { ConfiguracoesService } from 'src/app/services/configuracoes.service';
import { ValidarAcessoPage } from '../../validar-acesso/validar-acesso.page';
import { MensalistasService } from 'src/app/dbproviders/mensalistas.service';
import { Mensalista } from 'src/app/models/mensalista';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Avaria } from 'src/app/models/avaria';
import { CadastroProdutoPage } from './cadastro-produto/cadastro-produto.page';
import { PropagandasService } from 'src/app/services/propagandas.service';

@Component({
  selector: 'app-entrada',
  templateUrl: './entrada.page.html',
  styleUrls: ['./entrada.page.scss'],
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
export class EntradaPage implements OnInit {

  pagina = 'veiculo'
  pesquisa
  inclusao = false
  veiculo: Veiculo
  avaliouFormulario = false
  idAvariaSelecionada = 0
  imagensAvaria = [
    { TipoVeiculo: 1, Nome: 'Comum', NomeImagem: 'moto_padrao_v1.png' },
    { TipoVeiculo: 2, Nome: 'Hatch', NomeImagem: 'hatch_v1.png' },
    { TipoVeiculo: 2, Nome: 'Conversível', NomeImagem: 'conversivel_v1.png' },
    { TipoVeiculo: 2, Nome: 'Pickup', NomeImagem: 'pickup_pequena_v1.png' },
    { TipoVeiculo: 3, Nome: 'Sedã', NomeImagem: 'seda_v1.png' },
    { TipoVeiculo: 3, Nome: 'Conversível', NomeImagem: 'conversivel_v1.png' },
    { TipoVeiculo: 4, Nome: 'SUV', NomeImagem: 'suv_v1.png' },
    { TipoVeiculo: 4, Nome: 'Pickup', NomeImagem: 'pickup_grande_v1.png' },
    { TipoVeiculo: 4, Nome: 'Van', NomeImagem: 'van_v1.png' },
    { TipoVeiculo: 5, Nome: 'Comum', NomeImagem: 'moto_padrao_v1.png' },
    { TipoVeiculo: 6, Nome: 'Comum', NomeImagem: 'moto_padrao_v1.png' }
  ]
  
  constructor(
    private modalCtrl: ModalController,
    private patioProvider: PatioService,
    public navParams: NavParams,
    public utils: Utils,
    public utilsLista: UtilsLista,
    private alertController: AlertController,
    private funcionariosProvider: FuncionariosService,
    public configuracoesService: ConfiguracoesService,
    private providerMensalistas: MensalistasService,
    private barcodeScanner: BarcodeScanner,
    public propagandaService: PropagandasService,
  ) { 
    this.veiculo = navParams.get('veiculo')
    this.inclusao = navParams.get('inclusao')
  }

  ngOnInit() {
  }

  get imagensAvariaTipoVeiculo() {
    return this.imagensAvaria.filter(imagemAtual => imagemAtual.TipoVeiculo == this.veiculo.TipoVeiculo)
  }

  caminhoImagem(imagem) {
    return '../../../assets/img/avarias/' + imagem
  }

  async abrirModalFuncionarios() {
    const modal = await this.modalCtrl.create({
      component: SelectPopupModalPage,
      componentProps: {
        'classe': 'funcionario',
        'keyField': 'Nome',
        'titulo': 'Funcionários',
        'icone': 'person'
      }
    })

    modal.onWillDismiss().then((retorno) => {
      let funcionario = retorno.data
      if (funcionario != null) 
        this.veiculo.Funcionario = new Funcionario(funcionario)
    })

    return await modal.present(); 
  }

  async alterarAvaria(avaria) {
    const alert = await this.alertController.create({
      header: 'Inclusão de avaria',
      inputs: [
        {
          name: 'descricao',
          placeholder: 'Descrição da avaria',
          type: 'text',
          value: avaria.Nome
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Ok',
          handler: data => {
            if (data.descricao != null && data.descricao.length) {
              avaria.Cor = 'red'    

              let avariaEdicao = new Avaria(avaria)
              avariaEdicao.Nome = data.descricao

              // Se possui Id quer dizer que é edição 
              if (avariaEdicao.Id != null && avariaEdicao.Id > 0) {
                let avariaLocalizada = this.veiculo.Avarias.find(item => item.Id == avariaEdicao.Id)
                // Se já existir uma avaria com o mesmo Id, substitui ou exclui
                if (avariaLocalizada != null) {
                  let index = this.veiculo.Avarias.indexOf(avariaLocalizada)
                  this.veiculo.Avarias.splice(index, 1, avariaEdicao)
                }
              }
              else {
                this.veiculo.Avarias.push(avariaEdicao)
                let idAux = 1
                this.veiculo.Avarias.map(itemAtual => {
                  itemAtual.Id = idAux++
                })
              }
            } 
            else {
              this.utils.mostrarToast('A descrição da avaria é obrigatória', 'danger')
            }
          }
        }
      ]
    });
    await alert.present();  
  }

  async alterarFuncionario() {
    // Verifica permissão para editar o funcionário
    if (this.inclusao || !this.configuracoesService.configuracoes.Seguranca.ExigirSenhaAlterarResponsavel) {
      this.abrirModalFuncionarios()
    }
    else {
      const modal = await this.modalCtrl.create({
        component: ValidarAcessoPage,
        componentProps: {
          'mensagem': 'Alterar um serviço do veículo.'
        }  
      });
  
      modal.onWillDismiss().then((retorno) => {
        if (retorno.data == true)
          this.abrirModalFuncionarios()
      })
  
      return await modal.present(); 
    }
  }

  cancelar() {
    this.modalCtrl.dismiss()
  }

  tratarPlaca(valor: string) {
    if (valor != null && valor.length >= 3) {
      this.patioProvider.consultaHistoricoPlaca(valor).then(veiculo => {
        this.veiculo.Nome = veiculo.Nome
        if (this.configuracoesService.configuracoes.Patio.SepararPrecosServico && this.configuracoesService.configuracoes.Patio.tipoVeiculoHabilitado(veiculo.TipoVeiculo))
          this.veiculo.TipoVeiculo = veiculo.TipoVeiculo
        this.veiculo.Telefone = veiculo.Telefone
        this.veiculo.Modelo = veiculo.Modelo
      })
    }

    return valor.toUpperCase().replace(/[^a-zA-Z0-9]/g,'')
  }

  async procederCadastroServico(servico) {
    const inclusao = servico == null
    const modal = await this.modalCtrl.create({
      component: CadastroServicoPage,
      componentProps: {
        'servicoVeiculo': servico,
        'tipoVeiculo': this.veiculo.TipoVeiculo,
        'inclusao': inclusao
      }
    })

    modal.onWillDismiss().then((retorno) => {
      if (retorno.data != null) {
        const servico = retorno.data.ServicoVeiculo
        if (retorno.data.Operacao = 'cadastro') {
          // Não permite incluir serviço repetido
          if (inclusao && (this.veiculo.Servicos.find(servicoAtual => servicoAtual.Id == servico.Id )))
            this.utils.mostrarToast('O serviço informado já existe.', 'danger')
          else
            this.utilsLista.atualizarLista(this.veiculo.Servicos, servico)
        }
        else
          this.utilsLista.excluirDaLista(this.veiculo.Servicos, servico)
      }
    })

    return await modal.present(); 
  }

  async procederCadastroProduto(produto) {
    const inclusao = produto == null
    const modal = await this.modalCtrl.create({
      component: CadastroProdutoPage,
      componentProps: {
        'produtoVeiculo': produto,
        'inclusao': inclusao
      }
    })

    modal.onWillDismiss().then((retorno) => {
      if (retorno.data != null) {
        const produto = retorno.data.ProdutoVeiculo
        if (retorno.data.Operacao = 'cadastro') {
          // Não permite incluir produto repetido
          if (inclusao && (this.veiculo.Produtos.find(produtoAtual => produtoAtual.Id == produto.Id )))
            this.utils.mostrarToast('O produto informado já existe.', 'danger')
          else
            this.utilsLista.atualizarLista(this.veiculo.Produtos, produto)
        }
        else
          this.utilsLista.excluirDaLista(this.veiculo.Produtos, produto)
      }
    })

    return await modal.present(); 
  }

  async cadastrarProduto(produto = null) {
    // Verifica permissão para editar serviços
    if (!this.configuracoesService.configuracoes.Seguranca.ExigirSenhaEditarServicosVeiculo || this.inclusao) {
      this.procederCadastroProduto(produto)
    }
    else {
      const modal = await this.modalCtrl.create({
        component: ValidarAcessoPage,
        componentProps: {
          'mensagem': 'Alterar um produto do veículo.'
        }  
      });
  
      modal.onWillDismiss().then((retorno) => {
        if (retorno.data == true)
          this.procederCadastroProduto(produto)
      })
  
      return await modal.present(); 
    }
  }


  async cadastrarServico(servico = null) {
    if (!this.veiculo.TipoVeiculo && this.configuracoesService.configuracoes.Patio.SepararPrecosServico) {
      this.utils.mostrarToast('Informe o tipo do veículo antes de adicionar um serviço', 'danger')    
    }
    else {
      // Verifica permissão para editar serviços
      if (!this.configuracoesService.configuracoes.Seguranca.ExigirSenhaEditarServicosVeiculo || this.inclusao) {
        this.procederCadastroServico(servico)
      }
      else {
        const modal = await this.modalCtrl.create({
          component: ValidarAcessoPage,
          componentProps: {
            'mensagem': 'Alterar um serviço do veículo.'
          }  
        });
    
        modal.onWillDismiss().then((retorno) => {
          if (retorno.data == true)
            this.procederCadastroServico(servico)
        })
    
        return await modal.present(); 
      }
    }
  }

  async confirmarSaida(operacao) {
    await this.patioProvider.exibirProcessamento('Registrando entrada...')

    this.patioProvider.lista(true, false, this.veiculo.Placa).then(veiculos => {
      // Não permite cadastro de veículo ativo com mesma placa          
      if (!this.inclusao || veiculos.length == 0) {
        this.providerMensalistas.validarMensalista(this.veiculo.Entrada, this.veiculo.Placa).then((mensalistaValido: Mensalista) => {
          this.veiculo.IdMensalista = mensalistaValido != null ? mensalistaValido.Id : 0

          this.patioProvider.salvar(this.veiculo)
          .then((veiculo) => {
            this.modalCtrl.dismiss({ Operacao: operacao, Veiculo: veiculo })
          })
          .catch((erro) => {
            alert('Não foi possível inserir o veículo. ' + JSON.stringify(erro))
          })
        })
        .finally(() => {
          this.patioProvider.ocultarProcessamento()
        })        
      }
      else {
        this.patioProvider.ocultarProcessamento()
        this.utils.mostrarToast('Já existe um veículo no pátio com essa placa.', 'danger')            
      }
    })
  }

  confirmarOperacao(operacao) {
    setTimeout(() => {
      this.modalCtrl.dismiss({ Operacao: operacao, Veiculo: this.veiculo })
    }, 1);
  }

  async concluir(operacao = 'entrada') {
    this.avaliouFormulario = true

    const valido = ((this.veiculo.Placa && this.veiculo.Placa.length == 7) || (this.veiculo.CodigoCartao.length > 0)) &&
      (this.veiculo.TipoVeiculo || !this.configuracoesService.configuracoes.Patio.SepararPrecosServico) && 
      (!this.veiculo.Modelo || this.veiculo.Modelo.length <= 30) && 
      (!this.veiculo.Nome || this.veiculo.Nome.length <= 100) && 
      (!this.veiculo.Localizacao || this.veiculo.Localizacao.length <= 50) && 
      (!this.veiculo.EntregaAgendada || (this.veiculo.EntregaAgendada && this.veiculo.PossuiServicoAgendavel)) && // Agendamento exige um serviço que permita previsão
      (!this.veiculo.Telefone || this.utils.telefoneValido(this.veiculo.Telefone))
    if (valido) {
      // Para finalizar o atendimento tem que finalizar os serviços
      if (operacao == 'finalizar' && this.veiculo.PossuiServicosPendentes)  {
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
                this.veiculo.Servicos.forEach(servicoAtual => {
                  servicoAtual.Executado = true
                })
                this.confirmarSaida(operacao)
              }
            }
          ]  
        });
      
        await alert.present();  
      }
      // Edição ou inclusão
      else if (operacao != 'excluir') {
        this.confirmarSaida(operacao)
      }
      // Exclusão
      else {
        if (!this.configuracoesService.configuracoes.Seguranca.ExigirSenhaExcluirVeiculoPatio) {
          const alert = await this.alertController.create({
            header: 'Excluir veículo ' + this.veiculo.Placa,
            message: 'Deseja realmente excluir o veículo?',
            buttons: [
              {
                text: 'Não',
                role: 'cancel',
                cssClass: 'secondary',
              }, {
                text: 'Sim',
                handler: () => {
                  this.confirmarOperacao(operacao)
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
              'mensagem': 'Informe a senha de administrador para excluir o veículo.'
            }  
          });
      
          modal.onDidDismiss().then((retorno) => {
            if (retorno.data == true)
              this.confirmarOperacao(operacao)
          })
      
          return await modal.present(); 
        }
      }
    }
  }

  definirPrevisaoEntrega() {
    if (this.veiculo.PrevisaoEntrega == null)
      this.veiculo.PrevisaoEntrega = new Date()
  }

  get imagemVistoria() {
    return '/assets/img/avarias/SUV.png'
  }

  selecionarAvaria(avaria: Avaria) {
    this.idAvariaSelecionada = avaria.Id
  }

  async selecionarTipoVeiculo(tipoVeiculo) {
    if (this.veiculo.Avarias.length > 0) {
      const alert = await this.alertController.create({
        header: 'As avarias apontadas serão perdidas?',
        message: `Tem certeza que deseja alterar o tipo de veículo?`,
        buttons: [
          {
            text: 'Não',
            role: 'cancel',
            cssClass: 'secondary'
          }, {
            text: 'Sim',
            handler: () => {
              this.veiculo.TipoVeiculo = tipoVeiculo
              this.veiculo.Avarias = []
              this.veiculo.ImagemAvaria = ''
            }
          }
        ]
      });
  
      await alert.present();
    }
    else {
      this.veiculo.TipoVeiculo = tipoVeiculo
      this.veiculo.ImagemAvaria = ''
    }
  }

  async excluirProduto(produto) {
    // Verifica permissão para excluir serviços
    if (!this.configuracoesService.configuracoes.Seguranca.ExigirSenhaEditarServicosVeiculo) {
      const alert = await this.alertController.create({
        header: 'Excluir serviço?',
        message: `Tem certeza que deseja excluir o produto <strong>${produto.Nome}</strong>`,
        buttons: [
          {
            text: 'Não',
            role: 'cancel',
            cssClass: 'secondary'
          }, {
            text: 'Sim',
            handler: () => {
              this.utilsLista.excluirDaLista(this.veiculo.Produtos, produto)
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
          'mensagem': `Exclusão do produto ${produto.Nome} no veículo.`
        }
      });
  
      modal.onWillDismiss().then((retorno) => {
        if (retorno.data == true)
          this.utilsLista.excluirDaLista(this.veiculo.Produtos, produto)
      })
  
      return await modal.present(); 
    }
  }

  async excluirServico(servico) {
    // Verifica permissão para excluir serviços
    if (!this.configuracoesService.configuracoes.Seguranca.ExigirSenhaEditarServicosVeiculo) {
      const alert = await this.alertController.create({
        header: 'Excluir serviço?',
        message: `Tem certeza que deseja excluir o serviço <strong>${servico.Nome}</strong>`,
        buttons: [
          {
            text: 'Não',
            role: 'cancel',
            cssClass: 'secondary'
          }, {
            text: 'Sim',
            handler: () => {
              this.utilsLista.excluirDaLista(this.veiculo.Servicos, servico)
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
          'mensagem': `Exclusão do serviço ${servico.Nome} no veículo.`
        }
      });
  
      modal.onWillDismiss().then((retorno) => {
        if (retorno.data == true)
          this.utilsLista.excluirDaLista(this.veiculo.Servicos, servico)
      })
  
      return await modal.present(); 
    }
  }

  async excluirAvaria(avaria) {
    const alert = await this.alertController.create({
      header: 'Excluir avaria?',
      message: `Tem certeza que deseja excluir a avaria <strong>${avaria.Nome}</strong>`,
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Sim',
          handler: () => {
            this.utilsLista.excluirDaLista(this.veiculo.Avarias, avaria)
          }
        }
      ]
    });

    await alert.present();
  }

  informarConclusaoWhatsapp() {
    if (this.veiculo.Telefone == null || this.veiculo.Telefone.length < 10) {
      this.utils.mostrarToast('Informe um telefone válido para o cliente.', 'danger')
    }
    else {
      let mensagem = this.configuracoesService.configuracoes.Mensagens.ConclusaoServicos
      mensagem = mensagem.replace('<PLACA>', this.utils.formatarPlaca(this.veiculo.Placa))
      this.utils.abrirWhatsapp(this.veiculo.Telefone, mensagem)
    }
  }

  async leituraCartao() {
    if (!this.inclusao) {
      const options = {
        prompt : "Aponte a câmera para o cartão de identificação.",
  
      }
      this.barcodeScanner.scan(options).then(barcodeData => {
        if (barcodeData.text != '') {
          this.veiculo.CodigoCartao = barcodeData.text
        }
      })
    }
    else {
      this.utils.mostrarToast('O código do cartão não pode ser alterado.', 'danger')
    }
  }

  selecionarDataPrevisao() {
    const dataPrevisao = this.veiculo.PrevisaoEntrega != null ? new Date(this.veiculo.PrevisaoEntrega) : new Date()
    this.utils.selecionarData(dataPrevisao)
    .then(data => {
      data.setHours(dataPrevisao.getHours())
      data.setMinutes(dataPrevisao.getMinutes())
      this.veiculo.PrevisaoEntrega = data
    });
  }

  selecionarHoraPrevisao() {
    const dataPrevisao = this.veiculo.PrevisaoEntrega != null ? new Date(this.veiculo.PrevisaoEntrega) : new Date()
    this.utils.selecionarHora(dataPrevisao)
    .then(hora => {
      this.veiculo.PrevisaoEntrega = hora
    });
  }
}
