import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Utils } from '../utils/utils';
import { DatabaseService } from './database.service';
import { ServiceBaseService } from '../services/service-base.service';

@Injectable({
  providedIn: 'root'
})
export class MovimentoService extends ServiceBaseService {

  constructor(
    public loadingController: LoadingController,
    private utils: Utils,
    private database: DatabaseService
  ) { 
    super(loadingController)
  }

  public lista(): Promise<any> {
    return new Promise((resolve, reject) => {
      let sql = 'SELECT * from movimentos';
      this.database.DB.then(db => {
        db.executeSql(sql, [])
        .then(data => {
          if (data.rows.length > 0) {
            let movimentos: any[] = [];
            for (var i = 0; i < data.rows.length; i++) {
              var movimento = data.rows.item(i);
              movimentos.push(movimento);
            }
            resolve(movimentos)
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
