import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { Injectable } from '@angular/core';
import { ServiceBaseService } from './service-base.service';
import { LoadingController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Utils } from '../utils/utils';

@Injectable({
  providedIn: 'root'
})
export class BluetoothService extends ServiceBaseService {

  public onDefinirDispositivo: BehaviorSubject<any> = new BehaviorSubject(null);
  falhaImpressao = null

  private readonly alinhar_centro = '\x1B\x61\x01';
  private readonly alinhar_esquerda   = '\x1B\x61\x00'; 
  private readonly font_grande   = '\x08'; 
  private readonly font_normal   = '\x01'; 
  private readonly quebra_linha = '\n'

  constructor(
    private bluetoothSerial: BluetoothSerial,
    public loadingController: LoadingController,
    private utils: Utils
  ) { 
    super(loadingController)
    // Tenta iniciar a conexão com a impressora se o bluetooth estiver ligado
    bluetoothSerial.isEnabled().then(() => {
      // Verifica se existe uma conexão salva e tenta conectar
      if (this.dispositivoSalvo != null) {
        this.bluetoothSerial.connect(this.dispositivoSalvo.id)
        .subscribe(() => {},
        (erro) => {
          // Verifica se a conexão salva existe na lista de dispositivos pareados
          this.listaDispositivosPareados().then((lista) => {
            let dispositivoLocalizado = lista.find(itemAtual => itemAtual.id === this.dispositivoSalvo.id)
            // Cancela a conexão salva se não existir
            if (dispositivoLocalizado == null) 
              localStorage.removeItem('impressoraConectada')
          })
          this.utils.mostrarToast('Não foi possível conectar a impressora configurada', 'warning')
        })  
      }
    })
  }

  get dispositivoSalvo(): any {
    return JSON.parse(localStorage.getItem('impressoraConectada'))
  }

  desconectar(): Promise<boolean> {
    return this.bluetoothSerial.disconnect().then(() => {
      localStorage.removeItem('impressoraConectada')
      this.onDefinirDispositivo.next(null)
      return true
    })
    .catch(() => {
      return false
    })
  }

  public conectarDispositivo(dispositivo) {
    this.bluetoothSerial.isConnected().then((retorno) => {
      this.ocultarProcessamento()
      this.utils.mostrarToast('Já existe um dispositivo conectado', 'warning')
    })
    .catch((erro) => {
      this.bluetoothSerial.connect(dispositivo.id).subscribe((retorno) => {
        this.ocultarProcessamento()
        localStorage.setItem('impressoraConectada', JSON.stringify(dispositivo))
        this.onDefinirDispositivo.next(dispositivo)

        // Verifica se houve uma falha na impressão para tentar reimprimir
        if (this.falhaImpressao != null) {
          // Se houve sucesso na conexão faz a impressão
          if (dispositivo != null) 
            this.falhaImpressao.Operacao == 'saida' ? this.imprimirReciboSaida(this.falhaImpressao.Veiculo) : this.imprimirReciboEntrada(this.falhaImpressao.Veiculo)
          else 
            this.utils.mostrarToast('Houve uma falha na tentativa de impressão. Verifique sua impressora.', 'warning')
        }
        // Limpa o registro de falha, pois só tenta reimprimir uma vez
        this.falhaImpressao = null
      },
      (erro) => {
        this.ocultarProcessamento()
        this.utils.mostrarToast('Houve uma falha na tentativa de impressão. Verifique sua impressora.', 'warning')
        this.onDefinirDispositivo.next(null)
      })  
    })
  }

  listaDispositivosPareados() {
    return this.bluetoothSerial.list()
  }

  qrCode(valor) {
    var qr_model       = '\x32';          // 31 or 32
    var qr_eclevel     = '\x33';          // error correction level (30, 31, 32, 33 - higher)
    var qr_pL          = String.fromCharCode((valor.length + 3) % 256);
    var qr_pH          = String.fromCharCode((valor.length + 3) / 256);

    let texto = this.alinhar_centro +
    '\x1D\x28\x6B\x04\x00\x31\x41' + qr_model + '\x00' +        // Select the model
    '\x1D\x28\x6B\x03\x00\x31\x43' + this.font_grande +                  // Size of the model
    '\x1D\x28\x6B\x03\x00\x31\x45' + qr_eclevel +               // Set n for error correction
    '\x1D\x28\x6B' + qr_pL + qr_pH + '\x31\x50\x30' + valor +   // Store data
    '\x1D\x28\x6B\x03\x00\x31\x51\x30'                         // Print

    return texto
  }

  imprimirRecibo(veiculo, operacao = 'entrada') {
    // Trata a impressão do recibo
    if (this.dispositivoSalvo != null) {      
      this.validarConexao().then((conexao) => {
        if (conexao) {
          this.ocultarProcessamento()
          operacao == 'entrada' ? this.imprimirReciboEntrada(veiculo) : this.imprimirReciboSaida
        }
        else {
          this.falhaImpressao = {Operacao: operacao, Veiculo: veiculo}
          // Tenta conectar novamente para imprimir se conseguir
          // Veja onDefinirDispositivo no construtor
          // Aguarda 5 segundos para que o usuário possa visualizar a mensagem de sucesso no registro
          setTimeout(() => { this.conectarDispositivo(this.dispositivoSalvo) }, 2000);
        }
      })
      .catch(() => {
        this.ocultarProcessamento()
        this.utils.mostrarToast('Ocorreu um erro inesperado. Tente novamente.', 'danger')
      })
    }
    else {
      this.utils.mostrarToast('Nenhum dispositivo conectado.', 'danger')
    }
  }

  quebraLinha(quantidade) {
    let quebras = ''
    for (let i=1; i++; i<=quantidade) 
      quebras += this.quebra_linha
  }

  testarImpressora() {

  }

  imprimirReciboEntrada(veiculo) {
    this.bluetoothSerial.write(this.alinhar_centro + this.font_grande + veiculo.Placa + '\n');
    this.bluetoothSerial.write(this.qrCode(veiculo.Placa));
    this.bluetoothSerial.write('Fim do recibo' + '\n');
/*    this.bluetoothSerial.write(this.alinhar_centro + this.font_grande + 'MINHA EMPRESA' + this.quebraLinha(2) + this.alinhar_esquerda);
    this.bluetoothSerial.write(this.alinhar_esquerda + this.qrCode('função'));
    this.bluetoothSerial.write(this.alinhar_esquerda + 'Final do recibo');
    this.bluetoothSerial.write(this.alinhar_esquerda + this.quebraLinha(2) + 'Final do recibo');*/
  }

  imprimirReciboSaida(veiculo) {
    this.bluetoothSerial.write(this.qrCode(veiculo.Placa));
    this.bluetoothSerial.write(veiculo.Placa + '\n');
  }

  async validarConexao(): Promise<any> {
    return this.bluetoothSerial.isConnected()
    .then(() => {
      return true
    })
    .catch((erro) => {
      return false
    })
  }
}