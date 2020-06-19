import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CadastroMensalistaPage } from './cadastro-mensalista.page';

const routes: Routes = [
  {
    path: '',
    component: CadastroMensalistaPage
  },
  {
    path: 'cadastro-veiculo',
    loadChildren: () => import('./cadastro-veiculo/cadastro-veiculo.module').then( m => m.CadastroVeiculoPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CadastroMensalistaPageRoutingModule {}
