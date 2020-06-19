import { Injectable } from '@angular/core';
import { Veiculo } from '../models/veiculo';
import { DatabaseService } from './database.service';
import { ServiceBaseService } from '../services/service-base.service';
import { Utils } from '../utils/utils';
import { LoadingController } from '@ionic/angular';
import { rejects } from 'assert';
import { Movimento } from '../models/movimento';
import { DatePipe } from '@angular/common';

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

  public salvar(veiculo: Veiculo) {
    let sql
    let data

    alert(JSON.stringify(veiculo))

    // Se for inclusão
    if (!veiculo.Id) {
      sql = 'insert into veiculos (Placa, Modelo, TipoVeiculo, Entrada, Saida, Telefone, Nome, Observacoes, Servicos, EntregaAgendada, PrevisaoEntrega, Ativo) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      data = [veiculo.Placa, veiculo.Modelo, veiculo.TipoVeiculo, veiculo.Entrada, veiculo.Saida, veiculo.Telefone, veiculo.Nome, veiculo.Observacoes, JSON.stringify(veiculo.Servicos), veiculo.EntregaAgendada, veiculo.PrevisaoEntrega, veiculo.Ativo];
    }
    else {
      sql = 'update veiculos set Modelo = ?, TipoVeiculo = ?, Entrada = ?, Telefone = ?, Nome = ?, Observacoes = ?, Servicos = ?, EntregaAgendada = ?, PrevisaoEntrega = ?, Ativo = ? where Id = ?';
      data = [veiculo.Modelo, veiculo.TipoVeiculo, veiculo.Entrada, veiculo.Telefone, veiculo.Nome, veiculo.Observacoes, JSON.stringify(veiculo.Servicos), veiculo.EntregaAgendada, veiculo.PrevisaoEntrega, veiculo.Ativo, veiculo.Id];
    }

    return new Promise((resolve, reject) => {
      this.database.DB.then(db => {
        db.executeSql(sql, data)
        .then((row: any) => {
          if (!veiculo.Id) 
            veiculo.Id = row.insertId
          resolve(veiculo)
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

  registrarSaida(movimento: Movimento) {
    return new Promise((resolve, reject) => {
      this.database.DB.then(db => {
        db.transaction(tx => {
          // Exclui o carro do pátio
          const sqlExclusao = 'delete from veiculos where Id = ?';
          const dataExclusao = [movimento.Veiculo.Id];
          tx.executeSql(sqlExclusao, dataExclusao, () => {
            // Inclui o movimento financeiro
            const sqlInclusao = 'insert into movimentos (Data, Descricao, ValorDinheiro, ValorDebito, ValorCredito, Veiculo) values (?, ?, ?, ?, ?, ?)';
            const dataInclusao = [new DatePipe('en-US').transform(movimento.Data, 'yyyy-MM-dd HH:mm:ss'), movimento.Descricao, movimento.ValorDinheiro, movimento.ValorDebito, movimento.ValorCredito, JSON.stringify(movimento.Veiculo)];
            tx.executeSql(sqlInclusao, dataInclusao, (tx, result) => {

              // Insere todos os serviços do movimentos
              let promisesTx = []
              movimento.Veiculo.Servicos.map(itemAtual => {
                promisesTx.push(
                  new Promise((resolve, reject) => {
                    const sqlInclusaoServico = 'insert into movimentosServicos (IdMovimento, IdServico, Nome, Valor) values (?, ?, ?, ?)';
                    const dataInclusaoServico = [result.insertId, itemAtual.Id, itemAtual.Nome, 0];
                    tx.executeSql(sqlInclusaoServico, dataInclusaoServico, () => { resolve() }, (erro) => { reject(erro) })
                  })
                )      
              })
              Promise.all(promisesTx).then(() => { 
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

  public lista(exibirAtivos = true, exibirInativos = false): Promise<any> {
    return new Promise((resolve, reject) => {
      let complementoSQL = ""
      if (!exibirAtivos)
        complementoSQL += " and Ativo = 'false'"
      if (!exibirInativos)
        complementoSQL += " and Ativo = 'true'"
              
      let sql = "SELECT * from veiculos v where 1=1" + complementoSQL;
      alert(sql)
      this.database.DB.then(db => {
        db.executeSql(sql, [])
        .then(data => {
          if (data.rows.length > 0) {
            let veiculos: any[] = [];
            for (var i = 0; i < data.rows.length; i++) {
              alert(JSON.stringify(data.rows.item(i)))
              var veiculo = data.rows.item(i);
              veiculo.Servicos = JSON.parse(veiculo.Servicos)
              veiculos.push(new Veiculo(veiculo));
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
