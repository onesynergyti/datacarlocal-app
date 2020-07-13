import { Injectable } from '@angular/core';
import { ServiceBaseService } from '../services/service-base.service';
import { LoadingController } from '@ionic/angular';
import { UtilsLista } from '../utils/utils-lista';
import { DatabaseService } from './database.service';
import { Funcionario } from '../models/funcionario';

@Injectable({
  providedIn: 'root'
})
export class FuncionariosService extends ServiceBaseService { 

  constructor(
    public loadingController: LoadingController,
    private utils: UtilsLista,
    private database: DatabaseService
  ) { 
    super(loadingController)
  }

  public excluir(id) {
    return new Promise((resolve, reject) => { 
      this.database.DB.then(db => { 
        let sql = "update funcionarios set Ativo = false where Id = ?";
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

  public lista(exibirInativos = false): Promise<any> {
    return new Promise((resolve, reject) => {
      let sql
      if (exibirInativos)
        sql = "SELECT * from funcionarios"
      else
        sql = "SELECT * from funcionarios where Ativo = 'true'"
      this.database.DB.then(db => {
        db.executeSql(sql, [])
        .then(data => {
          if (data.rows.length > 0) {
            let funcionarios: any[] = [];
            for (var i = 0; i < data.rows.length; i++) {
              var funcionario = data.rows.item(i);
              funcionarios.push(funcionario);
            }
            resolve(funcionarios)
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

  public salvar(funcionario: Funcionario) {
    let sql
    let data

    // Caso seja inclusão
    if (funcionario.Id == null || funcionario.Id == 0) {
      sql = 'insert into funcionarios (Nome, Documento, Email, Telefone, Ativo) values (?, ?, ?, ?, ?)';
      data = [funcionario.Nome, funcionario.Documento, funcionario.Email, funcionario.Telefone, funcionario.Ativo];
    }
    // Caso seja edição
    else {
      sql = 'update funcionarios set Nome = ?, Documento = ?, Email = ?, Telefone = ? where Id = ?';
      data = [funcionario.Nome, funcionario.Documento, funcionario.Email, funcionario.Telefone, funcionario.Id];
    }

    return new Promise((resolve, reject) => {
      this.database.DB.then(db => {
        db.executeSql(sql, data)
        .then((row: any) => {
          if (!funcionario.Id) 
            funcionario.Id = row.insertId
          resolve(funcionario)
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
