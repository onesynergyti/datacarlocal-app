import { Injectable } from '@angular/core';
import { ServiceBaseService } from '../services/service-base.service';
import { LoadingController } from '@ionic/angular';
import { UtilsLista } from '../utils/utils-lista';
import { DatabaseService } from './database.service';
import { Mensalista } from '../models/mensalista';

@Injectable({
  providedIn: 'root'
})
export class MensalistasService extends ServiceBaseService {

  constructor(
    public loadingController: LoadingController,
    private utils: UtilsLista,
    private database: DatabaseService
  ) { 
    super(loadingController)
  }

  public lista(): Promise<any> {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * from mensalistas";
      const data = []
      this.database.DB.then(db => {
        db.executeSql(sql, data)
        .then(data => {
          if (data.rows.length > 0) {
            let mensalistas: any[] = [];
            for (var i = 0; i < data.rows.length; i++) {
              var mensalista = data.rows.item(i);
              mensalista.Veiculos = JSON.parse(mensalista.Veiculos)
              mensalistas.push(new Mensalista(mensalista));
            }
            resolve(mensalistas)
          } else {
            resolve([])
          }
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

  public salvar(mensalista: Mensalista) {
    let sql
    let data  

    alert(JSON.stringify(mensalista))

    // Caso seja inclusão
    if (mensalista.Id == null || mensalista.Id == 0) {
      sql = 'insert into mensalistas (Nome, Documento, Valor, Telefone, Email, Ativo, Veiculos) values (?, ?, ?, ?, ?, ?, ?)'
      data = [mensalista.Nome, mensalista.Documento, mensalista.Valor, mensalista.Telefone, mensalista.Email, mensalista.Ativo, JSON.stringify(mensalista.Veiculos)]
    }
    // Caso seja edição
    else {
      sql = 'update mensalistas set Nome = ?, Documento = ?, Valor = ?, Telefone = ?, Email = ?, Ativo = ?, Veiculos = ? where Id = ?'
      data = [mensalista.Nome, mensalista.Documento, mensalista.Valor, mensalista.Telefone, mensalista.Email, mensalista.Ativo, JSON.stringify(mensalista.Veiculos), mensalista.Id]
    }

    return new Promise((resolve, reject) => {
      this.database.DB.then(db => {
        db.executeSql(sql, data)
        .then((row: any) => {
          if (!mensalista.Id) 
            mensalista.Id = row.insertId
          resolve(mensalista)
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
}
