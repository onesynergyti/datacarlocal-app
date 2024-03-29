import { Component, OnInit } from '@angular/core';
import { Produto } from 'src/app/models/produto';
import { ModalController, NavParams } from '@ionic/angular';
import { ProdutosService } from 'src/app/dbproviders/produtos.service';
import { Utils } from 'src/app/utils/utils';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@Component({
  selector: 'app-cadastro-produto',
  templateUrl: './cadastro-produto.page.html',
  styleUrls: ['./cadastro-produto.page.scss'],
})
export class CadastroProdutoPage implements OnInit {
  
  produto: Produto
  inclusao: boolean
  avaliouFormulario = false

  constructor(
    private modalController: ModalController,
    private providerProduto: ProdutosService,
    public navParams: NavParams,
    public utils: Utils,
    private barcodeScanner: BarcodeScanner
  ) { 
    this.produto = navParams.get('produto')
    this.inclusao = navParams.get('inclusao')
  }

  ngOnInit() {
  }

  cancelar() {
    this.modalController.dismiss()
  }

  async concluir(operacao = 'cadastro') {
    if (operacao != 'cadastro') {
      this.modalController.dismiss({ Operacao: operacao, Produto: this.produto })
    }
    else {
      this.avaliouFormulario = true

      if (this.produto.Nome != null && this.produto.Nome.length) {
        await this.providerProduto.exibirProcessamento('Salvando produto...')
        this.providerProduto.salvar(this.produto)
        .then(() => {
          this.modalController.dismiss({ Operacao: operacao, Produto: this.produto })
        })
        .catch(() => {
          alert('Não foi possível salvar o produto')
        })
      }      
    }
  }

  async leituraCodigo() {
    const options = {
      prompt : "Se não possuir um código de barras informe manualmente.",

    }
    this.barcodeScanner.scan(options).then(barcodeData => {      
      if (barcodeData.text != '') {
        this.produto.Codigo = barcodeData.text
      }
    })
  }
}