import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { Injectable } from '@angular/core';
import { ServiceBaseService } from './service-base.service';
import { LoadingController, Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Utils } from '../utils/utils';
import { ConfiguracoesService } from './configuracoes.service';
import { Veiculo } from '../models/veiculo';
import { DatePipe } from '@angular/common';
import { Movimento } from '../models/movimento';

@Injectable({
  providedIn: 'root'
})
export class BluetoothService extends ServiceBaseService {

  public onDefinirDispositivo: BehaviorSubject<any> = new BehaviorSubject(null);
  falhaImpressao = null

  CMD = {
    LF: '\x0a', //Line feed for new lines
    EOL: '\n', //end of line
    FEED_CONTROL_SEQUENCES: {
        CTL_LF: '\x0a', // Print and line feed
        CTL_FF: '\x0c', // Form feed
        CTL_CR: '\x0d', // Carriage return
        CTL_HT: '\x09', // Horizontal tab
        CTL_VT: '\x0b', // Vertical tab
    },
    LINE_SPACING: {
        LS_DEFAULT: '\x1b\x32',  //Spacing
        LS_SET: '\x1b\x33'  //Spacing
    },
    HARDWARE: {
        HW_INIT: '\x1b\x40', // Clear data in buffer and reset modes
        HW_SELECT: '\x1b\x3d\x01', // Printer select
        HW_RESET: '\x1b\x3f\x0a\x00', // Reset printer hardware
    },
    CASH_DRAWER: {
        CD_KICK_2: '\x1b\x70\x00', // Sends a pulse to pin 2 []
        CD_KICK_5: '\x1b\x70\x01', // Sends a pulse to pin 5 []
    },
    MARGINS: {
        BOTTOM: '\x1b\x4f', // Fix bottom size
        LEFT: '\x1b\x6c', // Fix left size
        RIGHT: '\x1b\x51', // Fix right size
    },
    PAPER: {
        PAPER_FULL_CUT: '\x1d\x56\x00', // Full cut paper
        PAPER_PART_CUT: '\x1d\x56\x01', // Partial cut paper
        PAPER_CUT_A: '\x1d\x56\x41', // Partial cut paper
        PAPER_CUT_B: '\x1d\x56\x42', // Partial cut paper
    },
    TEXT_FORMAT: {
        TXT_NORMAL: '\x1b\x21\x00', // Normal text
        TXT_2HEIGHT: '\x1b\x21\x10', // Double height text
        TXT_2WIDTH: '\x1b\x21\x20', // Double width text
        TXT_4SQUARE: '\x1b\x21\x30', // Double width & height text

        TXT_CUSTOM_SIZE: function(width, height) { // other sizes
            var widthDec = (width - 1) * 16;
            var heightDec = height - 1;
            var sizeDec = widthDec + heightDec;
            return '\x1d\x21' + String.fromCharCode(sizeDec);
        },

        TXT_HEIGHT: {
            1: '\x00',
            2: '\x01',
            3: '\x02',
            4: '\x03',
            5: '\x04',
            6: '\x05',
            7: '\x06',
            8: '\x07'
        },
        TXT_WIDTH: {
            1: '\x00',
            2: '\x10',
            3: '\x20',
            4: '\x30',
            5: '\x40',
            6: '\x50',
            7: '\x60',
            8: '\x70'
        },

        TXT_UNDERL_OFF: '\x1b\x2d\x00', // Underline font OFF
        TXT_UNDERL_ON: '\x1b\x2d\x01', // Underline font 1-dot ON
        TXT_UNDERL2_ON: '\x1b\x2d\x02', // Underline font 2-dot ON
        TXT_BOLD_OFF: '\x1b\x45\x00', // Bold font OFF
        TXT_BOLD_ON: '\x1b\x45\x01', // Bold font ON
        TXT_ITALIC_OFF: '\x1b\x35', // Italic font ON
        TXT_ITALIC_ON: '\x1b\x34', // Italic font ON

        TXT_FONT_A: '\x1b\x4d\x00', // Font type A //normal font
        TXT_FONT_B: '\x1b\x4d\x01', // Font type B //small font
        TXT_FONT_C: '\x1b\x4d\x02', // Font type C //normal font

        TXT_ALIGN_LT: '\x1b\x61\x00', // Left justification
        TXT_ALIGN_CT: '\x1b\x61\x01', // Centering
        TXT_ALIGN_RT: '\x1b\x61\x02', // Right justification
    },
    BARCODE_FORMAT: {
        BARCODE_TXT_OFF: '\x1d\x48\x00', // HRI barcode chars OFF
        BARCODE_TXT_ABV: '\x1d\x48\x01', // HRI barcode chars above
        BARCODE_TXT_BLW: '\x1d\x48\x02', // HRI barcode chars below
        BARCODE_TXT_BTH: '\x1d\x48\x03', // HRI barcode chars both above and below

        BARCODE_FONT_A: '\x1d\x66\x00', // Font type A for HRI barcode chars
        BARCODE_FONT_B: '\x1d\x66\x01', // Font type B for HRI barcode chars

        BARCODE_HEIGHT: function(height) { // Barcode Height [1-255]
            return '\x1d\x68' + String.fromCharCode(height);
        },
        // Barcode Width  [2-6]
        BARCODE_WIDTH: {
            1: '\x1d\x77\x02',
            2: '\x1d\x77\x03',
            3: '\x1d\x77\x04',
            4: '\x1d\x77\x05',
            5: '\x1d\x77\x06',
        },
        BARCODE_HEIGHT_DEFAULT: '\x1d\x68\x64', // Barcode height default:100
        BARCODE_WIDTH_DEFAULT: '\x1d\x77\x01', // Barcode width default:1

        BARCODE_UPC_A: '\x1d\x6b\x00', // Barcode type UPC-A
        BARCODE_UPC_E: '\x1d\x6b\x01', // Barcode type UPC-E
        BARCODE_EAN13: '\x1d\x6b\x02', // Barcode type EAN13
        BARCODE_EAN8: '\x1d\x6b\x03', // Barcode type EAN8
        BARCODE_CODE39: '\x1d\x6b\x04', // Barcode type CODE39
        BARCODE_ITF: '\x1d\x6b\x05', // Barcode type ITF
        BARCODE_NW7: '\x1d\x6b\x06', // Barcode type NW7
        BARCODE_CODE93: '\x1d\x6b\x48', // Barcode type CODE93
        BARCODE_CODE128: '\x1d\x6b\x49', // Barcode type CODE128
    },
    CODE2D_FORMAT: {
        TYPE_PDF417: '\x1b\x5a\x00',
        TYPE_DATAMATRIX: '\x1b\x5a\x01',
        TYPE_QR: '\x1b\x5a\x02',
        CODE2D: '\x1b\x5a',
    },
    IMAGE_FORMAT: {
        S_RASTER_N: '\x1d\x76\x30\x00', // Set raster image normal size
        S_RASTER_2W: '\x1d\x76\x30\x01', // Set raster image double width
        S_RASTER_2H: '\x1d\x76\x30\x02', // Set raster image double height
        S_RASTER_Q: '\x1d\x76\x30\x03', // Set raster image quadruple
    },
    BITMAP_FORMAT: {
        BITMAP_S8: '\x1b\x2a\x00',
        BITMAP_D8: '\x1b\x2a\x01',
        BITMAP_S24: '\x1b\x2a\x20',
        BITMAP_D24: '\x1b\x2a\x21'
    },
    GSV0_FORMAT: {
        GSV0_NORMAL: '\x1d\x76\x30\x00',
        GSV0_DW: '\x1d\x76\x30\x01',
        GSV0_DH: '\x1d\x76\x30\x02',
        GSV0_DWDH: '\x1d\x76\x30\x03'
    }
  };

