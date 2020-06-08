import { ServicoVeiculo } from './servico-veiculo'

export class Veiculo {
  Placa: string
  Modelo: string
  Entrada: Date = new Date()
  TipoVeiculo: number
  Observacoes: string
  Telefone: string
  Nome: string
  Servicos: ServicoVeiculo[] = []
  EntregaAgendada: boolean
  PrevisaoEntrega: Date

  constructor(veiculo: Veiculo = null) {
    if (veiculo != null) {
      this.Placa = veiculo.Placa 
      this.Modelo = veiculo.Modelo
      this.Entrada = veiculo.Entrada ? new Date(veiculo.Entrada) : new Date()
      this.TipoVeiculo = veiculo.TipoVeiculo
      this.Observacoes = veiculo.Observacoes
      this.Telefone = veiculo.Telefone
      this.Nome = veiculo.Nome
      this.Servicos = veiculo.Servicos != null ? veiculo.Servicos.slice() : []
      this.EntregaAgendada = veiculo.EntregaAgendada
      this.PrevisaoEntrega = veiculo.PrevisaoEntrega ? new Date(veiculo.PrevisaoEntrega) : null
    }
  }

  get MinutosRestantes() {
    return this.PrevisaoEntrega ? ((this.PrevisaoEntrega.getTime() - new Date().getTime()) / 60000) : 0
  }

  get PossuiServicoAgendavel() {
    const item = this.Servicos.find(itemAtual => itemAtual.Id != 0) 
    return item != null
  }

  get PossuiServicosPendentes() {
    return this.Servicos.find(itemAtual => !itemAtual.Executado && itemAtual.Id) != null 
  }

  precoServico(servico: ServicoVeiculo) {
    switch(this.TipoVeiculo) {
      case 1: return servico.PrecoMoto
      case 2: return servico.PrecoVeiculoPequeno
      case 3: return servico.PrecoVeiculoMedio
      case 4: return servico.PrecoVeiculoGrande
      default: return '0'
    }
  }

  enviarMensagemWhatsapp(celular, mensagem = '') {
    celular = celular.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
    window.location.href=`https://api.whatsapp.com/send?phone=55${celular}&text=${mensagem.replace(' ', '%20')}`;
  }
}
