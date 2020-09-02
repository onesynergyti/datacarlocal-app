import { Injectable } from '@angular/core';
import { ServiceBaseService } from '../services/service-base.service';
import { LoadingController } from '@ionic/angular';
import { UtilsLista } from '../utils/utils-lista';
import { DatabaseService } from './database.service';
import { Categoria } from '../models/categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService extends ServiceBaseService {

  constructor(
    public loadingController: LoadingController,
    private utils: UtilsLista,
    private database: DatabaseService,
  ) { 
    super(loadingController)
  }

  public excluir(id) {
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

  public salvar(categoria: Categoria) {
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

  public lista(): Promise<any> {
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
