import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
  })
  
export class Utils {

    constructor (
      private alertCtrl: AlertController,
      public toastController: ToastController
    ) { }

    async alerta(titulo, mensagem) {
        const alert = await this.alertCtrl.create({
        message: mensagem,
        subHeader: titulo,
        buttons: ['Ok']
       });
       await alert.present(); 
    }

    async mostrarToast(mensagem, cor) {
      const toast = await this.toastController.create({
        message: mensagem,
        duration: 2000,
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
}
