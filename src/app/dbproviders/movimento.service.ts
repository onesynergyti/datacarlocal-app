import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Utils } from '../utils/utils';
import { DatabaseService } from './database.service';
import { ServiceBaseService } from '../services/service-base.service';
import { Movimento } from '../models/movimento';
import { DatePipe } from '@angular/common';
import { Veiculo } from '../models/veiculo';

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

  public excluir(id) {
    return new Promise((resolve, reject) => { 
      this.database.DB.then(db => { 
        let sql = 'delete from movimentos where Id = ?';
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

  public lista(inicio: Date, fim: Date, dataMaxima: Date = null, filtrarNaoSincronizadosPortal = false): Promise<any> {
    return new Promise((resolve, reject) => {
      let sql = ''
      if (filtrarNaoSincronizadosPortal)
        sql = "SELECT * from movimentos where Date(Data) between Date(?) and Date(?) and (Data <= ?) and DataEnvioPortal is null order by Data desc limit 200";
      else
         sql = "SELECT * from movimentos where Date(Data) between Date(?) and Date(?) and (Data <= ?) order by Data desc limit 100";
      const data = [new DatePipe('en-US').transform(inicio, 'yyyy-MM-dd'), 
        new DatePipe('en-US').transform(fim, 'yyyy-MM-dd'),
        dataMaxima == null ? new DatePipe('en-US').transform(new Date('9999/01/01') , 'yyyy-MM-dd'): new DatePipe('en-US').transform(dataMaxima, 'yyyy-MM-dd HH:mm:ss')
      ]
      this.database.DB.then(db => {
        db.executeSql(sql, data)
        .then(data => {
          if (data.rows.length > 0) {
            let movimentos: any[] = [];
            for (var i = 0; i < data.rows.length; i++) {
              var movimento = data.rows.item(i);

              // Define as datas com o formato adequado com separador 
              movimento.Data = movimento.Data.split('-').join('/')
              movimento.Inicio = movimento.Inicio != null ? movimento.Inicio.split('-').join('/') : null
              movimento.Fim = movimento.Fim != null ? movimento.Fim.split('-').join('/') : null

              // Cria os veículos do movimento, se houver algum
              if (movimento.Veiculos != null) {
                const veiculos = JSON.parse(movimento.Veiculos)
                movimento.Veiculos = []
                veiculos.forEach(veiculo => {
                  movimento.Veiculos.push(new Veiculo(veiculo))
                });
              }

              movimentos.push(new Movimento(movimento));
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
      sql = 'insert into movimentos (Data, Descricao, ValorDinheiro, ValorDebito, ValorCredito) values (?, ?, ?, ?, ?)'
      data = [new DatePipe('en-US').transform(movimento.Data, 'yyyy-MM-dd HH:mm'), movimento.Descricao, movimento.ValorDinheiro, movimento.ValorDebito, movimento.ValorCredito]
    }
    // Caso seja edição
    else {
      sql = 'update movimentos set Data = ?, Descricao = ?, ValorDinheiro = ?, ValorDebito = ?, ValorCredito = ? where Id = ?'
      data = [new DatePipe('en-US').transform(movimento.Data, 'yyyy-MM-dd HH:mm'), movimento.Descricao, movimento.ValorDinheiro, movimento.ValorDebito, movimento.ValorCredito, movimento.Id]
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

  public saldoPeriodo(inicio: Date, fim: Date): Promise<any> {
    return new Promise((resolve, reject) => {
      const sql = "SELECT coalesce(sum(ValorCredito), 0) ValorCredito, coalesce(sum(ValorDebito), 0) ValorDebito, coalesce(sum(ValorDinheiro), 0) ValorDinheiro " +
      "from movimentos where Date(Data) between Date(?) and Date(?)";
      const data = [new DatePipe('en-US').transform(inicio, 'yyyy-MM-dd'), new DatePipe('en-US').transform(fim, 'yyyy-MM-dd')]
      this.database.DB.then(db => {
        db.executeSql(sql, data)
        .then(data => {
          if (data.rows.length > 0) {
            let saldo: any[] = [];
            for (var i = 0; i < data.rows.length; i++) {
              saldo.push(data.rows.item(i));
            }
            resolve(saldo[0])
          } else {
            resolve({ ValorCredito: 0, ValorDebito: 0, ValorDinheiro: 0 })
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