  constructor(
    private bluetoothSerial: BluetoothSerial,
    public loadingController: LoadingController,
    private utils: Utils,
    private configuracoesService: ConfiguracoesService,
    public plt: Platform
  ) { 
    super(loadingController)

    if (this.plt.is('ios')) {
    }
    else {
      // Tenta iniciar a conexão com a impressora se o bluetooth estiver ligado
      bluetoothSerial.isEnabled().then(() => {
        // Verifica se existe uma conexão salva e tenta conectar
        if (this.dispositivoSalvo != null) {
          this.bluetoothSerial.connect(this.dispositivoSalvo.id)
          .subscribe(() => {},
          (erro) => {
            // Verifica se a conexão salva existe na lista de dispositivos pareados
            this.listaDispositivosPareados().then((lista) => {
              // Se listou os dispositivos, verifica se o dispositivo salvo está pareado.
              // Caso não esteja, cancela a conexão salva
              if (lista.length) {
                let dispositivoLocalizado = lista.find(itemAtual => itemAtual.id === this.dispositivoSalvo.id)
                // Cancela a conexão salva se não existir
                if (dispositivoLocalizado == null) 
                  localStorage.removeItem('impressoraConectada')
              }
            })
            this.utils.mostrarToast('Não foi possível conectar a impressora configurada', 'warning')
          })  
        }
      })
    }
  }
  
