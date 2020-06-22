import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MensalistasPageRoutingModule } from './mensalistas-routing.module';
import { MensalistasPage } from './mensalistas.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { CadastroMensalistaPage } from './cadastro-mensalista/cadastro-mensalista.page';
import { CadastroVeiculoPage } from './cadastro-mensalista/cadastro-veiculo/cadastro-veiculo.page';
import { CadastroPagamentoPage } from './cadastro-mensalista/cadastro-pagamento/cadastro-pagamento.page';
import { PipeModule } from 'src/app/pipes/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MensalistasPageRoutingModule,
    ComponentsModule,
    PipeModule.forRoot() 
  ],
  entryComponents: [CadastroMensalistaPage, CadastroVeiculoPage, CadastroPagamentoPage],
  declarations: [MensalistasPage, CadastroMensalistaPage, CadastroVeiculoPage, CadastroPagamentoPage]
})
export class MensalistasPageModule {}