import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ServiceBaseService } from '../services/service-base.service';
import { Utils } from '../utils/utils';
import { DatabaseService } from './database.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { retry, finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MovimentoService } from './movimento.service';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { DatePipe } from '@angular/common';
import { GlobalService } from '../services/global.service';

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
    private globalService: GlobalService
  ) { 
    super(loadingController)
  }

  public obterInformacoesPortal(): Promise<any> {
    return new Promise((resolve, reject) => {              
      const sql = 'SELECT * from portal'
      this.database.DB.then(db => {
        db.executeSql(sql, [])
        .then(data => {
          // Se possui informações, retorna
          if (data.rows.length > 0) {
            alert(JSON.stringify(data.rows))
            resolve(data.rows.item(0))
          // Se não possui, gera uma chave nova e insere para retornar
          } else {
            var chave = "teste"
            const sqlGerarChave = 'insert into portal (Chave) values (?)'
            const dataGerarChave = [chave];
            db.executeSql(sqlGerarChave, dataGerarChave).then(() => {
              resolve({Chave: chave})
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
      // Obtem a lista dos movimentos a enviar
      this.providerMovimento.lista(new Date('1000/01/01'), new Date('9999/01/01'), null, true)
      .then(movimentos => {
        // Se não tem movimentos pendentes não faz o envio
        if (movimentos.length == 0) {
          this.globalService.onFinalizarSincronizacao.next(true)
          resolve()
        }
        else {
          this.clipboard.copy(JSON.stringify(movimentos))
          alert('pegou os movimentos' + JSON.stringify(movimentos))
          this.http.post(environment.apiUrl + '/ConexaoApp/movimentos', movimentos)
          .pipe(
            retry(1),
            finalize(() => {
              this.ocultarProcessamento()
            })
          ).subscribe((retorno: any) => {
            alert('Chamou o servidor')
            if (retorno.Resposta) {
              this.database.DB.then(db => {
                const ids = movimentos.map(item => item.Id).toString()
                alert(ids)
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
          }),
          (erro) => { 
            this.globalService.onErroSincronizacao.next(erro)
            reject(erro) 
          }
        }
      })
      .catch(erro => {
        this.globalService.onErroSincronizacao.next(erro)
        reject(erro)
      })
    })
  }

  gerarIdDispositivo() {
    return new Promise((resolve, reject) => {
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
      }),
      (erro) => {
        alert(erro)
        reject(erro)
      }
    })
  }  
}
