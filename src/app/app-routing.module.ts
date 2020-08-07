import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
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
    path: 'mensalistas',
    loadChildren: () => import('./pages/mensalistas/mensalistas.module').then( m => m.MensalistasPageModule)
  },
  {
    path: 'pendencias',
    loadChildren: () => import('./pages/pendencias/pendencias.module').then( m => m.PendenciasPageModule)
  },
  {
    path: 'funcionarios',
    loadChildren: () => import('./pages/funcionarios/funcionarios.module').then( m => m.FuncionariosPageModule)
  },
  {
    path: 'historico-veiculos',
    loadChildren: () => import('./pages/historico-veiculos/historico-veiculos.module').then( m => m.HistoricoVeiculosPageModule)
  },
  {
    path: 'senha-administrador',
    loadChildren: () => import('./pages/senha-administrador/senha-administrador.module').then( m => m.SenhaAdministradorPageModule)
  },
  {
    path: 'inicio',
    loadChildren: () => import('./pages/inicio/inicio.module').then( m => m.InicioPageModule)
  },
  {
    path: 'validar-acesso',
    loadChildren: () => import('./pages/validar-acesso/validar-acesso.module').then( m => m.ValidarAcessoPageModule)
  },
  {
    path: 'produtos',
    loadChildren: () => import('./pages/configuracoes/produtos/produtos.module').then( m => m.ProdutosPageModule)
  },  {
    path: 'backup-online',
    loadChildren: () => import('./pages/backup-online/backup-online.module').then( m => m.BackupOnlinePageModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
