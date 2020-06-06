import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'impressora',
    loadChildren: () => import('./pages/configuracoes/impressora/impressora.module').then( m => m.ImpressoraPageModule)
  },
  {
    path: 'movimento',
    loadChildren: () => import('./pages/movimento/movimento.module').then( m => m.MovimentoPageModule)
  },
  {
    path: 'servicos',
    loadChildren: () => import('./pages/configuracoes/servicos/servicos.module').then( m => m.ServicosPageModule)
  },
  {
    path: 'configuracoes',
    loadChildren: () => import('./pages/configuracoes/configuracoes.module').then( m => m.ConfiguracoesPageModule)
  },
  {
    path: 'configuracoes-estacionamento',
    loadChildren: () => import('./pages/configuracoes-estacionamento/configuracoes-estacionamento.module').then( m => m.ConfiguracoesEstacionamentoPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
