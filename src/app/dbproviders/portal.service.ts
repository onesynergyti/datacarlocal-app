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
    if (this.configuracoesService.configuracoesLocais.Portal.SincronizarInformacoes != 'offline') {
      this.avaliaValidadeCadastroDispositivo().then((informacoes: any) => {
        alert(JSON.stringify(informacoes))
        if (informacoes.Premium) {
          this.comprasService.vencimentoPremium = new Date(informacoes.ProximoDia)
          this.globalService.onAssinarPremium.next({})
        }
        else
          this.comprasService.vencimentoPremium = null

        // Confirma a sincronização no caso de comunicação online
        if (this.configuracoesService.configuracoesLocais.Portal.SincronizarInformacoes == 'online')
          this.globalService.onFinalizarSincronizacao.next({})
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

  enviarRemessa(forcarEnvio = false) {
    return new Promise((resolve, reject) => {
      // Se não for configurado como híbrido, considera o envio como bem sucedido. Para forçar o envio o tem que acessar pela tela de configuração do portal
      if (!forcarEnvio && this.configuracoesService.configuracoesLocais.Portal.SincronizarInformacoes != 'hibrido') {
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
}
