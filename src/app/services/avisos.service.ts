import { Injectable } from '@angular/core';
import { Aviso } from '../models/aviso';
import { GlobalService } from './global.service';
import { ProdutosService } from '../dbproviders/produtos.service';
import { ConfiguracoesService } from './configuracoes.service';
import { Configuracoes } from '../models/configuracoes';
import { ComprasService } from './compras.service';

@Injectable({
  providedIn: 'root'
})
export class AvisosService {

  private _avisos: Aviso[]
  private _produtosAlerta
  private _tipoAvisoErroSincronizacao = 1;
  private _tipoAvisoProdutoBaixoEstoque = 2;
  private _tipoAvisoEntregaAtraso = 3;
  
  constructor(
    private globalService: GlobalService,
    private providerProdutos: ProdutosService,
    private configuracoesService: ConfiguracoesService,
    private comprasService: ComprasService
  ) {     
    this.globalService.onRealizarVenda.subscribe(() => {
      this.providerProdutos.produtosAlerta().then(quantidade => { 
        this._produtosAlerta = quantidade
        if (quantidade > 0) {
          let aviso = new Aviso()
          aviso.Titulo = 'Estoque baixo'
          aviso.Descricao = 'Existem produtos que devem ser verificados no seu estoque.'
          aviso.Tipo = this._tipoAvisoProdutoBaixoEstoque
          this.inserirAviso(aviso)
        }
        else {
          this.excluirTipoAviso(this._tipoAvisoProdutoBaixoEstoque)
        }
      })
    })
    this.globalService.onAlterarProduto.subscribe(() => {
      this.providerProdutos.produtosAlerta().then(quantidade => { 
        this._produtosAlerta = quantidade
        if (quantidade > 0) {
          let aviso = new Aviso()
          aviso.Titulo = 'Estoque baixo'
          aviso.Descricao = 'Existem produtos que devem ser verificados no seu estoque.'
          aviso.Tipo = this._tipoAvisoProdutoBaixoEstoque
          this.inserirAviso(aviso)
        }
        else {
          this.excluirTipoAviso(this._tipoAvisoProdutoBaixoEstoque)
        }
      })
    })

    this.globalService.onErroSincronizacao.subscribe((erro) => {
      if (erro != null) {
        // Exclui o tipo de aviso para atualizar o erro
        this.excluirTipoAviso(this._tipoAvisoErroSincronizacao)
        let aviso = new Aviso()
        aviso.Titulo = 'Falha na sincronização'
        aviso.Descricao = erro
        aviso.Tipo = this._tipoAvisoErroSincronizacao
        this.inserirAviso(aviso)
      }
    })

    this.globalService.onFinalizarSincronizacao.subscribe((sucesso) => {
      if (sucesso != null) {
        this.excluirTipoAviso(this._tipoAvisoErroSincronizacao)
      }
    })

    const avisos = localStorage.getItem('avisos')
    if (avisos != null)
      this._avisos = JSON.parse(avisos)
    else
      this._avisos = []
  }

  get quantidadeMenuAlerta() {
    return this._produtosAlerta
  }

  get avisos(): Aviso[] {
    return this._avisos
  }

  inserirAviso(aviso: Aviso) {
    // Insere apenas se não houver um aviso do mesmo tipo ou se for de um tipo genérico
    if (aviso.Tipo == 0 || this.avisos.find(itemAtual => itemAtual.Tipo == aviso.Tipo) == null) {
      // Calcula um Id para o aviso
      if (aviso.Id == 0) {
        // Obtem um id do tempo atual com milisegundos
        aviso.Id = new Date().getTime()
        // Se houve um igual, cria outro - Caso quase impossível, mas...
        while (this.avisos.find(itemAtual => itemAtual.Id == aviso.Id)) {
          aviso.Id = new Date().getTime()
        }
      }

      this._avisos.push(aviso)
      localStorage.setItem('avisos', JSON.stringify(this._avisos))
    }
  }

  excluirAviso(id) {
    const index = this._avisos.findIndex(itemAtual => itemAtual.Id == id)
    if (index >= 0) 
    this._avisos.splice(index, 1)
      localStorage.setItem('avisos', JSON.stringify(this._avisos))
  }

  excluirTipoAviso(tipo) {
    const index = this._avisos.findIndex(itemAtual => itemAtual.Tipo == tipo)
    if (index >= 0) 
      this._avisos.splice(index, 1)
    localStorage.setItem('avisos', JSON.stringify(this._avisos))
  }

  get possuiErroEnvio() {
    return this._avisos.findIndex(itemAtual => itemAtual.Tipo == this._tipoAvisoErroSincronizacao)
  }
}
