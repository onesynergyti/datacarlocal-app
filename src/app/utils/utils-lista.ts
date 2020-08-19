import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })
  
export class UtilsLista {

  constructor () { }

  atualizarLista(lista: any[], item: any, inserirInicio = false, campo = 'Id') {    
    if (item != null) {
      // Garante a criação do objeto da lista
      if (lista == null) 
        lista = []

      let index = lista.findIndex(itemAtual => itemAtual[campo] == item[campo])

      // Atualiza o elemento na lista conforme o resultado da pesquisa
      if (index >= 0) 
        lista[index] = item
      else {
        if (inserirInicio)
          lista.unshift(item)
        else
          lista.push(item)
      }
    }
  }

  excluirDaLista(lista: any[], item: any, campo = 'Id') {
    if (item != null) {
      let index = lista.findIndex(itemAtual => itemAtual[campo] == item[campo])

      // Exclui o elemento na lista se foi encontrado
      if (index >= 0) 
        lista.splice(index, 1)
    }
  }

}
