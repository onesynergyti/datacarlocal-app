import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform, LoadingController } from '@ionic/angular';
import { ServiceBaseService } from '../services/service-base.service';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService extends ServiceBaseService {

  constructor(
    public loadingController: LoadingController,
    private sqlite: SQLite,
  ) { 
    super(loadingController)
  }  

  private executarScriptDB(script, tx, id) {
    return new Promise((resolve, reject) => {
      tx.executeSql(`select id from scripts where id = ${id}`, [], (tx, res) => {
        if (res.rows.length <= 0) {
          tx.executeSql(script, [], () => {
            tx.executeSql(`insert into scripts (id) values (${id})`, [], () => { resolve() }, () => { reject() })
          })
        }
        else
          resolve()
      }, 
      () => { reject() })
    })
  }

  public criarTabelas(db: SQLiteObject) {    
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        let promisesTx = []
        tx.executeSql('CREATE TABLE IF NOT EXISTS scripts (Id integer primary key)', [])
        tx.executeSql('CREATE TABLE IF NOT EXISTS portal (IdDispositivo TEXT, Chave TEXT)', [])
        tx.executeSql('CREATE TABLE IF NOT EXISTS produtos (Id integer primary key AUTOINCREMENT NOT NULL, Nome TEXT NOT NULL, Preco REAL, EstoqueAtual REAL, EstoqueMinimo REAL, Codigo TEXT)', [])
        tx.executeSql('CREATE TABLE IF NOT EXISTS servicos (Id integer primary key AUTOINCREMENT NOT NULL, Nome TEXT NOT NULL, PrecoMoto REAL, PrecoVeiculoPequeno REAL, PrecoVeiculoMedio REAL, PrecoVeiculoGrande REAL)', [], () => {
          this.executarScriptDB('ALTER TABLE servicos ADD COLUMN PrecoMotoPequena REAL', tx, 8)
          this.executarScriptDB('ALTER TABLE servicos ADD COLUMN PrecoMotoGrande REAL', tx, 9)
          this.executarScriptDB('ALTER TABLE servicos ADD COLUMN PrecoPadrao REAL', tx, 10)
        })
        tx.executeSql('CREATE TABLE IF NOT EXISTS veiculos (Id integer primary key AUTOINCREMENT NOT NULL, Placa TEXT, CodigoCartao TEXT, Modelo TEXT, TipoVeiculo integer NOT NULL, Entrada DATE NOT NULL, Saida DATE, Telefone TEXT, Nome TEXT, Observacoes TEXT, Servicos TEXT, EntregaAgendada integer, PrevisaoEntrega Date, Funcionario TEXT, Localizacao TEXT, Ativo integer, IdMensalista integer)', [], () => {
          this.executarScriptDB('ALTER TABLE veiculos ADD COLUMN Avarias TEXT', tx, 1)
          this.executarScriptDB('ALTER TABLE veiculos ADD COLUMN ImagemAvaria TEXT', tx, 3)
          this.executarScriptDB('ALTER TABLE veiculos ADD COLUMN Produtos TEXT', tx, 5)
        })
        tx.executeSql('CREATE TABLE IF NOT EXISTS veiculosHistorico (Id integer primary key AUTOINCREMENT NOT NULL, Placa TEXT, CodigoCartao TEXT, TipoVeiculo integer, IdFuncionario integer, Valor REAL, Descontos REAL, Acrescimos REAL, Entrada Date, Saida Date, Pagamento Date)', [], () => { 
          this.executarScriptDB('ALTER TABLE veiculosHistorico ADD COLUMN Avarias TEXT', tx, 2)
          this.executarScriptDB('ALTER TABLE veiculosHistorico ADD COLUMN ImagemAvaria TEXT', tx, 4)
        })
        tx.executeSql('CREATE TABLE IF NOT EXISTS veiculosCadastro (Placa TEXT primary key NOT NULL, Modelo TEXT, TipoVeiculo integer NOT NULL, Telefone TEXT, Nome TEXT)', [])
        tx.executeSql('CREATE TABLE IF NOT EXISTS movimentos (Id integer primary key AUTOINCREMENT NOT NULL, Data DATE, Descricao TEXT, ValorDinheiro REAL, ValorDebito REAL, ValorCredito REAL, Veiculos TEXT, IdMensalista integer, Inicio Date, Fim Date)', [], () => {
          this.executarScriptDB('ALTER TABLE movimentos ADD COLUMN DataEnvioPortal DATE', tx, 7)
        })
        tx.executeSql('CREATE TABLE IF NOT EXISTS movimentosServicos (IdMovimento integer NOT NULL, IdServico integer NOT NULL, Nome TEXT NOT NULL, Valor REAL NOT NULL, Desconto REAL, Acrescimo REAL, PRIMARY KEY (IdMovimento, IdServico), FOREIGN KEY (IdMovimento) REFERENCES movimentos (Id))', [])
        tx.executeSql('CREATE TABLE IF NOT EXISTS movimentosProdutos (IdMovimento integer NOT NULL, IdProduto integer NOT NULL, Nome TEXT NOT NULL, Valor REAL NOT NULL, Desconto REAL, Acrescimo REAL, PRIMARY KEY (IdMovimento, IdProduto), FOREIGN KEY (IdMovimento) REFERENCES movimentos (Id))', [])
        tx.executeSql('CREATE TABLE IF NOT EXISTS mensalistas (Id integer primary key AUTOINCREMENT NOT NULL, Nome TEXT, Documento TEXT, Telefone TEXT, Email TEXT, Ativo integer, Veiculos TEXT, IdsServicos TEXT)', [])
        tx.executeSql('CREATE TABLE IF NOT EXISTS funcionarios (Id integer primary key AUTOINCREMENT NOT NULL, Nome TEXT, Documento TEXT, Telefone TEXT, Email TEXT, Ativo integer)', [])
      })
      .then(() => { resolve() })
      .catch((erro) => { reject(erro) })
    })
  }

  async obterValor(sql, db: SQLiteObject) {
    await db.executeSql(sql, []).then(linhas => {
      return linhas[0].valor
    })
  }

  get DB() {
    return this.sqlite.create({
      name: 'app.db',
      location: 'default'
    })
  }  
}
