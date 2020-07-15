import { Component, OnInit } from '@angular/core';
import { BluetoothService } from 'src/app/services/bluetooth.service';
import { Utils } from 'src/app/utils/utils';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';

@Component({
  selector: 'app-impressora',
  templateUrl: './impressora.page.html',
  styleUrls: ['./impressora.page.scss'],
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
export class ImpressoraPage implements OnInit {

  dispositivos = []
  dispositivoConectado = null
  carregandoDispositivos = false

  constructor(
    public bluetooth: BluetoothService,
    private utils: Utils
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.dispositivoConectado = this.bluetooth.dispositivoSalvo
    this.atualizarLista()
  }

  atualizarLista() {
    this.carregandoDispositivos = true
    this.dispositivos = []
    this.bluetooth.listaDispositivosPareados()
    .then(dispositivos => {
      this.dispositivos = dispositivos
    })
    .finally(() => {
      this.carregandoDispositivos = false
    })
  }

  async selecionarDispositivo(dispositivo) {
    await this.bluetooth.exibirProcessamento('Conectando dispositivo...')
    const idDispositivoAtual = this.bluetooth.dispositivoSalvo == null ? 0 : this.bluetooth.dispositivoSalvo.id    
    this.bluetooth.desconectar().then(() => {
      this.dispositivoConectado = null

      if (dispositivo.id != idDispositivoAtual) {
        this.bluetooth.conectarDispositivo(dispositivo).then(() => {
          this.dispositivoConectado = dispositivo
        })
      }
      else {
        this.bluetooth.ocultarProcessamento()
      }
    })
    .catch(() => {
      this.bluetooth.ocultarProcessamento()
      this.dispositivoConectado = null
    })
  }

  async testarImpressora() {
    await this.bluetooth.exibirProcessamento('Comunicando com a impressora...')
    this.bluetooth.imprimirRecibo(null, 'teste')
  }
}
