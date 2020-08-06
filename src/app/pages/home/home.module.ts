import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { ComponentsModule } from '../../components/components.module';
import { EntradaPage } from './entrada/entrada.page';
import { PipeModule } from 'src/app/pipes/pipe.module';
import { CadastroServicoPage } from './entrada/cadastro-servico/cadastro-servico.page';
import { PinchZoomModule } from 'ngx-pinch-zoom';
import { CadastroProdutoPage } from './entrada/cadastro-produto/cadastro-produto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ComponentsModule,
    PipeModule.forRoot(),
    PinchZoomModule 
  ],
  entryComponents: [EntradaPage, CadastroServicoPage, CadastroProdutoPage],
  declarations: [HomePage, EntradaPage, CadastroServicoPage, CadastroProdutoPage]
})
export class HomePageModule {}
