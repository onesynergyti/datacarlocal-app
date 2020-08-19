import { Injectable } from '@angular/core';
import { ConfiguracoesService } from './configuracoes.service';
import { PrecoEspecial } from '../models/preco-especial';

@Injectable({
  providedIn: 'root'
})
export class CalculadoraEstacionamentoService {

  constructor(
    private configuracoesService: ConfiguracoesService
  ) { }

  valorDiaria(tipoVeiculo): number {
    const precos = this.configuracoesService.configuracoes.Estacionamento

    switch (tipoVeiculo) {
      case 1:
        return precos.DiariaMoto
      case 2:
        return precos.DiariaCarroPequeno
      case 3:
        return precos.DiariaCarroMedio
      case 4:
        return precos.DiariaCarroGrande
      case 5:
        return precos.DiariaMotoPequena
      case 6:
        return precos.DiariaMotoGrande
      case 7:
        return precos.DiariaTipoGenerico
    }
  }

  valorFracao15Minutos(tipoVeiculo): number {
    const precos = this.configuracoesService.configuracoes.Estacionamento

    switch (tipoVeiculo) {
      case 1:
        return precos.Fracao15MinutosMoto
      case 2:
        return precos.Fracao15MinutosCarroPequeno
      case 3:
        return precos.Fracao15MinutosCarroMedio
      case 4:
        return precos.Fracao15MinutosCarroGrande
      case 5:
        return precos.Fracao15MinutosMotoPequena
      case 6:
        return precos.Fracao15MinutosMotoGrande
      case 7:
        return precos.Fracao15MinutosTipoGenerico
    }
  }

  valorFracao30Minutos(tipoVeiculo): number {
    const precos = this.configuracoesService.configuracoes.Estacionamento

    switch (tipoVeiculo) {
      case 1:
        return precos.Fracao30MinutosMoto
      case 2:
        return precos.Fracao30MinutosCarroPequeno
      case 3:
        return precos.Fracao30MinutosCarroMedio
      case 4:
        return precos.Fracao30MinutosCarroGrande
      case 5:
        return precos.Fracao30MinutosMotoPequena
      case 6:
        return precos.Fracao30MinutosMotoGrande
      case 7:
        return precos.Fracao30MinutosTipoGenerico
    }
  }

  valorHora(tipoVeiculo): number {
    const precos = this.configuracoesService.configuracoes.Estacionamento

    switch (tipoVeiculo) {
      case 1:
        return precos.HoraMoto
      case 2:
        return precos.HoraCarroPequeno
      case 3:
        return precos.HoraCarroMedio
      case 4:
        return precos.HoraCarroGrande
      case 5:
        return precos.HoraMotoPequena
      case 6:
        return precos.HoraMotoGrande
      case 7:
        return precos.HoraTipoGenerico
    }
  }

  valorMinutosIniciais(tipoVeiculo): number {
    const precos = this.configuracoesService.configuracoes.Estacionamento

    switch (tipoVeiculo) {
      case 1:
        return precos.PrimeirosMinutosMoto
      case 2:
        return precos.PrimeirosMinutosCarroPequeno
      case 3:
        return precos.PrimeirosMinutosCarroMedio
      case 4:
        return precos.PrimeirosMinutosCarroGrande
      case 5:
        return precos.PrimeirosMinutosMotoPequena
      case 6:
        return precos.PrimeirosMinutosMotoGrande
      case 7:
        return precos.PrimeirosMinutosTipoGenerico
    }
  }

  calcularMinutos(inicio, fim) {
    return Math.ceil((fim - inicio) / 60000)
  }

