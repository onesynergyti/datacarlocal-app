import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Movimento } from '../models/movimento';
import { Produto } from '../models/produto';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  public onRealizarVenda = new BehaviorSubject<Movimento>(null)
  public onAlterarProduto = new BehaviorSubject<Produto>(null)
  public onAssinarPremium = new BehaviorSubject<any>(null)
  public onErroSincronizacao = new BehaviorSubject<any>(null)
  public onFinalizarSincronizacao = new BehaviorSubject<any>(null)
  public onSalvarConfiguracoes = new BehaviorSubject<any>(null)
  public onSincronizacaoIndisponivel = new BehaviorSubject<any>(null)  

  constructor() { }
}
