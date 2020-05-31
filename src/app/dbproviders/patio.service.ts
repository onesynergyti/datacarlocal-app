import { Injectable } from '@angular/core';
import { Veiculo } from '../models/veiculo';
import { DatabaseService } from './database.service';
import { ServiceBaseService } from '../services/service-base.service';
import { Utils } from '../utils/utils';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class PatioService extends ServiceBaseService {

  constructor(
    public loadingController: LoadingController,
    private utils: Utils,
    private database: DatabaseService
  ) { 
    super(loadingController)
  }

  public adicionar(veiculo: Veiculo) {
    let sql = 'insert into veiculos (Placa, Modelo, TipoVeiculo, Entrada, Observacoes) values (?, ?, ?, ?, ?)';
    let data = [veiculo.Placa, veiculo.Modelo, veiculo.TipoVeiculo, veiculo.Entrada, veiculo.Observacoes];
    return this.database.dbApp.executeSql(sql, data)
    .finally(() => {
      this.ocultarProcessamento()
    })
  }

  public excluir(placa) {
    let sql = 'delete from veiculos where Placa = ?';
    let data = [placa];
    return this.database.dbApp.executeSql(sql, data)
    .finally(() => {
      this.ocultarProcessamento()
    })
  }

  public registrarSaida() {
    this.database.dbApp.addTransaction(tx => {})
  }

  public lista(): Promise<any> {
    let sql = 'SELECT Placa, Entrada, TipoVeiculo from veiculos';
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
