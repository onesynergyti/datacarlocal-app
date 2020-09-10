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
import { CategoriasService } from './categorias.service';
import { Veiculo } from '../models/veiculo';
import { PlanoClienteUso } from '../models/plano-cliente-uso';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfiguracoesService } from '../services/configuracoes.service';
import { environment } from 'src/environments/environment';
import { Md5 } from 'ts-md5';
import { retry, finalize } from 'rxjs/operators';
import { Clipboard } from '@ionic-native/clipboard/ngx';

@Injectable({
  providedIn: 'root'
})
export class ClientesService extends ServiceBaseService {

  constructor(
    private http: HttpClient,
    public loadingController: LoadingController,
    private utils: UtilsLista,
    private database: DatabaseService,
    private providerCategorias: CategoriasService,
    private configuracoesService: ConfiguracoesService,
    private clipboard: Clipboard
  ) { 
    super(loadingController)
  }

  public lista(documento = ''): Promise<any> {
    if (this.configuracoesService.configuracoesLocais.Portal.SincronizarInformacoes == 'online') {
      return new Promise((resolve, reject) => {
        this.configuracoesService.obterInformacoesPortal().then((informacoes) => {
          const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type':  'application/json',
              ChaveApp: informacoes.Chave,
              IdDispositivo: informacoes.IdDispositivo,
              CodigoSistema: environment.codigoSistema.toString(),
              Assinatura: Md5.hashStr(environment.chaveMD5 + informacoes.Chave + informacoes.IdDispositivo).toString()
            })
          };  
          this.http.get(environment.apiUrl + '/ClientesApp', httpOptions)
          .pipe(
            retry(1),
            finalize(() => {
              this.ocultarProcessamento()
            })
          ).subscribe((clientes: Cliente[]) => {
            alert(JSON.stringify(clientes))
            resolve(clientes)
          },
          (erro) => {
            reject(erro)
          })
        },
        () => {
          reject()
        })    
      })
    }
    else {
      return new Promise((resolve, reject) => {
        this.providerCategorias.lista().then(categorias => {
          let sql = 'SELECT * from clientes'
          if (documento != '')
            sql = sql + ` where '${documento}' like documento`;
          const data = []
          this.database.DB.then(db => {
            db.executeSql(sql, data)
            .then(data => {
              if (data.rows.length > 0) {
                let clientes: Cliente[] = [];
                for (var i = 0; i < data.rows.length; i++) {
                  var cliente = data.rows.item(i);
                
                  // Verifica a categoria do cliente
                  const categoria = categorias.find(itemAtual => itemAtual.Id == cliente.IdCategoria)
                  cliente.Categoria = categoria != null ? new Categoria(categoria) : null
                  
                  cliente.Nascimento = cliente.Nascimento != null ? cliente.Nascimento.split('-').join('/') : null

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
        .catch(erro => reject(erro))
      })
    }
  }

  public listaPlanos(documento): Promise<any> {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * from planosCliente where Documento = ?";
      const data = [documento]
      this.database.DB.then(db => {
        db.executeSql(sql, data)
        .then(data => {
          // Obtem o cliente para definição do objeto
          this.lista(documento)
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

  public listaUsoPlano(idPlano): Promise<any> {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * from planosClienteUso where IdPlanoCliente = ?";
      const data = [idPlano]
      this.database.DB.then(db => {
        db.executeSql(sql, data)
        .then(data => {
          alert('carregou lista uso')
          // Obtem as datas de utilização
          let planoClienteUsos: PlanoClienteUso[] = [];
          for (var i = 0; i < data.rows.length; i++) {
            let uso = data.rows.item(i)
            uso.Data = uso.Data != null ? uso.Data.split('-').join('/') : null            
            planoClienteUsos.push(new PlanoClienteUso(uso))
          }
          resolve(planoClienteUsos)
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

  public salvar(cliente: Cliente) {
    if (this.configuracoesService.configuracoesLocais.Portal.SincronizarInformacoes == 'online') {
      return new Promise((resolve, reject) => {
        this.configuracoesService.obterInformacoesPortal().then((informacoes) => {
          const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type':  'application/json',
              ChaveApp: informacoes.Chave,
              IdDispositivo: informacoes.IdDispositivo,
              CodigoSistema: environment.codigoSistema.toString(),
              Assinatura: Md5.hashStr(environment.chaveMD5 + informacoes.Chave + informacoes.IdDispositivo).toString()
            })
          };  
          this.http.post(environment.apiUrl + '/ClientesApp', cliente, httpOptions)
          .pipe(
            retry(1),
            finalize(() => {
              this.ocultarProcessamento()
            })
          ).subscribe((retorno: any) => {
            if (retorno.Resposta == "OK")
              resolve(retorno.Cliente)
            else 
              reject(retorno.Mensagem)
          },
          (erro) => {
            reject(erro)
          })
        },
        () => {
          reject()
        })    
      })
    }
    else {
      return new Promise((resolve, reject) => {
        alert(JSON.stringify(cliente))
        this.lista(cliente.Documento).then(clientes => {
          alert(JSON.stringify(clientes))
          const inclusao = clientes[0] == null

          this.database.DB.then(db => {
            db.transaction(tx => {
    
              let sqlMensalista
              let dataMensalista
          
              if (inclusao) {
                sqlMensalista = 'insert into clientes (Documento, Nome, Telefone, Email, IdCategoria, Nascimento) values (?, ?, ?, ?, ?, ?)'
                dataMensalista = [cliente.Documento, cliente.Nome, cliente.Telefone, cliente.Email, cliente.Categoria != null && cliente.Categoria.Id ? cliente.Categoria.Id : null, cliente.Nascimento != null ? new DatePipe('en-US').transform(cliente.Nascimento, 'yyyy-MM-dd') : null]
              }
              else {
                sqlMensalista = 'update clientes set Nome = ?, Telefone = ?, Email = ?, IdCategoria = ?, Nascimento = ? where Documento = ?'
                dataMensalista = [cliente.Nome, cliente.Telefone, cliente.Email, cliente.Categoria != null && cliente.Categoria.Id ? cliente.Categoria.Id : null, cliente.Nascimento != null ? new DatePipe('en-US').transform(cliente.Nascimento, 'yyyy-MM-dd') : null, cliente.Documento]
              }
              tx.executeSql(sqlMensalista, dataMensalista, () => {
                let promisesTx = []
    
                // Inclui os planos do cliente
                cliente.Planos.forEach(plano => {
                  alert(JSON.stringify(plano))
                  // Se não foi definido o documento do cliente antes, insere nesse momento
                  if (plano.Documento == null)
                    plano.Documento = cliente.Documento
    
                  promisesTx.push(
                    new Promise((resolve, reject) => {
                      // Inclusão
                      if (plano.Id == 0) {
                        const sqlInclusaoPlano = 'insert into planosCliente (Documento, ValidadeInicial, ValidadeFinal, Servico, Quantidade, ValorDinheiro, ValorDebito, ValorCredito, Placas) values (?, ?, ?, ?, ?, ?, ?, ?, ?)';
                        const dataInclusaoPlano = [cliente.Documento, new DatePipe('en-US').transform(plano.ValidadeInicial, 'yyyy-MM-dd'), new DatePipe('en-US').transform(plano.ValidadeFinal, 'yyyy-MM-dd HH:mm:ss'), JSON.stringify(plano.Servico), plano.Quantidade, plano.ValorDinheiro, plano.ValorDebito, plano.ValorCredito, JSON.stringify(plano.Placas)];
                        tx.executeSql(sqlInclusaoPlano, dataInclusaoPlano, () => { 
                            // Insere o movimento no caixa quando for um novo plano
                            const sqlInclusaoMovimento = 'insert into movimentos (Data, Descricao, ValorDinheiro, ValorDebito, ValorCredito, PlanoCliente) values (?, ?, ?, ?, ?, ?)'
                            const dataMovimento = [new DatePipe('en-US').transform(new Date(), 'yyyy-MM-dd HH:mm'), 'Plano de serviço', plano.ValorDinheiro, plano.ValorDebito, plano.ValorCredito, JSON.stringify(plano)]
                            tx.executeSql(sqlInclusaoMovimento, dataMovimento, () => {
                              resolve() 
                            }, 
                            (erro) => { reject(erro) })
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
        .catch(erro => {
          reject(erro)
        })
      })
    }
  }  

  validarPlanos(dataReferencia, placa, veiculo: Veiculo) {
    return new Promise((resolve, reject) => {
      if (placa == '' || dataReferencia == '') {
        this.ocultarProcessamento()
        resolve(true)
      }
      else {
        this.database.DB.then(db => {
          // Obtem um mensalista
          const sql = `SELECT * from planosCliente pc
            where ((pc.quantidade = 0) or ((select count(IdPlanoCliente) from planosClienteUso pcu where pcu.IdPlanoCliente = pc.Id and IdVeiculo <> ${veiculo.Id}) <= pc.Quantidade))
            and ((pc.Placas like '%${placa}%') or (pc.Documento like '${veiculo.Cliente.Documento}' and pc.Placas like '[]'))
            and Date(?) between Date(pc.ValidadeInicial) and Date(pc.ValidadeFinal)`
          const data = [new DatePipe('en-US').transform(dataReferencia, 'yyyy-MM-dd')]
          db.executeSql(sql, data)
          .then(data => {
            let planosCliente: PlanoCliente[] = [];
            for (var i = 0; i < data.rows.length; i++) {
              let plano = data.rows.item(i)
              plano.Servico = new Servico(JSON.parse(plano.Servico))
              plano.Cliente = new Cliente(veiculo.Cliente)
              plano.Placas = JSON.parse(plano.Placas)
              planosCliente.push(new PlanoCliente(plano))
            }

            resolve(planosCliente)
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
