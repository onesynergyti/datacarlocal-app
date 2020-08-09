export class ServicoVeiculo {
  Id: number = 0
  Nome: string = ''
  PrecoMoto: number = 0
  PrecoVeiculoPequeno: number = 0
  PrecoVeiculoMedio: number = 0
  PrecoVeiculoGrande: number = 0
  Executado: boolean
  Desconto: number = 0
  Acrescimo: number = 0

  constructor(servicoVeiculo: ServicoVeiculo = null) {
    if (servicoVeiculo != null) {
      this.Id = servicoVeiculo.Id
      this.Nome = servicoVeiculo.Nome
      this.PrecoMoto = servicoVeiculo.PrecoMoto
      this.PrecoVeiculoPequeno = servicoVeiculo.PrecoVeiculoPequeno
      this.PrecoVeiculoMedio = servicoVeiculo.PrecoVeiculoMedio
      this.PrecoVeiculoGrande = servicoVeiculo.PrecoVeiculoGrande
      this.Executado = servicoVeiculo.Executado
      this.Desconto = servicoVeiculo.Desconto
      this.Acrescimo = servicoVeiculo.Acrescimo
    }
  }

  precoServico(tipoVeiculo, desconsiderarAjustes = false) {    
    let preco
    switch(tipoVeiculo) {
      case 1: { 
        preco = this.PrecoMoto 
        break
      }
      case 2: { 
        preco = this.PrecoVeiculoPequeno
        break
      }
      case 3: { 
        preco = this.PrecoVeiculoMedio
        break
      }
      case 4: { 
        preco = this.PrecoVeiculoGrande
        break
      }
    }
    return desconsiderarAjustes ? preco : preco + this.Acrescimo - this.Desconto
  }
}
