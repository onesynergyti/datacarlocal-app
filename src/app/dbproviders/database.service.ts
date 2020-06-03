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

  public async criarTabelas(db: SQLiteObject) {
    await db.executeSql('CREATE TABLE IF NOT EXISTS servicos (Id integer primary key AUTOINCREMENT NOT NULL, Nome TEXT, PrecoMoto REAL, PrecoVeiculoPequeno REAL, PrecoVeiculoMedio REAL, PrecoVeiculoGrande REAL)')
    await db.executeSql('CREATE TABLE IF NOT EXISTS veiculos (Placa TEXT primary key NOT NULL, Modelo TEXT, TipoVeiculo integer, Entrada DATE, Observacoes TEXT, Servicos TEXT)')
    await db.executeSql('CREATE TABLE IF NOT EXISTS movimentos (Id integer primary key AUTOINCREMENT NOT NULL, Data DATE, Descricao TEXT, Valor REAL, FormaPagamento integer)')
    await db.executeSql('CREATE TABLE IF NOT EXISTS mensalistas (Id integer primary key AUTOINCREMENT NOT NULL, Nome TEXT, Valor REAL, UltimoPagamento DATE, DiaVencimento integer)')
  }

  get DB() {
    return this.sqlite.create({
      name: 'app.db',
      location: 'default'
    })
  }  
}
