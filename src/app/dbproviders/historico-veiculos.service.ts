import { Injectable } from '@angular/core';
import { ServiceBaseService } from '../services/service-base.service';
import { LoadingController } from '@ionic/angular';
import { UtilsLista } from '../utils/utils-lista';
import { DatabaseService } from './database.service';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class HistoricoVeiculosService extends ServiceBaseService {

  constructor(
    public loadingController: LoadingController,
    private utils: UtilsLista,
    private database: DatabaseService
  ) { 
    super(loadingController)
  }

  public lista(inicio: Date, fim: Date, idMinimo = 0): Promise<any> {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * from veiculosHistorico where Date(Pagamento) between Date(?) and Date(?) order by Id desc limit 100";
      const data = [new DatePipe('en-US').transform(inicio, 'yyyy-MM-dd'), new DatePipe('en-US').transform(fim, 'yyyy-MM-dd')]
      this.database.DB.then(db => {
        db.executeSql(sql, data)
        .then(data => {
          if (data.rows.length > 0) {
            alert(JSON.stringify(data))
            let vendas: any[] = [];

            for (var i = 0; i < data.rows.length; i++) {
              vendas.push(data.rows.item(i));
            }
            resolve(vendas)
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
