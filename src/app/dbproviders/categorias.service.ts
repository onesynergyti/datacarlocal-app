import { Injectable } from '@angular/core';
import { ServiceBaseService } from '../services/service-base.service';
import { LoadingController } from '@ionic/angular';
import { UtilsLista } from '../utils/utils-lista';
import { DatabaseService } from './database.service';
import { Categoria } from '../models/categoria';
import { ConfiguracoesService } from '../services/configuracoes.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Md5 } from 'ts-md5';
import { finalize, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService extends ServiceBaseService {

  constructor(
    private http: HttpClient,
    public loadingController: LoadingController,
    private utils: UtilsLista,
    private database: DatabaseService,
    private configuracoesService: ConfiguracoesService
  ) { 
    super(loadingController)
  }

  public excluir(id) {
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
          this.http.delete(environment.apiUrl + `/CategoriasApp/${id}`, httpOptions)
          .pipe(
            retry(1),
            finalize(() => {
              this.ocultarProcessamento()
            })
          ).subscribe((categoria: Categoria) => {
            resolve(categoria)
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
        this.database.DB.then(db => { 
          let sql = 'delete from categorias where Id = ?';
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
  }

  public salvar(categoria: Categoria) {
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
          this.http.post(environment.apiUrl + '/CategoriasApp', categoria, httpOptions)
          .pipe(
            retry(1),
            finalize(() => {
              this.ocultarProcessamento()
            })
          ).subscribe((retorno: any) => {
            if (retorno.Resposta == "OK")
              resolve(retorno.Categoria)
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
      let sql
      let data
  
      // Caso seja inclusão
      if (categoria.Id == null || categoria.Id == 0) {
        sql = 'insert into categorias (Nome) values (?)';
        data = [categoria.Nome];
      }
      // Caso seja edição
      else {
        sql = 'update categorias set Nome = ? where Id = ?';
        data = [categoria.Nome, categoria.Id];
      }
  
      return new Promise((resolve, reject) => {
        this.database.DB.then(db => {
          db.executeSql(sql, data)
          .then((row: any) => {
            if (!categoria.Id) 
              categoria.Id = row.insertId
            resolve(categoria)
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
  }

  public lista(): Promise<any> {
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
          this.http.get(environment.apiUrl + '/CategoriasApp', httpOptions)
          .pipe(
            retry(1),
            finalize(() => {
              this.ocultarProcessamento()
            })
          ).subscribe((categorias: Categoria[]) => {
            let categoriasRetorno = []
            categorias.forEach(categoria => {
              categoriasRetorno.push(new Categoria(categoria))
            })
            resolve(categoriasRetorno)
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
        let sql = 'SELECT * from categorias';
        this.database.DB.then(db => {
          db.executeSql(sql, [])
          .then(data => {
            let categorias: any[] = []
  
            for (var i = 0; i < data.rows.length; i++) {
              var categoria = data.rows.item(i);
              categorias.push(new Categoria(categoria));
            }
  
            resolve(categorias)
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
}
