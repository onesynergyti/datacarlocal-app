import { Component, OnInit } from '@angular/core';
import { BluetoothService } from 'src/app/services/bluetooth.service';
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'app-impressora',
  templateUrl: './impressora.page.html',
  styleUrls: ['./impressora.page.scss'],
})
export class ImpressoraPage implements OnInit {

  dispositivos = []
  dispositivoConectado = null

  constructor(
    public bluetooth: BluetoothService,
    private utils: Utils
  ) { 
    this.bluetooth.onDefinirDispositivo.subscribe((dispositivo) => {
      this.dispositivoConectado = dispositivo
    })
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.dispositivos = []
    this.bluetooth.listaDispositivosPareados()
    .then(dispositivos => {
      this.dispositivos = dispositivos
    })

    // Verifica o dispositivo conectado
    if (this.bluetooth.dispositivoSalvo != null) {
      this.bluetooth.validarConexao().then((retorno) => {
        this.dispositivoConectado = retorno ? this.bluetooth.dispositivoSalvo : null
      })
    }
  }

  async selecionarDispositivo(dispositivo) {
    await this.bluetooth.exibirProcessamento('Conectando dispositivo...')
    const idDispositivoAtual = this.bluetooth.dispositivoSalvo == null ? 0 : this.bluetooth.dispositivoSalvo.id    
    this.bluetooth.desconectar().then((retorno) => {
      if (retorno) {
        if (dispositivo.id != idDispositivoAtual) {
          this.bluetooth.conectarDispositivo(dispositivo)
        }
        else {
          this.bluetooth.ocultarProcessamento()
        }
      }
    })
  }

  testarImpressora() {
    this.bluetooth.testarImpressora()
  }

}
