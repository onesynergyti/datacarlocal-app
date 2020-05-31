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
    let sql = 'SELECT * from movimentos';
    return this.database.dbApp.executeSql(sql, [])
    .then(data => {
      if (data.rows.length > 0) {
        let veiculos: any[] = [];
        for (var i = 0; i < data.rows.length; i++) {
          var veiculo = data.rows.item(i);
          veiculos.push(veiculo);                
        }
        return veiculos;
      } else {
        return [];
      }
    })
    .catch((e) => console.error(e))
    .finally(() => {
      this.ocultarProcessamento()
    })
  }
}
