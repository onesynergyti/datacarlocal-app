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

  constructor(
    private bluetoothSerial: BluetoothSerial,
    public loadingController: LoadingController,
    private utils: Utils
  ) { 
    super(loadingController)
    bluetoothSerial.enable();
    // Verifica se existe uma conexão salva e tenta conectar
    if (this.dispositivoSalvo != null) {
      this.bluetoothSerial.connect(this.dispositivoSalvo.id)
      .subscribe(() => {},
      () => {
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
      alert('Já existe um dispositivo conectado')
    })
    .catch((erro) => {
      this.bluetoothSerial.connect(dispositivo.id).subscribe((retorno) => {
        this.ocultarProcessamento()
        localStorage.setItem('impressoraConectada', JSON.stringify(dispositivo))
        this.onDefinirDispositivo.next(dispositivo)
      },
      (erro) => {
        this.onDefinirDispositivo.next(null)
        this.ocultarProcessamento()
      })  
    })
  }

  listaDispositivosPareados() {
    return this.bluetoothSerial.list()
  }

  qrCode(valor) {
    var justify_center = '\x1B\x61\x01';
    var justify_left   = '\x1B\x61\x00';
    var qr_model       = '\x32';          // 31 or 32
    var qr_size        = '\x08';          // size
    var qr_eclevel     = '\x33';          // error correction level (30, 31, 32, 33 - higher)
    var qr_pL          = String.fromCharCode((valor.length + 3) % 256);
    var qr_pH          = String.fromCharCode((valor.length + 3) / 256);

    let texto = justify_center +
    '\x1D\x28\x6B\x04\x00\x31\x41' + qr_model + '\x00' +        // Select the model
    '\x1D\x28\x6B\x03\x00\x31\x43' + qr_size +                  // Size of the model
    '\x1D\x28\x6B\x03\x00\x31\x45' + qr_eclevel +               // Set n for error correction
    '\x1D\x28\x6B' + qr_pL + qr_pH + '\x31\x50\x30' + valor +   // Store data
    '\x1D\x28\x6B\x03\x00\x31\x51\x30' +                        // Print
    '\n\n\n' +
    justify_left 

    return texto
  }

  testarImpressora() {    
    this.bluetoothSerial.isConnected().then(() => {
      this.bluetoothSerial.write(this.qrCode('função'));
      this.bluetoothSerial.write('Teste de texto\n');
    })
  }

  imprimirReciboEntrada(veiculo) {
    this.bluetoothSerial.write(this.qrCode(veiculo.Placa));
    this.bluetoothSerial.write(veiculo.Placa + '\n');
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
