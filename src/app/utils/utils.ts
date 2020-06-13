import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { DatePicker } from '@ionic-native/date-picker/ngx';

@Injectable({
    providedIn: 'root'
  })
  
export class Utils {

  constructor (
    private alertCtrl: AlertController,
    public toastController: ToastController,
    private datePicker: DatePicker
  ) { }

  async alerta(titulo, mensagem) {
      const alert = await this.alertCtrl.create({
      message: mensagem,
      subHeader: titulo,
      buttons: ['Ok']
      });
      await alert.present(); 
  }

  async mostrarToast(mensagem, cor, tempo = 2000) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: tempo,
      color: cor
    });
    toast.present();
  }

  stringPura(texto) {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toUpperCase();
  }

  completarZeros(numero, tamanho) {
    var s = "000000000" + numero;
    return s.substr(s.length-tamanho);
  }

  completarCaracter(texto, tamanho, caracter = ' ') {
    let textoFormatado = texto
    for (let i = 1; i <= tamanho - texto.length; i++) {
      textoFormatado = caracter + textoFormatado
    }
    return textoFormatado
  }

  selecionarData(data = null) {
    return this.datePicker.show({
      date: data ? data : new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT
    })
  }  

  selecionarHora(hora = null) {
    return this.datePicker.show({      
      date: hora ? hora : new Date(),
      mode: 'time',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT
    })
  }  
}
