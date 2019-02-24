import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingMapPage } from './setting-map';

@NgModule({
  declarations: [
    SettingMapPage,
  ],
  imports: [
    IonicPageModule.forChild(SettingMapPage),
  ],
})
export class SettingMapPageModule {}
