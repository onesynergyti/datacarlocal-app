import { Injectable } from '@angular/core';
import { ModalController, AlertController, ToastController } from '@ionic/angular';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { environment } from 'src/environments/environment';
import { SqlClientComponent } from 'src/app/pages/sql-client/sql-client.component';

@Injectable({
    providedIn: 'root'
  })
  
export class Utils {

  production = false

  constructor (
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    public toastController: ToastController,
    private datePicker: DatePicker
  ) { 
    this.production = environment.production
  }

  async abrirSqlClient() {
    const modal = await this.modalCtrl.create({
      component: SqlClientComponent});
    return await modal.present();
  }

  alertLog(mensagem) {
    if (environment.AlertDebug)
      alert(mensagem)
  }

  abrirWhatsapp(celular, mensagem = '') {
    celular = celular.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
    window.location.href=`https://api.whatsapp.com/send?phone=55${celular}&text=${mensagem.replace(' ', '%20')}`;
  }

  abrirPlayListReuz() {  
    window.location.href='https://www.youtube.com/playlist?list=PLSBIkb0_POjdrvunUn_58mDJE8aFhNgJT';
  }

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
    return texto.toUpperCase().replace(/[^a-zA-Z0-9]/g,'')
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

  formatarDocumento(value: string): string {      
    if (value != null && value.length >= 14)
      return value.substring(0, 2) + '.' + value.substring(2, 5) + '.' + value.substring(5, 8) + '/' + value.substring(8, 12) + '-' + value.substring(12)
    else if (value != null && value.length >= 11)
      return value.substring(0, 3) + '.' + value.substring(3, 6) + '.' + value.substring(6, 9) + '-' + value.substring(9)
    else
      return value
  }

  formatarPlaca(value: string): string {
    if (value != null) {
      if (value.length >= 4)
        return value.substring(0, 3) + '-' + value.substring(3)
      else
        return value
    }
    else
      return value
  }

  formatarTelefone(value) {
    if (value != null) {
      if (value.length >= 11)
        return '(' + value.substring(0, 2) + ') ' + value.substring(2, 7) + '-' + value.substring(7)
      else if (value.length >= 7)
        return '(' + value.substring(0, 2) + ') ' + value.substring(2, 6) + '-' + value.substring(6)
      else if (value.length >= 3)
        return '(' + value.substring(0, 2) + ') ' + value.substring(2)
      else
        return value
    }
    else
      return value
  }

  emailValido(email, permiteNulo = true) {
    const regex = /\S+@\S+\.\S+/;
    return (permiteNulo && email == null) || regex.test(email)
  }

  telefoneValido(telefone, permiteNulo = true) {
    return (permiteNulo && telefone == null) || [0, 10, 11].includes(telefone.length)
  }

  selecionarData(data = null) {
    return this.datePicker.show({
      date: data ? data : new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT,
      doneButtonLabel: 'Ok',
      cancelButtonLabel : 'Cancelar',
      locale: 'pt_br'
    })
  }  

  selecionarHora(hora = null) {
    return this.datePicker.show({      
      date: hora ? hora : new Date(),
      mode: 'time',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT,
      doneButtonLabel: 'Ok',
      cancelButtonLabel : 'Cancelar',
      locale: 'pt_br'
    })
  }  

  somenteNumeros(valor: string) {
    return valor.toString().replace(/\D/g, "")
  }

  trataCampoNumero(valor: number) {    
    const numeros = valor.toString().replace(/\D/g, "")
    return Number(numeros) / 100
  }
}
