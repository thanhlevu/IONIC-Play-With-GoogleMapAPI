import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, NgModule } from "@angular/core";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { Geolocation } from "@ionic-native/geolocation";
import { GoogleNearby } from "@ionic-native/google-nearby";

import { MyApp } from "./app.component";
import { HomePage } from "../pages/home/home";
import { HttpModule } from "@angular/http";
import { HttpClientModule } from "@angular/common/http";

import { GoogleMapComponent } from "../components/google-map/google-map";
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker,
  Environment,
  Polyline,
  Spherical
} from "@ionic-native/google-maps";
@NgModule({
  declarations: [MyApp, HomePage, GoogleMapComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp, HomePage],
  providers: [
    StatusBar,
    Geolocation,
    GoogleNearby,
    SplashScreen,
    Spherical,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule {}