  get dispositivoSalvo(): any {
    return JSON.parse(localStorage.getItem('impressoraConectada'))
  }

  desconectar(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.bluetoothSerial.disconnect().then(() => {
        localStorage.removeItem('impressoraConectada')
        resolve(true)
      })
      .catch(() => {
        reject
      })
    })
  }

  public conectarDispositivo(dispositivo) {
    return new Promise((resolve, reject) => {
      this.bluetoothSerial.isConnected().then((retorno) => {
        this.ocultarProcessamento()
        this.utils.mostrarToast('Já existe um dispositivo conectado', 'warning')
        reject()
      })
      .catch(() => {
        this.bluetoothSerial.connect(dispositivo.id).subscribe(() => {
          this.ocultarProcessamento()
          localStorage.setItem('impressoraConectada', JSON.stringify(dispositivo))
          this.onDefinirDispositivo.next(dispositivo)
  
          // Verifica se houve uma falha na impressão para tentar reimprimir
          if (this.falhaImpressao != null) {
            // Se houve sucesso na conexão faz a impressão
            if (dispositivo != null) {
              switch (this.falhaImpressao.Operacao) {
                case 'entrada': this.imprimirReciboEntrada(this.falhaImpressao.Objeto); break;
                case 'pagamento': this.imprimirReciboSaida(this.falhaImpressao.Objeto); break;
                case 'postergar': this.imprimirReciboSaida(this.falhaImpressao.Objeto, true); break;
                case 'teste': this.testarImpressora(); break;
              }
            }
            else 
              this.utils.mostrarToast('Houve uma falha na tentativa de impressão. Verifique sua impressora.', 'warning')
          }
          // Limpa o registro de falha, pois só tenta reimprimir uma vez
          this.falhaImpressao = null

          resolve()
        },
        () => {
          this.ocultarProcessamento()
          this.utils.mostrarToast('Houve uma falha na conexão com o dispositivo. Verifique sua impressora.', 'warning')
          this.onDefinirDispositivo.next(null)
          reject()
        })  
      })
    })
  }

  listaDispositivosPareados() {
    if (this.plt.is('ios')) {
      alert('listando IOS')
    }
    else {
      return this.bluetoothSerial.list()
    }
  }

  qrCode(valor) {
    var qr_model       = '\x32';          // 31 or 32
    var qr_eclevel     = '\x33';          // error correction level (30, 31, 32, 33 - higher)
    var qr_pL          = String.fromCharCode((valor.length + 3) % 256);
    var qr_pH          = String.fromCharCode((valor.length + 3) / 256);

    let texto = '\x1B\x61\x01' +
    '\x1D\x28\x6B\x04\x00\x31\x41' + qr_model + '\x00' +        // Select the model
    '\x1D\x28\x6B\x03\x00\x31\x43\x08' +                  // Size of the model
    '\x1D\x28\x6B\x03\x00\x31\x45' + qr_eclevel +               // Set n for error correction
    '\x1D\x28\x6B' + qr_pL + qr_pH + '\x31\x50\x30' + valor +   // Store data
    '\x1D\x28\x6B\x03\x00\x31\x51\x30'                         // Print

    return texto
  }

  async imprimirRecibo(objeto, operacao = 'entrada') {
    this.bluetoothSerial.isEnabled().then(() => {
      // Trata a impressão do recibo
      if (this.dispositivoSalvo != null) {      
        this.validarConexao().then((conexao) => {
          if (conexao) {
            this.ocultarProcessamento()
            switch (operacao) {
              case 'entrada': this.imprimirReciboEntrada(objeto); break;
              case 'pagamento': this.imprimirReciboSaida(objeto); break;
              case 'postergar': this.imprimirReciboSaida(objeto, true); break;
              case 'teste': this.testarImpressora(); break;
            }
          }
          else {
            this.falhaImpressao = {Operacao: operacao, Objeto: objeto}
            // Tenta conectar novamente para imprimir, se conseguir
            // Veja onDefinirDispositivo no construtor
            // Aguarda 2 segundos para que o usuário possa visualizar a mensagem de sucesso no registro
            setTimeout(() => { this.conectarDispositivo(this.dispositivoSalvo) }, 2000);
          }
        })
        .catch(() => { 
          this.ocultarProcessamento()
          this.utils.mostrarToast('Ocorreu um erro inesperado. Tente novamente.', 'danger')
        })
      }
      else {
        this.ocultarProcessamento()
        this.utils.mostrarToast('Nenhum dispositivo conectado.', 'danger')
      }
    })
    .catch(() => {
      this.ocultarProcessamento()
      this.utils.mostrarToast('O bluetooth do dispositivo está desabilitado.', 'danger')
    })
  }

  testarImpressora() {
    this.bluetoothSerial.write('\x1C\x2E\x1B\x74\x10'); // UTF-8
    this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_ALIGN_CT);
    this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_FONT_A);
    this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_NORMAL);
    this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_BOLD_ON);
    this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_4SQUARE);
    this.bluetoothSerial.write('PARABÉNS');
    this.bluetoothSerial.write(this.CMD.EOL);
    this.bluetoothSerial.write(this.CMD.EOL);
    this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_2HEIGHT);
    this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_BOLD_ON);
    this.bluetoothSerial.write('CONECTADO COM SUCESSO');
    this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_NORMAL);
    this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_BOLD_OFF);
    this.bluetoothSerial.write(this.CMD.EOL);
    this.bluetoothSerial.write(this.CMD.EOL);
    this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_ALIGN_LT);
    this.bluetoothSerial.write('Se você consegue ler essa mensagem significa que já podemos utilizar a impressão dos recibos no aplicativo!');
    this.bluetoothSerial.write(this.CMD.EOL);
    this.bluetoothSerial.write(this.CMD.EOL);
    this.bluetoothSerial.write(this.CMD.EOL);
    this.bluetoothSerial.write(this.CMD.EOL);
    this.bluetoothSerial.write(this.CMD.FEED_CONTROL_SEQUENCES.CTL_LF);
  }

  imprimirReciboEntrada(veiculo: Veiculo) {
    let configuracao = this.configuracoesService.configuracoes
    if (configuracao.Recibo.CaractersImpressao == null)
      configuracao.Recibo.CaractersImpressao = 32 // Tamanho considerado padrão para impressoras de pequeno porte
        
    this.bluetoothSerial.write('\x1C\x2E\x1B\x74\x10'); // UTF-8
    this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_ALIGN_CT);
    this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_FONT_A);
    this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_NORMAL);
    this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_BOLD_ON);
    this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_4SQUARE);
    this.bluetoothSerial.write('ENTRADA');
    this.bluetoothSerial.write(this.CMD.EOL);
    this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_NORMAL);
    this.bluetoothSerial.write(new DatePipe('en-US').transform(veiculo.Entrada, 'dd/MM/yyyy HH:mm'));
    this.bluetoothSerial.write(this.CMD.EOL);
    this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_BOLD_OFF);
    this.bluetoothSerial.write(this.utils.completarCaracter('', configuracao.Recibo.CaractersImpressao, '-'));
    this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_2HEIGHT);
    this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_BOLD_ON);
    this.bluetoothSerial.write(configuracao.Estabelecimento.Nome);
    this.bluetoothSerial.write(this.CMD.EOL);
    if (configuracao.Recibo.ExibirCNPJ) {
      this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_NORMAL);
      this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_BOLD_ON);
      this.bluetoothSerial.write(this.utils.formatarDocumento(configuracao.Estabelecimento.Documento));
      this.bluetoothSerial.write(this.CMD.EOL);
    }
    if (configuracao.Recibo.EnderecoLinha1 != null && configuracao.Recibo.EnderecoLinha1.length) {
      this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_ALIGN_CT);
      this.bluetoothSerial.write(configuracao.Recibo.EnderecoLinha1);
      this.bluetoothSerial.write(this.CMD.EOL);
    }
    if (configuracao.Recibo.EnderecoLinha2 != null && configuracao.Recibo.EnderecoLinha2.length) {
      this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_ALIGN_CT);
      this.bluetoothSerial.write(configuracao.Recibo.EnderecoLinha2);
      this.bluetoothSerial.write(this.CMD.EOL);
    }
    this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_BOLD_OFF);
    this.bluetoothSerial.write(this.utils.completarCaracter('', configuracao.Recibo.CaractersImpressao, '-'));
    this.bluetoothSerial.write(this.CMD.EOL);
    if (veiculo.PossuiServicoAgendavel || veiculo.Produtos.length > 0) {
      this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_NORMAL);
      this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_BOLD_ON);
      this.bluetoothSerial.write('VENDAS');
      this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_BOLD_OFF);
      this.bluetoothSerial.write(this.CMD.EOL);
      this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_ALIGN_LT);
      veiculo.Servicos.forEach(servico => {
        if (servico.Id) {
          this.bluetoothSerial.write(servico.Nome.substr(0, configuracao.Recibo.CaractersImpressao - 12));
          this.bluetoothSerial.write(this.utils.completarCaracter(veiculo.precoServico(servico).toFixed(2).replace('.', ','), configuracao.Recibo.CaractersImpressao - servico.Nome.substr(0, configuracao.Recibo.CaractersImpressao - 12).length));
          this.bluetoothSerial.write(this.CMD.EOL);  
        }
      });
      veiculo.Produtos.forEach(produto => {
        this.bluetoothSerial.write(produto.Nome.substr(0, configuracao.Recibo.CaractersImpressao - 12));
        this.bluetoothSerial.write(this.utils.completarCaracter(produto.precoFinal.toFixed(2).replace('.', ','), configuracao.Recibo.CaractersImpressao - produto.Nome.substr(0, configuracao.Recibo.CaractersImpressao - 12).length));
        this.bluetoothSerial.write(this.CMD.EOL);  
      });
      this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_BOLD_ON);
      this.bluetoothSerial.write('TOTAL');
      this.bluetoothSerial.write(this.utils.completarCaracter(veiculo.Total.toFixed(2).replace('.', ','), configuracao.Recibo.CaractersImpressao - 'TOTAL'.length));
      this.bluetoothSerial.write(this.CMD.EOL);
      this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_BOLD_OFF);
      this.bluetoothSerial.write(this.utils.completarCaracter('', configuracao.Recibo.CaractersImpressao, '-'));
      this.bluetoothSerial.write(this.CMD.EOL);
    }

    if (veiculo.PossuiServicoEstacionamento) {
      this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_NORMAL);
      this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_BOLD_ON);
      this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_ALIGN_CT);
      this.bluetoothSerial.write('ESTACIONAMENTO COBRADO POR TEMPO');
      this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_BOLD_OFF);
      this.bluetoothSerial.write(this.utils.completarCaracter('', configuracao.Recibo.CaractersImpressao, '-'));
    }

    this.bluetoothSerial.write(this.CMD.EOL);
    this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_NORMAL);
    this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_BOLD_ON);
    this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_ALIGN_CT);
    this.bluetoothSerial.write(this.utils.formatarPlaca(veiculo.Placa) + (veiculo.Modelo != null && veiculo.Modelo.length ? ' - ' + veiculo.Modelo : ''));
    this.bluetoothSerial.write(this.CMD.EOL);
    this.bluetoothSerial.write(this.CMD.EOL);
    this.bluetoothSerial.write(this.qrCode(veiculo.Placa));

    if (veiculo.Avarias.length > 0) {
      this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_NORMAL);
      this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_BOLD_OFF);
      this.bluetoothSerial.write(this.utils.completarCaracter('', configuracao.Recibo.CaractersImpressao, '-'));
      this.bluetoothSerial.write(this.CMD.EOL);
      this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_BOLD_ON);
      this.bluetoothSerial.write('AVARIAS DO VEÍCULO');
      this.bluetoothSerial.write(this.CMD.EOL);
      this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_BOLD_OFF);
      this.bluetoothSerial.write(this.utils.completarCaracter('', configuracao.Recibo.CaractersImpressao, '-'));
      this.bluetoothSerial.write(this.CMD.EOL);
      this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_ALIGN_LT);
      let numero = 1
      veiculo.Avarias.forEach(avaria => {
        this.bluetoothSerial.write(numero + ' - ' + avaria.Nome);
        numero++
        this.bluetoothSerial.write(this.CMD.EOL);  
      });
    }
    if (veiculo.Observacoes && veiculo.Observacoes.length > 0) {
      this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_NORMAL);
      this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_BOLD_OFF);
      this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_ALIGN_LT);
      this.bluetoothSerial.write(veiculo.Observacoes);
      this.bluetoothSerial.write(this.CMD.EOL);
      this.bluetoothSerial.write(this.CMD.EOL);
    }
    this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_BOLD_OFF);
    this.bluetoothSerial.write(this.utils.completarCaracter('', configuracao.Recibo.CaractersImpressao, '-'));
    this.bluetoothSerial.write(this.CMD.EOL);
    this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_NORMAL);
    this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_BOLD_ON);
    this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_ALIGN_CT);
    if (configuracao.Recibo.ExibirTelefoneRodape && configuracao.Estabelecimento.Telefone != null && configuracao.Estabelecimento.Telefone.length) {
      this.bluetoothSerial.write('FALE CONOSCO ' + this.utils.formatarTelefone(configuracao.Estabelecimento.Telefone));
      this.bluetoothSerial.write(this.CMD.EOL);
    }
    if (configuracao.Recibo.MensagemReciboEntrada != null && configuracao.Recibo.MensagemReciboEntrada.length) {
      this.bluetoothSerial.write(configuracao.Recibo.MensagemReciboEntrada);
    }
    this.bluetoothSerial.write(this.CMD.FEED_CONTROL_SEQUENCES.CTL_LF);
    this.bluetoothSerial.write(this.CMD.FEED_CONTROL_SEQUENCES.CTL_LF);
    this.bluetoothSerial.write(this.CMD.FEED_CONTROL_SEQUENCES.CTL_LF);
  }

  imprimirReciboSaida(movimento: Movimento, pendente = false) {
    let configuracao = this.configuracoesService.configuracoes
    if (configuracao.Recibo.CaractersImpressao == null)
      configuracao.Recibo.CaractersImpressao = 32 // Tamanho considerado padrão para impressoras de pequeno porte
        
    this.bluetoothSerial.write('\x1C\x2E\x1B\x74\x10'); // UTF-8
    this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_ALIGN_CT);
    this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_FONT_A);
    this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_NORMAL);
    this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_BOLD_ON);
    this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_4SQUARE);
    if (pendente)
      this.bluetoothSerial.write('DÉBITO');
    else
      this.bluetoothSerial.write('COMPROVANTE');
    this.bluetoothSerial.write(this.CMD.EOL);
    this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_NORMAL);
    this.bluetoothSerial.write(new DatePipe('en-US').transform(movimento.Data, 'dd/MM/yyyy HH:mm'));
    this.bluetoothSerial.write(this.CMD.EOL);
    this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_BOLD_OFF);
    this.bluetoothSerial.write(this.utils.completarCaracter('', configuracao.Recibo.CaractersImpressao, '-'));
    this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_2HEIGHT);
    this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_BOLD_ON);
    this.bluetoothSerial.write(configuracao.Estabelecimento.Nome);
    this.bluetoothSerial.write(this.CMD.EOL);
    if (configuracao.Recibo.ExibirCNPJ) {
      this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_NORMAL);
      this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_BOLD_ON);
      this.bluetoothSerial.write(this.utils.formatarDocumento(configuracao.Estabelecimento.Documento));
      this.bluetoothSerial.write(this.CMD.EOL);
    }
    if (configuracao.Recibo.EnderecoLinha1 != null && configuracao.Recibo.EnderecoLinha1.length) {
      this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_ALIGN_CT);
      this.bluetoothSerial.write(configuracao.Recibo.EnderecoLinha1);
      this.bluetoothSerial.write(this.CMD.EOL);
    }
    if (configuracao.Recibo.EnderecoLinha2 != null && configuracao.Recibo.EnderecoLinha2.length) {
      this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_ALIGN_CT);
      this.bluetoothSerial.write(configuracao.Recibo.EnderecoLinha2);
      this.bluetoothSerial.write(this.CMD.EOL);
    }
    this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_BOLD_OFF);
    this.bluetoothSerial.write(this.utils.completarCaracter('', configuracao.Recibo.CaractersImpressao, '-'));
    this.bluetoothSerial.write(this.CMD.EOL);
    this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_BOLD_ON);
    this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_NORMAL);
    this.bluetoothSerial.write(this.utils.formatarPlaca(movimento.Veiculos[0].Placa) + (movimento.Veiculos[0].Modelo != null && movimento.Veiculos[0].Modelo.length ? ' - ' + movimento.Veiculos[0].Modelo : ''));
    this.bluetoothSerial.write(this.CMD.EOL);
    this.bluetoothSerial.write(this.CMD.EOL);
    this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_2HEIGHT);
    this.bluetoothSerial.write('VENDAS');
    this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_BOLD_OFF);
    this.bluetoothSerial.write(this.CMD.EOL);
    this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_NORMAL);
    movimento.Veiculos.forEach(veiculoAtual => {
      this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_ALIGN_CT);
      this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_BOLD_ON);
      this.bluetoothSerial.write(this.utils.completarCaracter('', configuracao.Recibo.CaractersImpressao, '-'));
      this.bluetoothSerial.write(this.CMD.EOL);  
      this.bluetoothSerial.write(new DatePipe('en-US').transform(veiculoAtual.Entrada, 'dd/MM/yy HH:mm') + ' - ' + new DatePipe('en-US').transform(veiculoAtual.Saida, 'dd/MM/yy HH:mm'));
      this.bluetoothSerial.write(this.CMD.EOL);  
      this.bluetoothSerial.write(veiculoAtual.tempoPermanencia);
      this.bluetoothSerial.write(this.CMD.EOL);  
      this.bluetoothSerial.write(this.utils.completarCaracter('', configuracao.Recibo.CaractersImpressao, '-'));
      this.bluetoothSerial.write(this.CMD.EOL);  
      this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_ALIGN_LT);
      this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_BOLD_OFF);

      veiculoAtual.Servicos.forEach(servico => {
        this.bluetoothSerial.write(servico.Nome.substr(0, configuracao.Recibo.CaractersImpressao - 12));
        this.bluetoothSerial.write(this.utils.completarCaracter(veiculoAtual.precoServico(servico).toFixed(2).replace('.', ','), configuracao.Recibo.CaractersImpressao - servico.Nome.substr(0, configuracao.Recibo.CaractersImpressao - 12).length));
        this.bluetoothSerial.write(this.CMD.EOL);  
      })
      veiculoAtual.Produtos.forEach(produto => {
        this.bluetoothSerial.write(produto.Nome.substr(0, configuracao.Recibo.CaractersImpressao - 12));
        this.bluetoothSerial.write(this.utils.completarCaracter(produto.precoFinal.toFixed(2).replace('.', ','), configuracao.Recibo.CaractersImpressao - produto.Nome.substr(0, configuracao.Recibo.CaractersImpressao - 12).length));
        this.bluetoothSerial.write(this.CMD.EOL);  
      });
    })
    this.bluetoothSerial.write(this.utils.completarCaracter('', configuracao.Recibo.CaractersImpressao, '-'));
    this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_BOLD_ON);
    this.bluetoothSerial.write('TOTAL');
    this.bluetoothSerial.write(this.utils.completarCaracter(movimento.Total.toFixed(2).replace('.', ','), configuracao.Recibo.CaractersImpressao - 'TOTAL'.length));
    this.bluetoothSerial.write(this.CMD.EOL);
    this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_BOLD_OFF);
    this.bluetoothSerial.write(this.utils.completarCaracter('', configuracao.Recibo.CaractersImpressao, '-'));
    this.bluetoothSerial.write(this.CMD.EOL);    
    this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_NORMAL);

    // Se for registro de pendência cria a assinatura do cliente
    if (pendente) {
      this.bluetoothSerial.write('Declaro que o débito acima descrito é procedente e me comprometo a realizar a quitação do mesmo.');
      this.bluetoothSerial.write(this.CMD.EOL);    
      this.bluetoothSerial.write(this.CMD.EOL);    
      this.bluetoothSerial.write(this.CMD.EOL);    
      this.bluetoothSerial.write(this.utils.completarCaracter('', configuracao.Recibo.CaractersImpressao, '_'));
      this.bluetoothSerial.write(this.CMD.EOL);    
      this.bluetoothSerial.write(movimento.Veiculos[0].Nome != null && movimento.Veiculos[0].Nome.length ? movimento.Veiculos[0].Nome : 'Nome:');
      this.bluetoothSerial.write(this.CMD.EOL);    
      this.bluetoothSerial.write('Doc:');
      this.bluetoothSerial.write(this.CMD.EOL);    
      this.bluetoothSerial.write(this.CMD.EOL);    
    }

    this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_BOLD_ON);
    this.bluetoothSerial.write(this.CMD.TEXT_FORMAT.TXT_ALIGN_CT);
    if (configuracao.Recibo.ExibirTelefoneRodape && configuracao.Estabelecimento.Telefone != null && configuracao.Estabelecimento.Telefone.length) {
      this.bluetoothSerial.write('FALE CONOSCO ' + this.utils.formatarTelefone(configuracao.Estabelecimento.Telefone));
      this.bluetoothSerial.write(this.CMD.EOL);
    }
    if (configuracao.Recibo.MensagemReciboEntrada != null && configuracao.Recibo.MensagemReciboEntrada.length) {
      this.bluetoothSerial.write(configuracao.Recibo.MensagemReciboSaida);
    }
    this.bluetoothSerial.write(this.CMD.FEED_CONTROL_SEQUENCES.CTL_LF);
    this.bluetoothSerial.write(this.CMD.FEED_CONTROL_SEQUENCES.CTL_LF);
    this.bluetoothSerial.write(this.CMD.FEED_CONTROL_SEQUENCES.CTL_LF);
  }

  async validarConexao() {
    return await this.bluetoothSerial.isConnected()
    .then(() => {
      return true
    })
    .catch((erro) => {
      return false
    })
  }
}