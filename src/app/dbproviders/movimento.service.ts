import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Utils } from '../utils/utils';
import { DatabaseService } from './database.service';
import { ServiceBaseService } from '../services/service-base.service';
import { Movimento } from '../models/movimento';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class MovimentoService extends ServiceBaseService {

  constructor(
    public loadingController: LoadingController,
    private utils: Utils,
    private database: DatabaseService
  ) { 
    super(loadingController)
  }

  public lista(inicio: Date, fim: Date): Promise<any> {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * from movimentos where Date(Data) between Date(?) and Date(?) order by Data desc";
      const data = [new DatePipe('en-US').transform(inicio, 'yyyy-MM-dd'), new DatePipe('en-US').transform(fim, 'yyyy-MM-dd')]
      this.database.DB.then(db => {
        db.executeSql(sql, data)
        .then(data => {
          if (data.rows.length > 0) {
            let movimentos: any[] = [];
            for (var i = 0; i < data.rows.length; i++) {
              var movimento = new Movimento(data.rows.item(i))     
              movimentos.push(movimento);
            }
            resolve(movimentos)
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

  public valorXtipoReceita(inicio: Date, fim: Date): Promise<any> {
    return new Promise((resolve, reject) => {
      const sql = "SELECT strftime('%Y %m', Data) Periodo, sum(ValorCredito) ValorCredito, sum(ValorDebito) ValorDebito, sum(ValorDinheiro) ValorDinheiro from movimentos where Date(Data) between Date(?) and Date(?) group by strftime('%Y %m', Data) order by strftime('%Y %m', Data)";
      const data = [new DatePipe('en-US').transform(inicio, 'yyyy-MM-dd'), new DatePipe('en-US').transform(fim, 'yyyy-MM-dd')]
      this.database.DB.then(db => {
        db.executeSql(sql, data)
        .then(data => {
          alert(JSON.stringify(data))
          if (data.rows.length > 0) {
            let movimentos: any[] = [];
            for (var i = 0; i < data.rows.length; i++) {
              movimentos.push(data.rows.item(i));
            }
            resolve(movimentos)
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
}
