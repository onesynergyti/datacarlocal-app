import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ServiceBaseService } from '../services/service-base.service';
import { Utils } from '../utils/utils';
import { DatabaseService } from './database.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MovimentoService } from './movimento.service';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { DatePipe } from '@angular/common';
import { GlobalService } from '../services/global.service';
import { ConfiguracoesService } from '../services/configuracoes.service';
import { ComprasService } from '../services/compras.service';
import { Md5 } from 'ts-md5';
import { rejects } from 'assert';

@Injectable({
  providedIn: 'root'
})
export class PortalService extends ServiceBaseService {

  constructor(
    private http: HttpClient,
    public loadingController: LoadingController,
    private utils: Utils,
    private database: DatabaseService,
    private providerMovimento: MovimentoService,
    private clipboard: Clipboard,
    private globalService: GlobalService,
    private configuracoesService: ConfiguracoesService,
    private comprasService: ComprasService
  ) { 
    super(loadingController)
  }

  public obterInformacoesPortal(): Promise<any> {
    return new Promise((resolve, reject) => {              
      const sql = 'SELECT * from portal'
      this.database.DB.then(db => {
        db.executeSql(sql, [])
        .then(data => {
          // Se possui informações inseridas, confere o Id do dispositivo e envia
          if (data.rows.length > 0) {
            let informacoes = data.rows.item(0)
            if (informacoes.IdDispositivo == null) {
              this.gerarIdDispositivo().then(idDispositivo => {
                resolve({Chave: informacoes.Chave, IdDispositivo: idDispositivo})
              })
              .catch((erro) => {
                reject(erro)
              })
            } 
            else 
              resolve(informacoes)
          // Se não possui, gera uma chave e um Id para o dispositivo
          } else {
            // Sorteia uma chave de envio para o app
            var chave = new DatePipe('en-US').transform(new Date(), 'yyyyMMddhhmmss') + environment.chaveMD5 + Math.floor(Math.random() * 65536)
            const sqlGerarChave = 'insert into portal (Chave) values (?)'
            const dataGerarChave = [chave];
            db.executeSql(sqlGerarChave, dataGerarChave).then(() => {
              this.gerarIdDispositivo().then(idDispositivo => {
                resolve({Chave: chave, IdDispositivo: idDispositivo})
              })
              .catch((erro) => {
                reject(erro)
              })
            })
            .catch((erro) => { 
              reject(erro) 
            })
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

  enviarRemessa() {
    return new Promise((resolve, reject) => {
      // Se não for configurado para sincronizar, considera com sucesso
      if (!this.configuracoesService.configuracoes.Portal.SincronizarInformacoes) {
        this.globalService.onFinalizarSincronizacao.next(true)
      }
      // Somente plano premium pode sincronizar informações
      else if (this.configuracoesService.configuracoes.Portal.SincronizarInformacoes && !this.comprasService.usuarioPremium) {
        this.globalService.onSincronizacaoIndisponivel.next(null)
      }
      else {
        // Obtem a lista dos movimentos a enviar
        this.providerMovimento.lista(new Date('1000/01/01'), new Date('9999/01/01'), null, true)
        .then(movimentos => {
          this.clipboard.copy(JSON.stringify(movimentos))
          // Se não tem movimentos pendentes não faz o envio
          if (movimentos.length == 0) {
            this.globalService.onFinalizarSincronizacao.next(true)
            resolve()
          }
          else {
            this.obterInformacoesPortal().then((informacoes) => {
              const httpOptions = {
                headers: new HttpHeaders({
                  'Content-Type':  'application/json',
                  Authorization: 'my-auth-token',
                  ChaveApp: informacoes.Chave,
                  IdDispositivo: informacoes.IdDispositivo,
                  Assinatura: Md5.hashStr(environment.chaveMD5 + informacoes.Chave + informacoes.IdDispositivo).toString()
                })
              };  
              this.http.post(environment.apiUrl + '/ConexaoApp/movimentos', movimentos, httpOptions)
              .pipe(
                retry(1),
                finalize(() => {
                  this.ocultarProcessamento()
                })
              ).subscribe(
                (retorno: any) => {
                if (retorno.Resposta) {
                  this.database.DB.then(db => {
                    const ids = movimentos.map(item => item.Id).toString()
                    const sql = `update movimentos set DataEnvioPortal = ? where Id in (${ids})`
                    const data = [new DatePipe('en-US').transform(new Date(), 'yyyy-MM-dd')];
                    db.executeSql(sql, data).then(() => {
                      this.globalService.onFinalizarSincronizacao.next(true)
                      resolve()
                    })
                    .catch((erro) => {
                      this.globalService.onErroSincronizacao.next(JSON.stringify(erro))
                      reject(JSON.stringify(erro))
                    })
                  })
                }
                else {
                  this.globalService.onErroSincronizacao.next('Erro no servidor')
                  reject('Erro no servidor')
                }
              },
              (erro) => { 
                this.globalService.onErroSincronizacao.next(erro)
                reject(erro) 
              })
            })
            .catch((erro) => {
              reject(erro)
            })
          }
        })
        .catch(erro => {
          this.globalService.onErroSincronizacao.next(erro)
          reject(erro)
        })
      }
    })
  }

  gerarIdDispositivo() {
    return new Promise((resolve, reject) => {
      this.obterInformacoesPortal().then((informacoes) => {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type':  'application/json',
            Authorization: 'my-auth-token',
            ChaveApp: informacoes.Chave,
            Assinatura: Md5.hashStr(environment.chaveMD5 + informacoes.Chave).toString()
          })
        };  
        this.http.get(environment.apiUrl + '/ConexaoApp/idDispositivo')
        .pipe(
          retry(1),
          finalize(() => {
            this.ocultarProcessamento()
          })
        ).subscribe((retorno: any) => {
          this.database.DB.then(db => {
            const sqlGerarChave = 'update portal set IdDispositivo = ?'
            const dataGerarChave = [retorno.IdDispositivo];
            db.executeSql(sqlGerarChave, dataGerarChave)
            .then(() => {
              resolve(retorno.IdDispositivo)
            })
            .catch((erro) => {
              reject(erro)
            })
          })
          .catch(erro => {
            reject(erro)
          })
        },
        (erro) => {
          reject(erro)
        })
      })
      .catch((erro) => {
        reject(erro)
      })
    })
  }  
}
