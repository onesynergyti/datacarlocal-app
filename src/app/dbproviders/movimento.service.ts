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

  public lista(inicio: Date, fim: Date, dataMaxima: Date = null): Promise<any> {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * from movimentos where Date(Data) between Date(?) and Date(?) and (Data <= ?) order by Data desc limit 10";
      const data = [new DatePipe('en-US').transform(inicio, 'yyyy-MM-dd'), 
        new DatePipe('en-US').transform(fim, 'yyyy-MM-dd'),
        dataMaxima == null ? new Date('9999-01-01') : new DatePipe('en-US').transform(dataMaxima, 'yyyy-MM-dd HH:mm:ss')
      ]
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

  public salvar(movimento: Movimento) {
    let sql
    let data

    // Caso seja inclusão
    if (movimento.Id == null || movimento.Id == 0) {
      sql = 'insert into movimentos (Data, Descricao, ValorDinheiro, ValorDebito, ValorCredito, Veiculo) values (?, ?, ?, ?, ?, ?)'
      data = [new DatePipe('en-US').transform(movimento.Data, 'yyyy-MM-dd HH:mm'), movimento.Descricao, movimento.ValorDinheiro, movimento.ValorDebito, movimento.ValorCredito, JSON.stringify(movimento.Veiculos)]
    }
    // Caso seja edição
    else {
      sql = 'update movimentos set Descricao = ?, ValorDinheiro = ?, ValorDebito = ?, ValorCredito = ? where Id = ?'
      data = [movimento.Descricao, movimento.ValorDinheiro, movimento.ValorDebito, movimento.ValorCredito, movimento.Id]
    }

    return new Promise((resolve, reject) => {
      this.database.DB.then(db => {
        db.executeSql(sql, data)
        .then((row: any) => {
          if (!movimento.Id) 
            movimento.Id = row.insertId
          resolve(movimento)
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

  public valorXtipoReceita(inicio: Date, fim: Date): Promise<any> {
    return new Promise((resolve, reject) => {
      const sql = "SELECT strftime('%Y %m', Data) Periodo, " +
      "sum(case when ValorCredito > 0 then ValorCredito else 0 end) ReceitaValorCredito, " +
      "sum(case when ValorCredito < 0 then ValorCredito else 0 end) DespesaValorCredito, " +
      "sum(case when ValorDebito > 0 then ValorDebito else 0 end) ReceitaValorDebito, " +
      "sum(case when ValorDebito < 0 then ValorDebito else 0 end) DespesaValorDebito, " +
      "sum(case when ValorDinheiro > 0 then ValorDinheiro else 0 end) ReceitaValorDinheiro, " +
      "sum(case when ValorDinheiro < 0 then ValorDinheiro else 0 end) DespesaValorDinheiro " +
      "from movimentos where Date(Data) between Date(?) and Date(?) group by strftime('%Y %m', Data) order by strftime('%Y %m', Data)";
      const data = [new DatePipe('en-US').transform(inicio, 'yyyy-MM-dd'), new DatePipe('en-US').transform(fim, 'yyyy-MM-dd')]
      this.database.DB.then(db => {
        db.executeSql(sql, data)
        .then(data => {
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
