import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MensalistasPage } from './mensalistas.page';

const routes: Routes = [
  {
    path: '',
    component: MensalistasPage
  },
  {
    path: 'cadastro-mensalista',
    loadChildren: () => import('./cadastro-mensalista/cadastro-mensalista.module').then( m => m.CadastroMensalistaPageModule)
  },
  {
    path: 'cadastro-pagamento',
    loadChildren: () => import('./cadastro-mensalista/cadastro-pagamento/cadastro-pagamento.module').then( m => m.CadastroPagamentoPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MensalistasPageRoutingModule {}
