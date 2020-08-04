import { Component, OnInit } from '@angular/core';
import { ProdutoVeiculo } from 'src/app/models/produto-veiculo';
import { ModalController, NavParams } from '@ionic/angular';
import { ProdutosService } from 'src/app/dbproviders/produtos.service';
import { ConfiguracoesService } from 'src/app/services/configuracoes.service';
import { Utils } from 'src/app/utils/utils';
import { SelectPopupModalPage } from 'src/app/components/select-popup-modal/select-popup-modal.page';
import { ValidarAcessoPage } from 'src/app/pages/validar-acesso/validar-acesso.page';

@Component({
  selector: 'app-cadastro-produto',
  templateUrl: './cadastro-produto.page.html',
  styleUrls: ['./cadastro-produto.page.scss'],
})
export class CadastroProdutoPage implements OnInit {

  produtoVeiculo: ProdutoVeiculo
  inclusao
  avaliouFormulario = false

  constructor(
    private modalCtrl: ModalController,
    private produtosProvider: ProdutosService,
    public navParams: NavParams,
    public configuracoesService: ConfiguracoesService,
    public utils: Utils
    
  ) { 
    this.inclusao = navParams.get('inclusao')
    this.produtoVeiculo = navParams.get('produtoVeiculo')
    // O produto deve ser selecionado
    if (this.produtoVeiculo == null)
      this.selecionarProduto()
  }

  ngOnInit() {
  }

  async selecionarProduto() {
    const modal = await this.modalCtrl.create({
      component: SelectPopupModalPage,
      componentProps: {
        'classe': 'produto',
        'keyField': 'Nome',
        'titulo': 'Produtos',
        'icone': 'barcode'
      }
    })

    modal.onWillDismiss().then((retorno) => {
      let produto = retorno.data
      if (produto != null) {
        this.produtoVeiculo = new ProdutoVeiculo()
        this.produtoVeiculo.Id = produto.Id
        this.produtoVeiculo.Nome = produto.Nome
        this.produtoVeiculo.Preco = produto.Preco
      }
      else if (this.produtoVeiculo == null) // A seleção de um produto é obrigatória
        this.cancelarOperacao()
    })

    return await modal.present(); 
  }
  
  cancelar() {
    this.fechar()
  }

  async cancelarOperacao() {
    await this.produtosProvider.exibirProcessamento('Atualizando produtos...')
    setTimeout(() => {
      this.produtosProvider.ocultarProcessamento()
      this.cancelar()
    }, 500);
  }

  async fechar(retorno = null) {    
    await this.produtosProvider.exibirProcessamento('Atualizando produtos...')
    setTimeout(() => {
      this.produtosProvider.ocultarProcessamento()
      this.modalCtrl.dismiss(retorno)
    }, 200);
  }

  async concluir() {
    this.avaliouFormulario = true

    if (this.produtoVeiculo.precoFinal >= 0) {
      // Verifica permissão para conceder desconto
      if (!this.configuracoesService.configuracoes.Seguranca.ExigirSenhaConcederDesconto || this.produtoVeiculo.Desconto == 0)
        this.modalCtrl.dismiss({ Operacao: 'cadastro', ProdutoVeiculo: this.produtoVeiculo})
      else {
        const modal = await this.modalCtrl.create({
          component: ValidarAcessoPage,
          componentProps: {
            'mensagem': 'Informe a senha de administrador para concessão de desconto.'
          }  
        });
    
        modal.onWillDismiss().then((retorno) => {
          if (retorno.data == true)
            this.fechar({ Operacao: 'cadastro', ProdutoVeiculo: this.produtoVeiculo})
        })
    
        return await modal.present(); 
      }
    }
  }

  excluir() {
    this.modalCtrl.dismiss({ Operacao: 'excluir', ProdutoVeiculo: this.produtoVeiculo})
  }
}
