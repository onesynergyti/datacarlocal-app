import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(
    private sqlite: SQLite,
  ) { }  

  public criarTabelas(db: SQLiteObject) {
    
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        let promisesTx = []
        promisesTx.push(new Promise((resolve, reject) => { tx.executeSql('CREATE TABLE IF NOT EXISTS servicos (Id integer primary key AUTOINCREMENT NOT NULL, Nome TEXT NOT NULL, PrecoMoto REAL, PrecoVeiculoPequeno REAL, PrecoVeiculoMedio REAL, PrecoVeiculoGrande REAL)', [], () => resolve(), (erro) => reject(erro))} ))
        promisesTx.push(new Promise((resolve, reject) => { tx.executeSql('CREATE TABLE IF NOT EXISTS veiculos (Placa TEXT primary key NOT NULL, Modelo TEXT, TipoVeiculo integer NOT NULL, Entrada DATE NOT NULL, Observacoes TEXT, Servicos TEXT)', [], () => resolve(), (erro) => reject(erro))} ))
        promisesTx.push(new Promise((resolve, reject) => { tx.executeSql('CREATE TABLE IF NOT EXISTS movimentos (Id integer primary key AUTOINCREMENT NOT NULL, Data DATE, Descricao TEXT, Valor REAL, TipoVeiculo integer, FormaPagamento integer, Veiculo TEXT)', [], () => resolve(), (erro) => reject(erro))} ))
        promisesTx.push(new Promise((resolve, reject) => { tx.executeSql('CREATE TABLE IF NOT EXISTS movimentosServicos (IdMovimento integer NOT NULL, IdServico integer NOT NULL, Nome TEXT NOT NULL, Valor REAL NOT NULL, PRIMARY KEY (IdMovimento, IdServico))', [], () => resolve(), (erro) => reject(erro))} ))
        promisesTx.push(new Promise((resolve, reject) => { tx.executeSql('CREATE TABLE IF NOT EXISTS mensalistas (Id integer primary key AUTOINCREMENT NOT NULL, Nome TEXT, Valor REAL, UltimoPagamento DATE, DiaVencimento integer)', [], () => resolve(), (erro) => reject(erro))} ))

        // Após a criação das tabelas, cria os índices necessários
        Promise.all(promisesTx)
        .then(() => {
          resolve()
        })
        .catch((erro) => {
          reject(erro)
        })
      })
    })
  }

  async obterValor(sql, db: SQLiteObject) {
    await db.executeSql(sql, []).then(linhas => {
      return linhas[0].valor
    })
  }

  get DB() {
    return this.sqlite.create({
      name: 'app.db',
      location: 'default'
    })
  }  
}
