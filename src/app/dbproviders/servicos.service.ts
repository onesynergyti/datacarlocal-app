import { Injectable } from '@angular/core';
import { ServiceBaseService } from '../services/service-base.service';
import { LoadingController } from '@ionic/angular';
import { Utils } from '../utils/utils';
import { DatabaseService } from './database.service';
import { Servico } from '../models/servico';

@Injectable({
  providedIn: 'root'
})
export class ServicosService extends ServiceBaseService {

  constructor(
    public loadingController: LoadingController,
    private utils: Utils,
    private database: DatabaseService
  ) { 
    super(loadingController)
  }

  public salvar(servico: Servico) {
    let sql
    let data

    // Caso seja inclusão
    if (servico.Id == null || servico.Id == 0) {
      sql = 'insert into servicos (Nome, PrecoMoto, PrecoVeiculoPequeno, PrecoVeiculoMedio, PrecoVeiculoGrande) values (?, ?, ?, ?, ?)';
      data = [servico.Nome, servico.PrecoMoto, servico.PrecoVeiculoPequeno, servico.PrecoVeiculoMedio, servico.PrecoVeiculoGrande];
    }
    // Caso seja edição
    else {
      sql = 'update servicos set Nome = ?, PrecoMoto = ?, PrecoVeiculoPequeno = ?, PrecoVeiculoMedio = ?, PrecoVeiculoGrande = ? where Id = ?';
      data = [servico.Nome, servico.PrecoMoto, servico.PrecoVeiculoPequeno, servico.PrecoVeiculoMedio, servico.PrecoVeiculoGrande, servico.Id];
    }

    return new Promise((resolve, reject) => {
      this.database.DB.then(db => {
        db.executeSql(sql, data)
        .then(() => {
          resolve()
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

  public lista(): Promise<any> {
    return new Promise((resolve, reject) => {
      let sql = 'SELECT * from servicos';
      this.database.DB.then(db => {
        db.executeSql(sql, [])
        .then(data => {
          if (data.rows.length > 0) {
            let servicos: any[] = [];
            for (var i = 0; i < data.rows.length; i++) {
              var servico = data.rows.item(i);
              servico.Servicos = JSON.parse(servico.Servicos)
              servicos.push(servico);
            }
            resolve(servicos)
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
