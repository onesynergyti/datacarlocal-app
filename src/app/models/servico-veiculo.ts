export class ServicoVeiculo {
  Id: number = 0
  Nome: string = ''
  PrecoPadrao: number = 0
  PrecoMoto: number = 0
  PrecoMotoPequena: number = 0
  PrecoMotoGrande: number = 0
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
      this.PrecoMotoPequena = servicoVeiculo.PrecoMotoPequena
      this.PrecoMoto = servicoVeiculo.PrecoMoto
      this.PrecoMotoGrande = servicoVeiculo.PrecoMotoGrande
      this.PrecoVeiculoPequeno = servicoVeiculo.PrecoVeiculoPequeno
      this.PrecoVeiculoMedio = servicoVeiculo.PrecoVeiculoMedio
      this.PrecoVeiculoGrande = servicoVeiculo.PrecoVeiculoGrande
      this.PrecoPadrao = servicoVeiculo.PrecoPadrao
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
      case 5: { 
        preco = this.PrecoMotoPequena
        break
      }
      case 6: { 
        preco = this.PrecoMotoGrande
        break
      }
      default: {
        preco = this.PrecoPadrao
        break
      }
    }
    return desconsiderarAjustes ? preco : preco + this.Acrescimo - this.Desconto
  }
}
