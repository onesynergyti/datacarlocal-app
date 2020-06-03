import { Injectable } from '@angular/core';
import { Veiculo } from '../models/veiculo';
import { DatabaseService } from './database.service';
import { ServiceBaseService } from '../services/service-base.service';
import { Utils } from '../utils/utils';
import { LoadingController } from '@ionic/angular';
import { rejects } from 'assert';

@Injectable({
  providedIn: 'root'
})
export class PatioService extends ServiceBaseService {

  constructor(
    public loadingController: LoadingController,
    private utils: Utils,
    private database: DatabaseService
  ) { 
    super(loadingController)
  }

  public adicionar(veiculo: Veiculo) {
    const sql = 'insert into veiculos (Placa, Modelo, TipoVeiculo, Entrada, Observacoes, Servicos) values (?, ?, ?, ?, ?, ?)';
    const data = [veiculo.Placa, veiculo.Modelo, veiculo.TipoVeiculo, veiculo.Entrada, veiculo.Observacoes, JSON.stringify(veiculo.Servicos)];
    return new Promise((resolve, reject) => {
      this.database.DB.then(db => {
        db.executeSql(sql, data)
        .then(() => {
          resolve()
        })
        .catch((erro) => {
          alert(JSON.stringify(erro))
        })
        .finally(() => {
          this.ocultarProcessamento()
        })
      })
    })
  } 

  /*  public excluir(placa) {
    let sql = 'delete from veiculos where Placa = ?';
    let data = [placa];
    return this.database.dbApp.executeSql(sql, data)
    .finally(() => {
      this.ocultarProcessamento()
    })
  }*/

  registrarSaida(veiculo, valor, dataPagamento, formaPagamento) {
    return new Promise((resolve, reject) => {
      this.database.DB.then(db => {
        db.transaction(tx => {
          // Inclui o movimento financeiro
          let sqlInclusao = 'insert into movimentos (Data, Descricao, Valor, FormaPagamento) values (?, ?, ?, ?)';
          const tipoVeiculo = veiculo.TipoVeiculo == 1 ? 'moto' : veiculo.TipoVeiculo == 2 ? 'automóvel pequeno' : 'automóvel grande'
          let dataInclusao = [dataPagamento, 'Aluguel de vaga para ' + tipoVeiculo, valor, formaPagamento];
          tx.executeSql(sqlInclusao, dataInclusao, () => {alert('inseriu movimento')}, (erro) => {alert(JSON.stringify(erro))})

          // Exclui o carro do pátio
          let sqlExclusao = 'delete from veiculos where Placa = ?';
          let dataExclusao = [veiculo.Placa];
          tx.executeSql(sqlExclusao, dataExclusao, () => {alert('inseriu movimento')}, (erro) => {alert(JSON.stringify(erro))})

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

  public lista(): Promise<any> {
    return new Promise((resolve, reject) => {
      let sql = "SELECT Placa, Modelo, TipoVeiculo, Entrada, Observacoes, Servicos as Servicos from veiculos v";
      this.database.DB.then(db => {
        db.executeSql(sql, [])
        .then(data => {
          if (data.rows.length > 0) {
            let veiculos: any[] = [];
            for (var i = 0; i < data.rows.length; i++) {
              var veiculo = data.rows.item(i);
              veiculo.Servicos = JSON.parse(veiculo.Servicos)
              veiculos.push(veiculo);
            }
            resolve(veiculos)
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
