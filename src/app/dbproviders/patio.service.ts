import { Injectable } from '@angular/core';
import { Veiculo } from '../models/veiculo';
import { DatabaseService } from './database.service';
import { ServiceBaseService } from '../services/service-base.service';
import { Utils } from '../utils/utils';
import { LoadingController } from '@ionic/angular';
import { rejects } from 'assert';
import { Movimento } from '../models/movimento';
import { DatePipe } from '@angular/common';
import { VeiculoCadastro } from '../models/veiculo-cadastro';
import { Servico } from '../models/servico';
import { ServicoVeiculo } from '../models/servico-veiculo';
import { Funcionario } from '../models/funcionario';

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

  public consultaHistoricoPlaca(placa): Promise<any> {
    return new Promise((resolve, reject) => {              
      const sql = 'SELECT * from veiculosCadastro where Placa = ?'
      const data = [placa];
      this.database.DB.then(db => {
        db.executeSql(sql, data)
        .then(data => {
          if (data.rows.length > 0) {
            resolve(new VeiculoCadastro(data.rows.item(0)))
          } else {
            resolve()
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

  public salvar(veiculo: Veiculo) {
    let sql
    let data

    // Se for inclusão
    if (!veiculo.Id) {
      sql = 'insert into veiculos (Placa, Modelo, TipoVeiculo, Entrada, Saida, Telefone, Nome, Observacoes, Servicos, EntregaAgendada, PrevisaoEntrega, Funcionario, Ativo) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      data = [veiculo.Placa, veiculo.Modelo, veiculo.TipoVeiculo, veiculo.Entrada, veiculo.Saida, veiculo.Telefone, veiculo.Nome, veiculo.Observacoes, JSON.stringify(veiculo.Servicos), veiculo.EntregaAgendada, veiculo.PrevisaoEntrega, JSON.stringify(veiculo.Funcionario), veiculo.Ativo];
    }
    else {
      sql = 'update veiculos set Modelo = ?, TipoVeiculo = ?, Entrada = ?, Saida = ?, Telefone = ?, Nome = ?, Observacoes = ?, Servicos = ?, EntregaAgendada = ?, PrevisaoEntrega = ?, Funcionario = ?, Ativo = ? where Id = ?';
      data = [veiculo.Modelo, veiculo.TipoVeiculo, veiculo.Entrada, veiculo.Saida, veiculo.Telefone, veiculo.Nome, veiculo.Observacoes, JSON.stringify(veiculo.Servicos), veiculo.EntregaAgendada, veiculo.PrevisaoEntrega, JSON.stringify(veiculo.Funcionario), veiculo.Ativo, veiculo.Id];
    }

    return new Promise((resolve, reject) => {
      this.database.DB.then(db => {
        db.executeSql(sql, data)
        .then((row: any) => {
          if (!veiculo.Id) 
            veiculo.Id = row.insertId

          // Tenta atualizar o cadastro do veículo
          const sqlHistorico = 'update veiculosCadastro set Modelo = ?, TipoVeiculo = ?, Telefone = ?, Nome = ? where Placa = ?'
          const dataHistorico = [veiculo.Modelo, veiculo.TipoVeiculo, veiculo.Telefone, veiculo.Nome, veiculo.Placa];
          db.executeSql(sqlHistorico, dataHistorico).then((row: any) => {
            // Se não houve atualização significa que o cadastro não existe
            if (row.rowsAffected == 0) {
              const sqlHistorico = 'insert into veiculosCadastro (Placa, Modelo, TipoVeiculo, Telefone, Nome) values (?, ?, ?, ?, ?)'
              const dataHistorico = [veiculo.Placa, veiculo.Modelo, veiculo.TipoVeiculo, veiculo.Telefone, veiculo.Nome];
              db.executeSql(sqlHistorico, dataHistorico)
            }
          })
          
          // O retorno da promessa é indepente do cadastro histórico do veículo, verifica apenas a entrada no pátio
          resolve(veiculo)
        })
        .catch((erro) => {
          reject(erro)
        })
        .finally(() => {
          this.ocultarProcessamento()
        })
      })
    })
  } 

  public excluir(id) {
    return new Promise((resolve, reject) => { 
      this.database.DB.then(db => { 
        let sql = 'delete from veiculos where Id = ?';
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

  registrarSaida(movimento: Movimento) {
    return new Promise((resolve, reject) => {
      this.database.DB.then(db => {
        db.transaction(tx => {
          // Exclui o carro do pátio
          let ids = ''
          movimento.Veiculos.forEach(itemAtual => {
            if (ids != '')
              ids += ','
            ids += itemAtual.Id
          });
          const sqlExclusao = 'delete from veiculos where Id in ' + '(' +  ids + ')';
          tx.executeSql(sqlExclusao, [], () => {
            // Movimentos com valor zerado não geram registro
            if (movimento.Valor > 0) {
              // Inclui o movimento financeiro
              const sqlInclusao = 'insert into movimentos (Data, Descricao, ValorDinheiro, ValorDebito, ValorCredito, Veiculos) values (?, ?, ?, ?, ?, ?)';
              const dataInclusao = [new DatePipe('en-US').transform(movimento.Data, 'yyyy-MM-dd HH:mm:ss'), movimento.Descricao, movimento.ValorDinheiro, movimento.ValorDebito, movimento.ValorCredito, JSON.stringify(movimento.Veiculos)];
              tx.executeSql(sqlInclusao, dataInclusao, (tx, result) => {
                let promisesTx = []
                // Inclui detalhamento do movimento consolidado dos serviços
                movimento.servicosConsolidados.forEach(servicoAtual => {
                  promisesTx.push(
                    new Promise((resolve, reject) => {
                      const sqlInclusaoServico = 'insert into movimentosServicos (IdMovimento, IdServico, Nome, Valor, Desconto, Acrescimo) values (?, ?, ?, ?, ?, ?)';
                      const dataInclusaoServico = [result.insertId, servicoAtual.Id, servicoAtual.Nome, movimento.Veiculos[0].precoServico(servicoAtual), servicoAtual.Desconto, servicoAtual.Acrescimo];
                      tx.executeSql(sqlInclusaoServico, dataInclusaoServico, () => { resolve() }, (erro) => { reject(erro) })
                    })
                  )      
                });

                // Insere o histórico de todos os veículos
                movimento.Veiculos.forEach(veiculoAtual => {
                  promisesTx.push(
                    new Promise((resolve, reject) => {
                      const sqlInclusaoHistoricoVeiculo = 'insert into veiculosHistorico (Placa, TipoVeiculo, IdFuncionario, Valor, Descontos, Acrescimos, Entrada, Saida, Pagamento) values (?, ?, ?, ?, ?, ?, ?, ?, ?)';
                      const dataInclusaoHistoricoVeiculo = [veiculoAtual.Placa, veiculoAtual.TipoVeiculo, veiculoAtual.Funcionario ? veiculoAtual.Funcionario.Id : null, veiculoAtual.TotalServicos, veiculoAtual.TotalDescontos, veiculoAtual.TotalAcrescimos, new DatePipe('en-US').transform(veiculoAtual.Entrada, 'yyyy-MM-dd HH:mm:ss'), new DatePipe('en-US').transform(veiculoAtual.Saida, 'yyyy-MM-dd HH:mm:ss'), new DatePipe('en-US').transform(movimento.Data, 'yyyy-MM-dd HH:mm:ss')];
                      tx.executeSql(sqlInclusaoHistoricoVeiculo, dataInclusaoHistoricoVeiculo, () => { resolve() }, (erro) => { reject(erro) })
                    })
                  )      
                });

                // Executa todos os comandos SQL preparados
                Promise.all(promisesTx).then(() => { 
                  resolve() 
                }, 
                (erro) => { reject(erro) })
              }, 
              (erro) => { reject(erro) })
            }
            else 
              resolve()
          }, 
          (erro) => { reject (erro) })
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

  public lista(exibirAtivos = true, exibirInativos = false): Promise<any> {
    return new Promise((resolve, reject) => {
      let complementoSQL = ""
      if (!exibirAtivos)
        complementoSQL += " and Ativo = 'false'"
      if (!exibirInativos)
        complementoSQL += " and Ativo = 'true'"
              
      const sql = "SELECT * from veiculos v where 1=1" + complementoSQL;
      this.database.DB.then(db => {
        db.executeSql(sql, [])
        .then(data => {
          if (data.rows.length > 0) {
            let veiculos = []
            for (var i = 0; i < data.rows.length; i++) {
              let veiculo = data.rows.item(i);

              // Converte os serviços do veículos para o objeto adequado
              let servicosVeiculo = JSON.parse(veiculo.Servicos)
              veiculo.Servicos = []
              servicosVeiculo.forEach(servicoAtual => {
                veiculo.Servicos.push(new ServicoVeiculo(servicoAtual))
              });

              // Converte o funcionário responsável
              veiculo.Funcionario = veiculo.Funcionario != null ? JSON.parse(veiculo.Funcionario) : null
              veiculos.push(new Veiculo(veiculo));
            }
            resolve(veiculos)
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
