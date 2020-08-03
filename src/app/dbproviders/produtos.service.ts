import { Injectable } from '@angular/core';
import { ServiceBaseService } from '../services/service-base.service';
import { LoadingController } from '@ionic/angular';
import { Utils } from '../utils/utils';
import { DatabaseService } from './database.service';
import { ConfiguracoesService } from '../services/configuracoes.service';
import { Produto } from '../models/produto';

@Injectable({
  providedIn: 'root'
})
export class ProdutosService extends ServiceBaseService {

  constructor(
    public loadingController: LoadingController,
    private utils: Utils,
    private database: DatabaseService,
    private configuracoesService: ConfiguracoesService
  ) { 
    super(loadingController)
  }

  public excluir(id) {
    return new Promise((resolve, reject) => { 
      this.database.DB.then(db => { 
        let sql = 'delete from produtos where Id = ?';
        let data = [id];
        db.executeSql(sql, data).then(() => {
          resolve()
        })
        .catch(erro => {
          reject(erro)
        })
      })
      .finally(() => {
        this.ocultarProcessamento()
      })
    })
  }

  public salvar(produto: Produto) {
    let sql
    let data

    // Caso seja inclusão
    if (produto.Id == null || produto.Id == 0) {
      sql = 'insert into produtos (Nome, Preco, EstoqueAtual, EstoqueMinimo, Codigo) values (?, ?, ?, ?, ?)';
      data = [produto.Nome, produto.Preco, produto.EstoqueAtual, produto.EstoqueMinimo, produto.Codigo];
    }
    // Caso seja edição
    else {
      sql = 'update produtos set Nome = ?, Preco = ?, EstoqueAtual = ?, EstoqueMinimo = ?, Codigo = ? where Id = ?';
      data = [produto.Nome, produto.Preco, produto.EstoqueAtual, produto.EstoqueMinimo, produto.Codigo, produto.Id];
    }

    return new Promise((resolve, reject) => {
      this.database.DB.then(db => {
        db.executeSql(sql, data)
        .then((row: any) => {
          if (!produto.Id) 
            produto.Id = row.insertId
          resolve(produto)
        })
        .catch((erro) => {
          reject(erro)
        })
      })
      .finally(() =>{
        this.ocultarProcessamento() 
      })
    })
  }

  public lista(): Promise<any> {
    return new Promise((resolve, reject) => {
      let sql = 'SELECT * from produtos';
      this.database.DB.then(db => {
        db.executeSql(sql, [])
        .then(data => {
          let produtos: any[] = []

          for (var i = 0; i < data.rows.length; i++) {
            var produto = data.rows.item(i);
            produtos.push(produto);
          }

          resolve(produtos)
        })
        .catch((erro) => {
          reject(erro)
        })
      })
      .catch((erro) => {
        reject(erro)
      })
      .finally(() => {
        this.ocultarProcessamento()
      })
    })
  }
}