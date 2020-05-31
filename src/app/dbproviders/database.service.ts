import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { promise } from 'protractor';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  dbApp: SQLiteObject
  private dbDisponivel: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private sqlite: SQLite,
    private platform: Platform
  ) { 
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'app.db',
        location: 'default'
      })
      .then((db) => {
        this.dbApp = db
        this.createTables()
      })
    })
  }  

  estado() {
    return this.dbDisponivel.asObservable();
  }

  private createTables() {
    // Criando as tabelas
    this.dbApp.executeSql('CREATE TABLE IF NOT EXISTS veiculos (Placa TEXT primary key NOT NULL, Modelo TEXT, TipoVeiculo integer, Entrada DATE, Observacoes TEXT)')
    this.dbApp.executeSql('CREATE TABLE IF NOT EXISTS movimento (Id integer primary key AUTOINCREMENT NOT NULL, Data DATE, Descricao TEXT, Valor REAL, FormaPagamento integer)')
    this.dbApp.executeSql('CREATE TABLE IF NOT EXISTS mensalistas (Id integer primary key AUTOINCREMENT NOT NULL, Nome TEXT, Valor REAL, UltimoPagamento DATE, DiaVencimento integer)')
    this.dbDisponivel.next(true)
  }  
}
