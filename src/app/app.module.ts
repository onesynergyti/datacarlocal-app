import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SelectPopupModalPage } from './components/select-popup-modal/select-popup-modal.page';
import { AdMobFree } from '@ionic-native/admob-free/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";
import { PipeModule } from './pipes/pipe.module';
import { FormsModule } from '@angular/forms';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { SaidaPage } from './pages/home/saida/saida.page';

@NgModule({
  declarations: [
    AppComponent,
    SelectPopupModalPage,
    SaidaPage
  ],
  entryComponents: [
    SelectPopupModalPage,
    SaidaPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(), 
    AppRoutingModule,
    ComponentsModule,
    FormsModule,
    BrowserAnimationsModule,
    PipeModule.forRoot()
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SQLite,
    SQLitePorter,
    AdMobFree,
    BluetoothSerial,
    BarcodeScanner,
    DatePicker,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
