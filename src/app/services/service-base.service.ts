import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ServiceBaseService {

  private loading

  constructor(
    public loadingController: LoadingController
  ) { }

  public async exibirProcessamento(mensagem) {
    this.loading = await this.loadingController.create({
      message: mensagem,
    });
    await this.loading.present()
  }

  public ocultarProcessamento() {
    if (this.loading != null) {
      this.loading.dismiss()
      this.loading = null
    }
  }
}
