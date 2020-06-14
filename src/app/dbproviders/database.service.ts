import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform, LoadingController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { ServiceBaseService } from '../services/service-base.service';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService extends ServiceBaseService {

  constructor(
    public loadingController: LoadingController,
    private sqlite: SQLite,
  ) { 
    super(loadingController)
  }  

  public criarTabelas(db: SQLiteObject) {
    
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        let promisesTx = []
        promisesTx.push(new Promise((resolve, reject) => { tx.executeSql('CREATE TABLE IF NOT EXISTS servicos (Id integer primary key AUTOINCREMENT NOT NULL, Nome TEXT NOT NULL, PrecoMoto REAL, PrecoVeiculoPequeno REAL, PrecoVeiculoMedio REAL, PrecoVeiculoGrande REAL)', [], () => resolve(), (erro) => reject(erro))} ))
        promisesTx.push(new Promise((resolve, reject) => { tx.executeSql('CREATE TABLE IF NOT EXISTS veiculos (Placa TEXT primary key NOT NULL, Modelo TEXT, TipoVeiculo integer NOT NULL, Entrada DATE NOT NULL, Telefone TEXT, Nome TEXT, Observacoes TEXT, Servicos TEXT, EntregaAgendada integer, PrevisaoEntrega Date)', [], () => resolve(), (erro) => reject(erro))} ))
        promisesTx.push(new Promise((resolve, reject) => { tx.executeSql('CREATE TABLE IF NOT EXISTS movimentos (Id integer primary key AUTOINCREMENT NOT NULL, Data DATE, Descricao TEXT, ValorDinheiro REAL, ValorDebito REAL, ValorCredito REAL, Veiculo TEXT)', [], () => resolve(), (erro) => reject(erro))} ))
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
