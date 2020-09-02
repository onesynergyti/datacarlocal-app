import { Injectable } from '@angular/core';
import { Configuracoes } from '../models/configuracoes';
import { GlobalService } from './global.service';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';
import { DatabaseService } from '../dbproviders/database.service';
import { retry, finalize } from 'rxjs/operators';
import { ServiceBaseService } from './service-base.service';
import { Md5 } from 'ts-md5';
import { DatePipe } from '@angular/common';
import { Utils } from '../utils/utils';


@Injectable({
  providedIn: 'root'
})
export class ConfiguracoesService extends ServiceBaseService {

  configuracoes: Configuracoes

  constructor(
    private http: HttpClient,
    public loadingController: LoadingController,
    private database: DatabaseService,
    private globalService: GlobalService,
    private utils: Utils
  ) { 
    super(loadingController)
  }

  atualizarConfiguracoes() {
    return new Promise((resolve, reject) => {
      // Se for configurações se uso local, retorna o local storage
      if (this.configuracoesLocais.Portal.SincronizarInformacoes != 'online') {
        this.configuracoes = new Configuracoes(this.configuracoesLocais)
        resolve(this.configuracoes)
      }
      // Se for configurações online, obtem as informações configuradas no servidor
      else {
        this.obterInformacoesPortal().then(informacoes => {
          const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type':  'application/json',
              ChaveApp: informacoes.Chave,
              IdDispositivo: informacoes.IdDispositivo,
              CodigoSistema: environment.codigoSistema.toString(),
              Assinatura: Md5.hashStr(environment.chaveMD5 + informacoes.Chave + informacoes.IdDispositivo).toString()
            })
          };  
          this.http.get(environment.apiUrl + '/ConfiguracoesApp', httpOptions)
          .pipe(
            retry(1),
            finalize(() => {
              this.ocultarProcessamento()
            })
          ).subscribe((retorno: any) => { 
            this.configuracoes = new Configuracoes(retorno)
            resolve(this.configuracoes)
          },
          erro => {
            this.utils.alertLog('Deu erro para obter as informações ' + erro + JSON.stringify(erro))
            reject(erro)
          })
        })
        .catch(erro => {
          reject(erro)
        })
      }
    })
  }

  get configuracoesLocais() {
    return new Configuracoes(JSON.parse(localStorage.getItem('configuracoes')))
  }

  set configuracoesLocais(configuracoes) {
    localStorage.setItem('configuracoes', JSON.stringify(configuracoes))
    this.globalService.onSalvarConfiguracoes.next(configuracoes)
  }

  get configuracaoPortal() {
    return new Configuracoes(JSON.parse(localStorage.getItem('configuracoes'))).Portal
  }

  get manualUso() {
    return new Configuracoes(JSON.parse(localStorage.getItem('configuracoes'))).ManualUso
  }

  gerarIdDispositivo(informacoesPortal) {
    return new Promise((resolve, reject) => {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          Authorization: 'my-auth-token',
          ChaveApp: informacoesPortal.Chave,
          Assinatura: Md5.hashStr(environment.chaveMD5 + informacoesPortal.Chave).toString()
        })
      };  
      this.http.get(environment.apiUrl + '/ConexaoApp/idDispositivo', httpOptions)
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
              this.gerarIdDispositivo(informacoes).then(idDispositivo => {
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
            var chave = Md5.hashStr(new DatePipe('en-US').transform(new Date(), 'yyyyMMddhhmmss') + environment.chaveMD5 + Math.floor(Math.random() * 65536)).toString()
            const sqlGerarChave = 'insert into portal (Chave) values (?)'
            const dataGerarChave = [chave];
            db.executeSql(sqlGerarChave, dataGerarChave).then(() => {
              this.gerarIdDispositivo({Chave: chave}).then(idDispositivo => {
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
}
