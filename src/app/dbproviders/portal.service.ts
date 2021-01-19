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
import { AvisosService } from '../services/avisos.service';
import { UsuarioApp } from '../models/usuario-app';

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
    private comprasService: ComprasService,
    private avisosService: AvisosService
  ) { 
    super(loadingController)

    // Avalia o cadastro do dispositivo e faz um registro de comunicação
    if (this.configuracoesService.configuracoes.Portal.SincronizarInformacoes != 'offline') {
      this.avaliaValidadeCadastroDispositivo().then((informacoes: any) => {
        if (informacoes.Premium) {
          this.comprasService.vencimentoPremium = new Date(informacoes.ProximoDia)
          this.globalService.onAssinarPremium.next({})
        }
        else
          this.comprasService.vencimentoPremium = null
      })
      .catch((erro) => {
        this.globalService.onErroSincronizacao.next(erro)
      })
    }

    // Tenta enviar as vendas a cada 30 minutos, se houver erro de envio registrado
    setInterval(() => { 
      if (this.avisosService.possuiErroEnvio)
        this.enviarRemessa() 
    }, 1800000);
  }

  public avaliaValidadeCadastroDispositivo() {
    return new Promise((resolve, reject) => {
      this.obterInformacoesPortal().then((informacoes) => {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type':  'application/json',
            ChaveApp: informacoes.Chave,
            IdDispositivo: informacoes.IdDispositivo,
            CodigoSistema: environment.codigoSistema.toString(),
            Assinatura: Md5.hashStr(environment.chaveMD5 + informacoes.Chave + informacoes.IdDispositivo).toString()
          })
        };  
        this.http.get(environment.apiUrl + '/ConexaoApp/situacaoCadastro', httpOptions)
        .pipe(
          retry(1),
          finalize(() => {
            this.ocultarProcessamento()
          })
        ).subscribe(retorno => {
          resolve(retorno)
        },
        (erro) => {
          reject(erro.error.Mensagem != null ? erro.error.Mensagem : erro.message != null ? erro.message : JSON.stringify(erro))
        })
      })
      .catch((erro) => {
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

  enviarRemessa(forcarEnvio = false) {
    return new Promise((resolve, reject) => {
      // Se não for configurado como híbrido, considera o envio como bem sucedido. Para forçar o envio o tem que acessar pela tela de configuração do portal
      if (!forcarEnvio && this.configuracoesService.configuracoes.Portal.SincronizarInformacoes != 'hibrido') {
        this.globalService.onFinalizarSincronizacao.next(true)
      }
      else {
        // Obtem a lista dos movimentos a enviar
        this.providerMovimento.lista(new Date('1000/01/01'), new Date('9999/01/01'), null, true)
        .then(movimentos => {
          if (!environment.AlertDebug)
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
                  ChaveApp: informacoes.Chave,
                  IdDispositivo: informacoes.IdDispositivo,
                  CodigoSistema: environment.codigoSistema.toString(),
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
                      // Se o usuário não for premium, valida novamente pois um envio foi realizado
                      if (!this.comprasService.usuarioPremium) {
                        this.avaliaValidadeCadastroDispositivo().then((informacoes: any) => {
                          if (informacoes.Premium) {
                            this.comprasService.vencimentoPremium = new Date(informacoes.ProximoDia)
                            this.globalService.onAssinarPremium.next(null)
                          }
                        })
                      }
                      resolve()
                    })
                    .catch((erro) => {
                      this.globalService.onErroSincronizacao.next(JSON.stringify(erro))
                      reject(erro)
                    })
                  })
                }
                else {
                  this.globalService.onErroSincronizacao.next(retorno.Mensagem)
                  reject(retorno)
                }
              },
              (erro) => { 
                this.globalService.onErroSincronizacao.next(erro.error.Mensagem != null ? erro.error.Mensagem : erro.message != null ? erro.message : JSON.stringify(erro))
                reject(erro.error.Mensagem != null ? erro.error.Mensagem : erro.message != null ? erro.message : JSON.stringify(erro)) 
              })
            })
            .catch((erro) => {
              this.globalService.onErroSincronizacao.next(JSON.stringify(erro))
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

  enviarDadosUsuario(sucesso: boolean /* ccs */) {
    return new Promise((resolve, reject) => {
      if (this.configuracoesService.configuracoes.ManualUso.EnviouDadosUsuario) {
        this.globalService.onFinalizarSincronizacao.next(true)
      }
      else {
        this.obterInformacoesPortal().then((informacoes) => {
          const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type':  'application/json',
              ChaveApp: informacoes.Chave,
              IdDispositivo: informacoes.IdDispositivo,
              CodigoSistema: environment.codigoSistema.toString(),
              Assinatura: Md5.hashStr(environment.chaveMD5 + informacoes.Chave + informacoes.IdDispositivo).toString()
            })
          };

          let usuarioApp: UsuarioApp = new UsuarioApp()
          usuarioApp.Documento = this.configuracoesService.configuracoes.Estabelecimento.Documento
          usuarioApp.NomeEstabelecimento = this.configuracoesService.configuracoes.Estabelecimento.Nome
          usuarioApp.Endereco = this.configuracoesService.configuracoes.Estabelecimento.Endereco
          usuarioApp.Telefone = this.configuracoesService.configuracoes.Estabelecimento.Telefone
          usuarioApp.EmailAdministrador = this.configuracoesService.configuracoes.Seguranca.EmailAdministrador
          usuarioApp.Premmium = this.comprasService.usuarioPremium
  
          if (!sucesso) //ccs
            usuarioApp = null //ccs

          this.http.post(environment.apiUrl + '/ConexaoApp/usuarioApp', usuarioApp, httpOptions)
          .pipe(
            retry(1),
            finalize(() => {
              this.ocultarProcessamento()
            })
          ).subscribe(
            (retorno: any) => {
              if (retorno.Resposta) {
                this.configuracoesService.configuracoes.ManualUso.EnviouDadosUsuario = true /// ccs - Forçar gravar essa informação
              }
              else {
                this.globalService.onErroSincronizacao.next(retorno.Mensagem)
                reject(retorno)
              }
            },
            (erro) => { 
              this.globalService.onErroSincronizacao.next(erro.error.Mensagem != null ? erro.error.Mensagem : erro.message != null ? erro.message : JSON.stringify(erro))
              reject(erro.error.Mensagem != null ? erro.error.Mensagem : erro.message != null ? erro.message : JSON.stringify(erro)) 
            }
          )
        })
        .catch((erro) => {
          this.globalService.onErroSincronizacao.next(JSON.stringify(erro))
          reject(erro)
        })        
      }
    })
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
}
