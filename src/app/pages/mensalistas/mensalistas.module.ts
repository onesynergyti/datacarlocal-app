import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MensalistasPageRoutingModule } from './mensalistas-routing.module';
import { MensalistasPage } from './mensalistas.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { CadastroMensalistaPage } from './cadastro-mensalista/cadastro-mensalista.page';
import { CadastroVeiculoPage } from './cadastro-mensalista/cadastro-veiculo/cadastro-veiculo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MensalistasPageRoutingModule,
    ComponentsModule
  ],
  entryComponents: [CadastroMensalistaPage, CadastroVeiculoPage],
  declarations: [MensalistasPage, CadastroMensalistaPage, CadastroVeiculoPage]
})
export class MensalistasPageModule {}