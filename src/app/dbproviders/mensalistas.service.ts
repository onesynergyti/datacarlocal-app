import { Injectable } from '@angular/core';
import { ServiceBaseService } from '../services/service-base.service';
import { LoadingController } from '@ionic/angular';
import { UtilsLista } from '../utils/utils-lista';
import { DatabaseService } from './database.service';
import { Mensalista } from '../models/mensalista';
import { Movimento } from '../models/movimento';
import { DatePipe } from '@angular/common';

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

  public listaPagamentos(idMensalista): Promise<any> {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * from movimentos where IdMensalista = ?";
      const data = [idMensalista]
      this.database.DB.then(db => {
        db.executeSql(sql, data)
        .then(data => {
          if (data.rows.length > 0) {
            let pagamentosMensalista: any[] = [];
            for (var i = 0; i < data.rows.length; i++) {
              pagamentosMensalista.push(new Movimento(data.rows.item(i)));
            }
            resolve(pagamentosMensalista)
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

  public salvar(mensalista: Mensalista, movimentos: Movimento[] = [], movimentosExclusao: Movimento[] = []) {
    return new Promise((resolve, reject) => {
      this.database.DB.then(db => {
        db.transaction(tx => {

          let sqlMensalista
          let dataMensalista
      
          // Caso seja inclusão
          if (mensalista.Id == null || mensalista.Id == 0) {
            sqlMensalista = 'insert into mensalistas (Nome, Documento, Telefone, Email, Ativo, Veiculos) values (?, ?, ?, ?, ?, ?)'
            dataMensalista = [mensalista.Nome, mensalista.Documento, mensalista.Telefone, mensalista.Email, mensalista.Ativo, JSON.stringify(mensalista.Veiculos)]
          }
          // Caso seja edição
          else {
            sqlMensalista = 'update mensalistas set Nome = ?, Documento = ?, Telefone = ?, Email = ?, Ativo = ?, Veiculos = ? where Id = ?'
            dataMensalista = [mensalista.Nome, mensalista.Documento, mensalista.Telefone, mensalista.Email, mensalista.Ativo, JSON.stringify(mensalista.Veiculos), mensalista.Id]
          }      
          tx.executeSql(sqlMensalista, dataMensalista, (tx, result) => {
            let promisesTx = []

            // Inclui movimento dos novos pagamentos e edições
            movimentos.forEach(movimento => {
              // Se não foi definido um mensalista dono do movimento antes, insere nesse momento
              if (movimento.IdMensalista == 0)
                movimento.IdMensalista = result.insertId
              promisesTx.push(
                new Promise((resolve, reject) => {
                  // Inclusão
                  if (movimento.Id == 0) {
                    const sqlInclusaoMovimento = 'insert into movimentos (Data, Descricao, ValorDinheiro, ValorDebito, ValorCredito, IdMensalista, Inicio, Fim) values (?, ?, ?, ?, ?, ?, ?, ?)';
                    const dataInclusaoMovimento = [new DatePipe('en-US').transform(movimento.Data, 'yyyy-MM-dd HH:mm:ss'), movimento.Descricao, movimento.ValorDinheiro, movimento.ValorDebito, movimento.ValorCredito, movimento.IdMensalista, new DatePipe('en-US').transform(movimento.Inicio, 'yyyy-MM-dd HH:mm:ss'), new DatePipe('en-US').transform(movimento.Fim, 'yyyy-MM-dd HH:mm:ss')];
                    tx.executeSql(sqlInclusaoMovimento, dataInclusaoMovimento, () => { resolve() }, (erro) => { reject(erro) })
                  }
                  // Atualização
                  else {
                    const sqlEdicaoMovimento = 'update movimentos set Data = ?, Descricao = ?, ValorDinheiro = ?, ValorDebito = ?, ValorCredito = ?, IdMensalista = ?, Inicio = ?, Fim = ? where Id = ?';
                    const dataEdicaoMovimento = [new DatePipe('en-US').transform(movimento.Data, 'yyyy-MM-dd HH:mm:ss'), movimento.Descricao, movimento.ValorDinheiro, movimento.ValorDebito, movimento.ValorCredito, movimento.IdMensalista, new DatePipe('en-US').transform(movimento.Inicio, 'yyyy-MM-dd HH:mm:ss'), new DatePipe('en-US').transform(movimento.Fim, 'yyyy-MM-dd HH:mm:ss'), movimento.Id];
                    tx.executeSql(sqlEdicaoMovimento, dataEdicaoMovimento, () => { resolve() }, (erro) => { reject(erro) })
                  }
                })
              )      
            });

            // Inclui os movimentos que devem ser excluidos
            movimentosExclusao.forEach(movimento => {
              promisesTx.push(
                new Promise((resolve, reject) => {
                  // Inclusão
                  const sqlExclusaoMovimento = 'delete from movimentos where Id = ?';
                  const dataExclusaoMovimento = [movimento.Id];
                  tx.executeSql(sqlExclusaoMovimento, dataExclusaoMovimento, () => { resolve() }, (erro) => { reject(erro) })
                })
              )      
            })

            Promise.all(promisesTx).then(() => { 
              resolve() 
            }, 
            (erro) => { reject(erro) })
          }, (erro) => { reject(erro) })
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

  validarMensalista(dataReferencia = null, placa = null) {
    return new Promise((resolve, reject) => {
      if (placa == null || dataReferencia == null) {
        this.ocultarProcessamento()
        resolve(true)
      }
      else {
        this.database.DB.then(db => {
          // Obtem um mensalista
          const sql = `SELECT mov.* from mensalistas men 
            join movimentos mov on mov.IdMensalista = men.Id
            where men.Ativo = 'true' and men.Veiculos like '%${placa}%'
            and Date(?) between Date(mov.Inicio) and Date(mov.Fim)`
          const data = [new DatePipe('en-US').transform(dataReferencia, 'yyyy-MM-dd')]
          db.executeSql(sql, data)
          .then(data => {

            for (var i = 0; i < data.rows.length; i++) {
              alert(JSON.stringify(data.rows.item(i)))
            }
            
            resolve(data.rows.length > 0)
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
      }
    })
  }
}
