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
    loadChildren: () => import('./pages/impressora/impressora.module').then( m => m.ImpressoraPageModule)
  },
  {
    path: 'entrada',
    loadChildren: () => import('./pages/entrada/entrada.module').then( m => m.EntradaPageModule)
  },
  {
    path: 'saida',
    loadChildren: () => import('./pages/saida/saida.module').then( m => m.SaidaPageModule)
  },
  {
    path: 'movimento',
    loadChildren: () => import('./pages/movimento/movimento.module').then( m => m.MovimentoPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
