import { Injectable } from '@angular/core';
import { ServiceBaseService } from '../services/service-base.service';
import { LoadingController } from '@ionic/angular';
import { Utils } from '../utils/utils';
import { DatabaseService } from './database.service';
import { Servico } from '../models/servico';
import { ConfiguracoesService } from '../services/configuracoes.service';

@Injectable({
  providedIn: 'root'
})
export class ServicosService extends ServiceBaseService {

  constructor(
    public loadingController: LoadingController,
    private utils: Utils,
    private database: DatabaseService,
    private configuracoesService: ConfiguracoesService
  ) { 
    super(loadingController)
  }

  public excluir(id) {
    return new Promise((resolve, reject) => { 
      this.database.DB.then(db => { 
        let sql = 'delete from servicos where Id = ?';
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
        .then((row: any) => {
          if (!servico.Id) 
            servico.Id = row.insertId
          resolve(servico)
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

  public lista(carregarEstacionamento = true): Promise<any> {
    return new Promise((resolve, reject) => {
      let sql = 'SELECT * from servicos';
      this.database.DB.then(db => {
        db.executeSql(sql, [])
        .then(data => {
          let servicos: any[] = []

          // Se utilizar estacionamento adiciona automaticamente o serviço equivalente
          if (carregarEstacionamento && this.configuracoesService.configuracoes.Estacionamento.UtilizarEstacionamento)
          {
            const servicoEstacionamento = new Servico()
            servicoEstacionamento.Id = 0
            servicoEstacionamento.Nome = "Estacionamento"
            servicos.push(servicoEstacionamento)
          }

          for (var i = 0; i < data.rows.length; i++) {
            var servico = data.rows.item(i);
            servicos.push(servico);
          }

          resolve(servicos)
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
