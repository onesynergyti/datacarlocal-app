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

  constructor() { }
}
