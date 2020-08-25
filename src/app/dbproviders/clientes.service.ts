import { Injectable } from '@angular/core';
import { ServiceBaseService } from '../services/service-base.service';
import { LoadingController } from '@ionic/angular';
import { UtilsLista } from '../utils/utils-lista';
import { DatabaseService } from './database.service';
import { Cliente } from '../models/cliente';
import { PlanoCliente } from '../models/plano-cliente';
import { Servico } from '../models/servico';
import { Categoria } from '../models/categoria';
import { Mensalista } from '../models/mensalista';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ClientesService extends ServiceBaseService {

  constructor(
    public loadingController: LoadingController,
    private utils: UtilsLista,
    private database: DatabaseService
  ) { 
    super(loadingController)
  }

  public lista(id = 0): Promise<any> {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * from clientes where (${id} = 0) or (${id} = Id)`;
      const data = []
      this.database.DB.then(db => {
        db.executeSql(sql, data)
        .then(data => {
          if (data.rows.length > 0) {
            let clientes: Cliente[] = [];
            for (var i = 0; i < data.rows.length; i++) {
              var cliente = data.rows.item(i);
              clientes.push(new Cliente(cliente));
            }
            resolve(clientes)
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

  public listaPlanos(idCliente): Promise<any> {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * from planosCliente where IdCliente = ?";
      const data = [idCliente]
      this.database.DB.then(db => {
        db.executeSql(sql, data)
        .then(data => {
          // Obtem o cliente para definição do objeto
          this.lista(idCliente)
          .then(clientes => {
            if (clientes.length) {
              const cliente = clientes[0]
              if (cliente != null && data.rows.length > 0) {
                let planosCliente: PlanoCliente[] = [];
                for (var i = 0; i < data.rows.length; i++) {
                  let plano = data.rows.item(i)
                  plano.Servico = new Servico(JSON.parse(plano.Servico))
                  plano.Cliente = new Cliente(cliente)
                  plano.Placas = JSON.parse(plano.Placas)
                  planosCliente.push(new PlanoCliente(plano))
                }
                resolve(planosCliente)
              } else {
                resolve([])
              }
            } else {
              resolve([])
            }
          })
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

  public salvar(cliente: Cliente, planos: PlanoCliente[] = []) {
    return new Promise((resolve, reject) => {
      this.database.DB.then(db => {
        db.transaction(tx => {

          let sqlMensalista
          let dataMensalista
      
          alert('vai salvar')
          // Caso seja inclusão
          if (cliente.Id == null || cliente.Id == 0) {
            sqlMensalista = 'insert into clientes (Nome, Documento, Telefone, Email, Categoria) values (?, ?, ?, ?, ?)'
            dataMensalista = [cliente.Nome, cliente.Documento, cliente.Telefone, cliente.Email, cliente.Categoria != null ? JSON.stringify(cliente.Categoria) : null]
          }
          // Caso seja edição
          else {
            sqlMensalista = 'update clientes set Nome = ?, Documento = ?, Telefone = ?, Email = ?, Categoria = ? where Id = ?'
            dataMensalista = [cliente.Nome, cliente.Documento, cliente.Telefone, cliente.Email, cliente.Categoria != null ? JSON.stringify(cliente.Categoria) : null]
          }
          tx.executeSql(sqlMensalista, dataMensalista, () => {
            alert('salvou e agora vai salvar os planos')
            let promisesTx = []

            // Inclui os planos do cliente
            planos.forEach(plano => {
              // Se não foi definido um mensalista dono do movimento antes, insere nesse momento
              if (plano.Cliente == null)
                plano.Cliente = cliente

              promisesTx.push(
                new Promise((resolve, reject) => {
                  alert(JSON.stringify(plano))
                  // Inclusão
                  if (plano.Id == 0) {
                    const sqlInclusaoPlano = 'insert into planosCliente (IdCliente, ValidadeInicial, ValidadeFinal, Servico, Quantidade, ValorDinheiro, ValorDebito, ValorCredito, Placas) values (?, ?, ?, ?, ?, ?, ?, ?, ?)';
                    const dataInclusaoPlano = [cliente.Id, new DatePipe('en-US').transform(plano.ValidadeInicial, 'yyyy-MM-dd HH:mm:ss'), new DatePipe('en-US').transform(plano.ValidadeFinal, 'yyyy-MM-dd HH:mm:ss'), JSON.stringify(plano.Servico), plano.Quantidade, plano.ValorDinheiro, plano.ValorDebito, plano.ValorCredito, JSON.stringify(plano.Placas)];
                    tx.executeSql(sqlInclusaoPlano, dataInclusaoPlano, () => { 
                        resolve() 
                    }, (erro) => { reject(erro) })
                  }
                  else {
                    const sqlInclusaoPlano = 'update planosCliente set ValidadeInicial = ?, ValidadeFinal = ?, Servico = ?, Quantidade = ?, Placas = ? where Id = ?';
                    const dataInclusaoPlano = [new DatePipe('en-US').transform(plano.ValidadeInicial, 'yyyy-MM-dd HH:mm:ss'), new DatePipe('en-US').transform(plano.ValidadeFinal, 'yyyy-MM-dd HH:mm:ss'), JSON.stringify(plano.Servico), plano.Quantidade, JSON.stringify(plano.Placas), plano.Id];
                    tx.executeSql(sqlInclusaoPlano, dataInclusaoPlano, () => { 
                        resolve() 
                    }, (erro) => { reject(erro) })
                  }
                })
              )      
            });

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
            if (data.rows.length > 0) {
              this.lista(data.rows.item(0).IdMensalista).then(mensalistas => {
                if (mensalistas.length > 0)
                  resolve(new Mensalista(mensalistas[0]))
                else
                  resolve()
              })
            }
            else 
              resolve()
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
