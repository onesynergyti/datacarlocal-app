import { ServicoVeiculo } from './servico-veiculo'

export class Veiculo {
  Id: number = 0
  Placa: string
  Modelo: string
  Entrada: Date = new Date()
  Saida: Date
  TipoVeiculo: number = 0
  Observacoes: string
  Telefone: string
  Nome: string
  Servicos: ServicoVeiculo[] = []
  EntregaAgendada: boolean
  PrevisaoEntrega: Date
  Ativo: boolean = true

  constructor(veiculo: Veiculo = null) {
    if (veiculo != null) {
      this.Id = veiculo.Id
      this.Placa = veiculo.Placa 
      this.Modelo = veiculo.Modelo
      this.Entrada = veiculo.Entrada ? new Date(veiculo.Entrada) : new Date()
      this.Saida = veiculo.Saida
      this.TipoVeiculo = veiculo.TipoVeiculo
      this.Observacoes = veiculo.Observacoes
      this.Telefone = veiculo.Telefone
      this.Nome = veiculo.Nome
      this.Servicos = veiculo.Servicos != null ? veiculo.Servicos.slice() : []
      this.EntregaAgendada = veiculo.EntregaAgendada
      this.PrevisaoEntrega = veiculo.PrevisaoEntrega ? new Date(veiculo.PrevisaoEntrega) : null
      this.Ativo = veiculo.Ativo
    }
  }

  get MinutosRestantes() {
    return this.PrevisaoEntrega ? ((this.PrevisaoEntrega.getTime() - new Date().getTime()) / 60000) : 0
  }

  get PossuiServicoAgendavel() {
    return this.Servicos.find(itemAtual => itemAtual.Id != 0) 
  }

  get PossuiServicoEstacionamento() {
    return this.Servicos.find(itemAtual => itemAtual.Id == 0) 
  }

  get PossuiServicosPendentes() {
    return this.Servicos.find(itemAtual => !itemAtual.Executado && itemAtual.Id) != null 
  }

  precoServico(servico: ServicoVeiculo): number{
    return servico.precoServico(this.TipoVeiculo)
  }

  get TotalServicos() {
    return this.Servicos.reduce((acumulador: number, itemAtual) => acumulador + this.precoServico(itemAtual), 0)
  }

  enviarMensagemWhatsapp(celular, mensagem = '') {
    celular = celular.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
    window.location.href=`https://api.whatsapp.com/send?phone=55${celular}&text=${mensagem.replace(' ', '%20')}`;
  }

  excluirServico(servico) {
    this.Servicos.splice(this.Servicos.indexOf(servico), 1)
  }
}
