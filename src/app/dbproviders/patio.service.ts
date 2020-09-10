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
import { Avaria } from '../models/avaria';
import { ProdutoVeiculo } from '../models/produto-veiculo';
import { GlobalService } from '../services/global.service';
import { ProdutosService } from './produtos.service';
import { PortalService } from './portal.service';
import { Cliente } from '../models/cliente';
import { ClientesService } from './clientes.service';
import { PlanoCliente } from '../models/plano-cliente';

@Injectable({
  providedIn: 'root'
})
export class PatioService extends ServiceBaseService {

  constructor(
    public loadingController: LoadingController,
    private database: DatabaseService,
    private globalService: GlobalService,
    private providerCliente: ClientesService
  ) { 
    super(loadingController)
  }

  public consultaHistoricoPlaca(placa): Promise<any> {
    return new Promise((resolve, reject) => {              
      const sql = 'SELECT * from veiculosCadastro where Placa = ?'
      const data = [placa.toUpperCase().replace(/[^a-zA-Z0-9]/g,'')];
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

  private atualizarDadosVeiculoECliente(veiculo) {
    this.database.DB.then(db => {
      // Tenta atualizar o cadastro do veículo
      const sqlHistorico = 'update veiculosCadastro set Modelo = ?, TipoVeiculo = ?, Telefone = ?, Nome = ? where Placa = ?'
      const dataHistorico = [veiculo.Modelo, veiculo.TipoVeiculo, veiculo.Telefone, veiculo.Nome, veiculo.Placa.toUpperCase().replace(/[^a-zA-Z0-9]/g,'')];
      db.executeSql(sqlHistorico, dataHistorico).then((row: any) => {
        // Se não houve atualização significa que o cadastro não existe
        if (row.rowsAffected == 0) {
          const sqlHistorico = 'insert into veiculosCadastro (Placa, Modelo, TipoVeiculo, Telefone, Nome) values (?, ?, ?, ?, ?)'
          const dataHistorico = [veiculo.Placa.toUpperCase().replace(/[^a-zA-Z0-9]/g,''), veiculo.Modelo, veiculo.TipoVeiculo, veiculo.Telefone, veiculo.Nome];
          db.executeSql(sqlHistorico, dataHistorico)
        }
      })


      // Tenta atualizar as informações do cliente se houver um documento
      if (veiculo.Cliente.Documento != null && veiculo.Cliente.Documento.length >= 5) {
        let cliente = veiculo.Cliente
        let sql =  `SELECT * from clientes where ${cliente.Documento} like documento`
        db.executeSql(sql, [])
        .then(data => {
          const inclusao = data.rows.length == 0
          let sqlMensalista
          let dataMensalista

          if (inclusao) {
            sqlMensalista = 'insert into clientes (Documento, Nome, Telefone, Email, IdCategoria, Nascimento) values (?, ?, ?, ?, ?, ?)'
            dataMensalista = [cliente.Documento, cliente.Nome, cliente.Telefone, cliente.Email, cliente.Categoria != null && cliente.Categoria.Id ? cliente.Categoria.Id : null, cliente.Nascimento != null ? new DatePipe('en-US').transform(cliente.Nascimento, 'yyyy-MM-dd') : null]
          }
          else {
            sqlMensalista = 'update clientes set Nome = ?, Telefone = ?, Email = ?, IdCategoria = ?, Nascimento = ? where Documento = ?'
            dataMensalista = [cliente.Nome, cliente.Telefone, cliente.Email, cliente.Categoria != null && cliente.Categoria.Id ? cliente.Categoria.Id : null, cliente.Nascimento != null ? new DatePipe('en-US').transform(cliente.Nascimento, 'yyyy-MM-dd') : null, cliente.Documento]
          }
          db.executeSql(sqlMensalista, dataMensalista)
        })
      }
    })
  }

  public salvar(veiculo: Veiculo) {
    let sql
    let data

    // Se for inclusão
    if (!veiculo.Id) {
      sql = 'insert into veiculos (Placa, CodigoCartao, Modelo, TipoVeiculo, Entrada, Saida, Telefone, Nome, Observacoes, Servicos, EntregaAgendada, PrevisaoEntrega, Funcionario, Localizacao, Ativo, IdMensalista, Avarias, ImagemAvaria, Produtos, Cliente, Planos) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      data = [veiculo.Placa.toUpperCase().replace(/[^a-zA-Z0-9]/g,''), veiculo.CodigoCartao, veiculo.Modelo, veiculo.TipoVeiculo, new DatePipe('en-US').transform(veiculo.Entrada, 'yyyy-MM-dd HH:mm:ss'), veiculo.Saida != null ? new DatePipe('en-US').transform(veiculo.Saida, 'yyyy-MM-dd HH:mm:ss') : null, veiculo.Telefone, veiculo.Nome, veiculo.Observacoes, JSON.stringify(veiculo.Servicos), veiculo.EntregaAgendada, new DatePipe('en-US').transform(veiculo.PrevisaoEntrega, 'yyyy-MM-dd HH:mm:ss'), JSON.stringify(veiculo.Funcionario), veiculo.Localizacao, veiculo.Ativo, veiculo.IdMensalista, JSON.stringify(veiculo.Avarias), veiculo.ImagemAvaria, JSON.stringify(veiculo.Produtos), JSON.stringify(veiculo.Cliente), JSON.stringify(veiculo.Planos)];
    }
    else {
      sql = 'update veiculos set Modelo = ?, TipoVeiculo = ?, Entrada = ?, Saida = ?, Telefone = ?, Nome = ?, Observacoes = ?, Servicos = ?, EntregaAgendada = ?, PrevisaoEntrega = ?, Funcionario = ?, Localizacao = ?, Ativo = ?, IdMensalista = ?, Avarias = ?, ImagemAvaria = ?, Produtos = ?, Cliente = ?, Planos = ? where Id = ?';
      data = [veiculo.Modelo, veiculo.TipoVeiculo, new DatePipe('en-US').transform(veiculo.Entrada, 'yyyy-MM-dd HH:mm:ss'), veiculo.Saida != null ? new DatePipe('en-US').transform(veiculo.Saida, 'yyyy-MM-dd HH:mm:ss') : null, veiculo.Telefone, veiculo.Nome, veiculo.Observacoes, JSON.stringify(veiculo.Servicos), veiculo.EntregaAgendada, new DatePipe('en-US').transform(veiculo.PrevisaoEntrega, 'yyyy-MM-dd HH:mm:ss'), JSON.stringify(veiculo.Funcionario), veiculo.Localizacao, veiculo.Ativo, veiculo.IdMensalista, JSON.stringify(veiculo.Avarias), veiculo.ImagemAvaria, JSON.stringify(veiculo.Produtos), JSON.stringify(veiculo.Cliente), JSON.stringify(veiculo.Planos), veiculo.Id];
    }

    return new Promise((resolve, reject) => {
      this.database.DB.then(db => {
        db.transaction(tx => {
          tx.executeSql(sql, data, (tx, result) => { 
            if (!veiculo.Id) 
              veiculo.Id = result.insertId
            
              // Exclui todos os serviços utilizados pelo plano do atendimento para inserir novamente
              const sqlExcluiServicos = 'delete from planosClienteUso where IdVeiculo = ?';
              const dataExcluiServicos = [veiculo.Id];

              tx.executeSql(sqlExcluiServicos, dataExcluiServicos, () => {
              // insere os registros de uso de serviços de planos
              let promisesTx = []
              veiculo.Planos.forEach(planoAtual => {
                // Insere o serviço como utilizado apenas se ele existir no atendimento
                if (veiculo.Servicos.find(servicoAtual => servicoAtual.Id == planoAtual.Servico.Id)) {
                  promisesTx.push(
                    new Promise((resolve, reject) => {
                      const sqlInclusaoUsoPlano = 'insert into planosClienteUso (IdPlanoCliente, IdVeiculo, Data, Placa) values (?, ?, ?, ?)';
                      const dataInclusaoUsoPlano = [planoAtual.Id, veiculo.Id, new DatePipe('en-US').transform(veiculo.Entrada, 'yyyy-MM-dd HH:mm:ss'), veiculo.Placa];
                      tx.executeSql(sqlInclusaoUsoPlano, dataInclusaoUsoPlano, () => { resolve() }, (erro) => { reject(erro) })
                    })
                  )      
                }
              })
              // Insere todos as utilizações de planos
              Promise.all(promisesTx).then(() => { 
                // Atualiza as informações do cliente e veículo
                this.atualizarDadosVeiculoECliente(veiculo)
                resolve(veiculo) 
              }, 
              (erro) => { reject(erro) })
            }, (erro) => reject(erro))
          }, (erro) => reject(erro))
        })        
      })
    })
  } 

  public excluir(id) {
    return new Promise((resolve, reject) => { 
      this.database.DB.then(db => { 
        db.transaction(tx => { 
          const sql = 'delete from veiculos where Id = ?';
          const data = [id];
          tx.executeSql(sql, data, () => { 
            const sqlPlanos = 'delete from planosClienteUso where IdVeiculo = ?'
            const dataPlanos = [id];
            tx.executeSql(sqlPlanos, dataPlanos, () => { 
              resolve()
            }, (erro) => { reject(erro) })
          }, (erro) => { reject(erro) })
        })
      })
      .finally(() => {
        this.ocultarProcessamento()
      })
    })
  }

  registrarSaida(movimento: Movimento, valorServicos: number) {
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

          // Abate a sobra no valor em dinheiro, que seria o troco
          const sobra = movimento.ValorCredito + movimento.ValorDebito + movimento.ValorDinheiro - valorServicos
          if (sobra < 0 || sobra > movimento.ValorDinheiro) {
            reject('Valor pago inválido')
            return
          }
          else if (valorServicos < 0) {
            reject('Valor dos serviços não pode ser negativo')
            return
          }
          else 
            movimento.ValorDinheiro = movimento.ValorDinheiro - sobra

          const sqlExclusao = 'delete from veiculos where Id in ' + '(' +  ids + ')';
          tx.executeSql(sqlExclusao, [], () => {
            let promisesTx = []

            // Movimentos com valor zerado não geram registro no extrato
            if (movimento.Valor > 0) {
              // Inclui o movimento financeiro
              const sqlInclusao = 'insert into movimentos (Data, Descricao, ValorDinheiro, ValorDebito, ValorCredito, Veiculos) values (?, ?, ?, ?, ?, ?)';
              const dataInclusao = [new DatePipe('en-US').transform(movimento.Data, 'yyyy-MM-dd HH:mm:ss'), movimento.Descricao, movimento.ValorDinheiro, movimento.ValorDebito, movimento.ValorCredito, JSON.stringify(movimento.Veiculos)];
              tx.executeSql(sqlInclusao, dataInclusao, (tx, result) => {
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

                // Inclui detalhamento do movimento consolidado dos produtos
                movimento.produtosConsolidados.forEach(produtoAtual => {
                  promisesTx.push(
                    new Promise((resolve, reject) => {
                      const sqlInclusaoProduto = 'insert into movimentosProdutos (IdMovimento, IdProduto, Nome, Valor, Desconto, Acrescimo) values (?, ?, ?, ?, ?, ?)';
                      const dataInclusaoProduto = [result.insertId, produtoAtual.Id, produtoAtual.Nome, produtoAtual.precoFinal, produtoAtual.Desconto, produtoAtual.Acrescimo];
                      tx.executeSql(sqlInclusaoProduto, dataInclusaoProduto, () => { resolve() }, (erro) => { reject(erro) })
                    })
                  )      
                });                
              }, 
              (erro) => { reject(erro) })
            }

            // Reduz a quantidade no estoque com o consolidado de produtos
            movimento.produtosConsolidados.forEach(produtoAtual => {
              promisesTx.push(
                new Promise((resolve, reject) => {
                  const sqlEdicaoEstoque = 'update produtos set EstoqueAtual = EstoqueAtual - ? where Id = ?';
                  const dataEdicaoEstoque = [produtoAtual.Quantidade, produtoAtual.Id];
                  tx.executeSql(sqlEdicaoEstoque, dataEdicaoEstoque, () => { resolve() }, (erro) => { reject(erro) })
                })
              )      
            });                

            // Insere o histórico de todos os veículos
            movimento.Veiculos.forEach(veiculoAtual => {
              promisesTx.push(
                new Promise((resolve, reject) => {
                  const sqlInclusaoHistoricoVeiculo = 'insert into veiculosHistorico (Placa, CodigoCartao, TipoVeiculo, IdFuncionario, Valor, Descontos, Acrescimos, Entrada, Saida, Pagamento, Avarias, ImagemAvaria) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
                  const dataInclusaoHistoricoVeiculo = [veiculoAtual.Placa, veiculoAtual.CodigoCartao, veiculoAtual.TipoVeiculo, veiculoAtual.Funcionario ? veiculoAtual.Funcionario.Id : null, veiculoAtual.Total, veiculoAtual.TotalDescontos, veiculoAtual.TotalAcrescimos, new DatePipe('en-US').transform(veiculoAtual.Entrada, 'yyyy-MM-dd HH:mm:ss'), new DatePipe('en-US').transform(veiculoAtual.Saida, 'yyyy-MM-dd HH:mm:ss'), new DatePipe('en-US').transform(movimento.Data, 'yyyy-MM-dd HH:mm:ss'), JSON.stringify(veiculoAtual.Avarias), veiculoAtual.ImagemAvaria];
                  tx.executeSql(sqlInclusaoHistoricoVeiculo, dataInclusaoHistoricoVeiculo, () => { resolve() }, (erro) => { reject(erro) })
                })
              )      
            });

            // Executa todos os comandos SQL preparados
            Promise.all(promisesTx).then(() => { 
              this.globalService.onRealizarVenda.next(movimento) 
              resolve() 
            }, 
            (erro) => { reject(erro) })
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

  public lista(exibirAtivos = true, exibirInativos = false, placa = ''): Promise<any> {
    return new Promise((resolve, reject) => {
      let complementoSQL = ""
      if (!exibirAtivos)
        complementoSQL += " and Ativo = 'false'"
      if (!exibirInativos)
        complementoSQL += " and Ativo = 'true'"      
      if (placa != '')
        complementoSQL += ` and placa like '%${placa}%'`

      const sql = "SELECT * from veiculos v where 1=1" + complementoSQL;
      this.database.DB.then(db => {
        db.executeSql(sql, [])
        .then(data => {
          if (data.rows.length > 0) {
            let veiculos: Veiculo[] = []
            for (var i = 0; i < data.rows.length; i++) {
              let veiculo = data.rows.item(i);

              // Converte os serviços do veículos para o objeto adequado
              if (veiculo.Servicos == null)
                veiculo.Servicos = []
              else {
                let servicosVeiculo = JSON.parse(veiculo.Servicos)
                veiculo.Servicos = []
                servicosVeiculo.forEach(servicoAtual => {
                  veiculo.Servicos.push(new ServicoVeiculo(servicoAtual))
                });
              }

              // Converte os produtos do veículos para o objeto adequado
              if (veiculo.Produtos == null)
                veiculo.Produtos = []
              else {
                let produtosVeiculo = JSON.parse(veiculo.Produtos)
                veiculo.Produtos = []
                produtosVeiculo.forEach(produtoAtual => {
                  veiculo.Produtos.push(new ProdutoVeiculo(produtoAtual))
                });
              }

              // Converte as avarias do veículos para o objeto adequado
              if (veiculo.Avarias == null)
                veiculo.Avarias = []
              else {
                let avariasVeiculo = JSON.parse(veiculo.Avarias)
                veiculo.Avarias = []
                avariasVeiculo.forEach(avariaAtual => {
                  veiculo.Avarias.push(new Avaria(avariaAtual))
                });
              }

              // Converte os planos do veículos para o objeto adequado
              if (veiculo.Planos == null)
                veiculo.Planos = []
              else {
                let planosVeiculo = JSON.parse(veiculo.Planos)
                veiculo.Planos = []
                planosVeiculo.forEach(planoAtual => {
                  veiculo.Planos.push(new PlanoCliente(planoAtual))
                });
              }

              veiculo.Entrada = veiculo.Entrada.split('-').join('/')
              veiculo.Saida = veiculo.Saida != null ? veiculo.Saida.split('-').join('/') : null
              veiculo.PrevisaoEntrega = veiculo.PrevisaoEntrega != null ? veiculo.PrevisaoEntrega.split('-').join('/') : null

              // Converte o funcionário responsável
              veiculo.Funcionario = veiculo.Funcionario != null ? JSON.parse(veiculo.Funcionario) : null

              // Trata a versão antiga do cliente
              if (veiculo.Cliente == null) {
                veiculo.Cliente = new Cliente()
                veiculo.Cliente.Nome = veiculo.Nome
                veiculo.Cliente.Telefone = veiculo.Telefone
              }
              else {
                veiculo.Cliente = new Cliente(JSON.parse(veiculo.Cliente))
              }
                

              veiculo.EntregaAgendada = veiculo.EntregaAgendada == 'true'
              veiculo.Ativo = veiculo.Ativo == 'true'
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