  calcularPrecos(inicio, fim, tipoVeiculo) {
    const precos = this.configuracoesService.configuracoes.Estacionamento
    let precoDiarias: number = 0.0
    let precoFracionado: number = 0.0

    // Minutos entre as duas datas    
    let minutos = Math.ceil((fim - inicio) / 60000)

    // Verifica se ultrapassou a carência
    if (minutos <= precos.MinutosCarencia) 
      return 0
    
    // Verifica a quantidade de dias para cobrança por diária
    if (this.valorDiaria(tipoVeiculo)) {
      const dias = Math.floor((minutos / 1440))
      // Se não completou uma diaria, não cobra a diaria
      if (dias > 0) {
        precoDiarias += Number(dias * this.valorDiaria(tipoVeiculo))
        // Retira os minutos cobrados por dia e obtem o restante
        minutos = (minutos % 1440)
      }
      
      // Se não houver utilização de fração de hora, 30 ou 15 minutos, adiciona uma diária inteira
      if (minutos > 0 && !this.valorFracao15Minutos(tipoVeiculo) && !this.valorFracao30Minutos(tipoVeiculo) && !this.valorHora(tipoVeiculo)) {
        precoFracionado += Number(this.valorDiaria(tipoVeiculo))
      }
    }
  
    // Cobranca por preços especiais ou minutos iniciais

    let precosEspeciais = precos.PrecosEspeciais.filter(itemAtual => itemAtual.TipoVeiculo == tipoVeiculo)
    .sort((a, b) => a.Minutos - b.Minutos)

    // Se houver preços especiais, verifica sempre do maior tempo para o menor
    if (precosEspeciais.length) {
      // Verifica em qual preço deve ser enquadrada a cobrança
      let precoAvaliado = precosEspeciais[0]
      for(let i = 0; i < precosEspeciais.length -1; i++) {
        // Se o tempo for maior do que o item atual, então o item seguinte é o que vai ser cobrado
        if (minutos > precosEspeciais[i].Minutos)
          precoAvaliado = precosEspeciais[i + 1]        
      }

      precoFracionado += Number(precoAvaliado.Valor)
      minutos = minutos - precoAvaliado.Minutos          
      if (minutos < 0)
        minutos = 0
    }
    // Verifica a cobrança dos minutos iniciais
    else {
      if (precos.UtilizaPrimeirosMinutos) {
        // Se for menor que a quantidade de minutos iniciais cobrados, retorna o preço dos minutos iniciais
        if (minutos <= precos.QuantidadePrimeirosMinutos) 
          return Number(precoDiarias + this.valorMinutosIniciais(tipoVeiculo))
        else {
          precoFracionado += Number(this.valorMinutosIniciais(tipoVeiculo))
          // Retira os minutos iniciais cobrados
          minutos = minutos - precos.QuantidadePrimeirosMinutos
        }      
      }
    }

    // Cobranca de horas adicionais 
    if (this.valorHora(tipoVeiculo)) {
      const horas =  Math.floor(minutos / 60)
      // Se não completou uma hora, não cobra a hora
      if (horas > 0) {
        precoFracionado += Number(horas * this.valorHora(tipoVeiculo))
        // Retira os minutos cobrados por hora
        minutos = (minutos % 60)
      }

      // Se houverem duas frações de 30 sobrando, o sistema cobra uma fração de hora pois é mais barato
      if (minutos > 30) {
        precoFracionado += Number(this.valorHora(tipoVeiculo))
        minutos = 0
      }

      // Se não houver utilização de fração de 30 ou 15 minutos, adiciona uma hora inteira
      if (minutos > 0 && !this.valorFracao15Minutos(tipoVeiculo) && !this.valorFracao30Minutos(tipoVeiculo)) {
        precoFracionado += Number(this.valorHora(tipoVeiculo))
      }
    }

    // Cobranca fração de 30 minutos adicionais
    if (this.valorFracao30Minutos(tipoVeiculo)) {
      const fracao30Minutos =  Math.floor((minutos / 30))
      // Se não completou 30 minutos, não cobra a fração
      if (fracao30Minutos > 0) {
        precoFracionado += Number(fracao30Minutos * this.valorFracao30Minutos(tipoVeiculo))
        // Retira os minutos cobrados por fração de 30
        minutos = (minutos % 30)
      }

      // Se houverem duas frações de 15 sobrando, o sistema cobra uma fração de 30 pois é mais barato
      if (minutos > 15) {
        precoFracionado += Number(this.valorFracao30Minutos(tipoVeiculo))
        minutos = 0
      }

      // Se não houver utilização de fração 15 minutos, adiciona uma fração de 30 minutos
      if (minutos > 0 && !this.valorFracao15Minutos(tipoVeiculo)) {
        precoFracionado += Number(this.valorFracao30Minutos(tipoVeiculo))
      }      
    }

    // Cobranca fração de 15 minutos adicionais
    if (this.valorFracao15Minutos(tipoVeiculo)) {
      const fracao15Minutos = Math.floor((minutos / 15))
      // Se não completou 15 minutos, não cobra a fração
      if (fracao15Minutos > 0) {
        precoFracionado += Number(fracao15Minutos * this.valorFracao15Minutos(tipoVeiculo))
        // Retira os minutos cobrados por fração de 30
        minutos = (minutos % 15)
      }


      // Se houver minutos sobrando, cobra uma fração inteira
      if (minutos > 0) {
        precoFracionado += Number(this.valorFracao15Minutos(tipoVeiculo))
      }
    }

    // O valor cobrado por fração não pode ultrapassar o valor da diária
    if (this.valorDiaria(tipoVeiculo) && precoFracionado > this.valorDiaria(tipoVeiculo)) 
      precoFracionado = this.valorDiaria(tipoVeiculo)

    return Number(precoDiarias + precoFracionado)
  }
}
