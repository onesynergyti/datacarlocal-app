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

  public salvar(veiculo: Veiculo, inclusao) {
    let sql
    let data

    // Se for inclusão
    if (inclusao) {
      sql = 'insert into veiculos (Placa, Modelo, TipoVeiculo, Entrada, Observacoes, Servicos) values (?, ?, ?, ?, ?, ?)';
      data = [veiculo.Placa, veiculo.Modelo, veiculo.TipoVeiculo, veiculo.Entrada, veiculo.Observacoes, JSON.stringify(veiculo.Servicos)];
    }
    else {
      sql = 'update veiculos set Modelo = ?, TipoVeiculo = ?, Entrada = ?, Observacoes = ?, Servicos = ? where Placa = ?';
      data = [veiculo.Modelo, veiculo.TipoVeiculo, veiculo.Entrada, veiculo.Observacoes, JSON.stringify(veiculo.Servicos), veiculo.Placa];
    }

    return new Promise((resolve, reject) => {
      this.database.DB.then(db => {
        db.executeSql(sql, data)
        .then(() => {
          resolve()
        })
        .catch((erro) => {
          reject(erro)
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
          // Exclui o carro do pátio
          const sqlExclusao = 'delete from veiculos where Placa = ?';
          const dataExclusao = [veiculo.Placa];
          tx.executeSql(sqlExclusao, dataExclusao, () => {
            alert('excluiu veículo')
            // Inclui o movimento financeiro
            const sqlInclusao = 'insert into movimentos (Data, Descricao, Valor, TipoVeiculo, FormaPagamento, Veiculo) values (?, ?, ?, ?, ?, ?)';
            const dataInclusao = [dataPagamento, 'Receita', valor, veiculo.TipoVeiculo, formaPagamento, JSON.stringify(veiculo)];
            tx.executeSql(sqlInclusao, dataInclusao, (tx, result) => {

              // Insere todos os movimentos
              let promisesTx = []
              veiculo.Servicos.map(itemAtual => {
                promisesTx.push(
                  new Promise((resolve, reject) => {
                    const sqlInclusaoServico = 'insert into movimentosServicos (IdMovimento, IdServico, Nome, Valor) values (?, ?, ?, ?)';
                    const dataInclusaoServico = [result.insertId, itemAtual.Id, itemAtual.Nome, 0];
                    tx.executeSql(sqlInclusaoServico, dataInclusaoServico, () => { resolve() }, (erro) => { reject(erro) })
                  })
                )      
              })
              alert('iniciando execução das promessas')                
              Promise.all(promisesTx).then(() => { 
                alert('finalizou')
                resolve() 
              }, 
              (erro) => { reject(erro) })
            }, (erro) => { reject(erro) })
          }, (erro) => { reject (erro) })
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
