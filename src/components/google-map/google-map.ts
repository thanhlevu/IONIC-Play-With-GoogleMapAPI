import { Component, ViewChild } from "@angular/core";
import { Geolocation } from "@ionic-native/geolocation";
import { GoogleNearby } from "@ionic-native/google-nearby";
import { HttpClient } from "@angular/common/http";
import "rxjs/add/operator/map";
import { DirectionMapJson } from "../../type";
import { Modal, ModalController, ModalOptions } from "ionic-angular";

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
declare var google;

@Component({
  selector: "google-map",
  templateUrl: "google-map.html",
  providers: [Spherical]
})
export class GoogleMapComponent {
  @ViewChild("map") mapElement;
  map: any;
  destination = { lat: 60.259639, lng: 24.845552 };
  currentLocation: any = "";
  departureTime = new Date();
  vehicle: string;
  mode = "DRIVING";
  origin: {
    lat: number;
    lng: number;
  };
  onStartFromNewPlace = false;
  selectedMode = "DRIVING"; //   ==>    "DRIVING" / "BICYCLING" / "TRANSIT" / "WALKING"
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();
  constructor(
    private geolocation: Geolocation,
    private googleNearby: GoogleNearby,
    public http: HttpClient,
    private spherical: Spherical,
    private modal: ModalController
  ) {}

  ngOnInit() {
    //this.initMap();
    this.calculateAndDisplayRoute();
    console.log("1departureTime", this.departureTime);
  }

  calculateAndDisplayRoute() {
    let that = this;

    // create a map and zoom to the center point.
    var map = new google.maps.Map(document.getElementById("map"), {
      zoom: 7
      //center: { lat: 60.172922, lng: 24.938719 }    //Helsinki Geolocation
    });
    that.directionsDisplay.setMap(map);

    // get the current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(currentPosition) {
          that.currentLocation = {
            lat: currentPosition.coords.latitude,
            lng: currentPosition.coords.longitude
          };
          map.setCenter(that.currentLocation);
          console.log("that.MyLocation: ", that.currentLocation);

          // ==> display the route from "origin" to "destination"
          // if using the private transport
          if (that.onStartFromNewPlace == false) {
            that.origin = that.currentLocation;
          }
          console.log("that.selectedMode: ", that.selectedMode);

          if (that.selectedMode !== "TRANSIT") {
            that.directionsService.route(
              {
                origin: that.origin, // { lat: 60.221492899999994, lng: 24.7788449 }  or 60.2222,24.656 or "Espoo"
                destination: that.destination,
                travelMode: google.maps.TravelMode[that.selectedMode]
              },
              function(response, status) {
                if (status === "OK") {
                  that.directionsDisplay.setDirections(response);
                } else if (
                  status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT
                ) {
                  setTimeout("wait = true", 2000);
                } else {
                  window.alert("Directions request failed due to " + status);
                }
              }
            );
          }
          // if using the public transport
          else {
            that.directionsService.route(
              {
                origin: that.origin, // { lat: 60.221492899999994, lng: 24.7788449 }  or 60.2222,24.656 or "Espoo"
                destination: that.destination,
                travelMode: google.maps.TravelMode[that.selectedMode],
                transitOptions: {
                  departureTime: that.departureTime, // Date Format:  "2019-03-25T22:00:00Z"
                  //arrivalTime: new Date("2019-03-25T22:00:00Z"),
                  modes: [that.vehicle], // BUS, RAIL, SUBWAY, TRAIN, TRAM
                  routingPreference: "FEWER_TRANSFERS" // "FEWER_TRANSFERS" or "LESS_WALKING"
                }
              },
              function(response, status) {
                if (status === "OK") {
                  that.directionsDisplay.setDirections(response);
                } else if (
                  status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT
                ) {
                  setTimeout("wait = true", 2000);
                } else {
                  window.alert("Directions request failed due to " + status);
                }
              }
            );
          }
        },
        function() {}
      );
    } else {
      // Browser doesn't support Geolocation
    }
  }

  openModal() {
    const myModalOptions: ModalOptions = {
      showBackdrop: true,
      enableBackdropDismiss: false
      // enterAnimation?: string;
      // leaveAnimation?: string;
      // cssClass?: string;
    };

    console.log("1onStartFromNewPlace: ", this.onStartFromNewPlace);
    console.log("1origin: ", this.origin);
    console.log("1this.modes: ", this.mode);
    console.log("1this.selectedMode: ", this.selectedMode);
    console.log("1departureTime", this.departureTime);

    let routeData = {
      originGeo:
        this.onStartFromNewPlace == false ? this.currentLocation : this.origin,
      destinationGeo: this.destination,
      mode: this.mode,
      transit_mode: "",
      departure_time: this.departureTime
    };
    console.log("1routeData", routeData);

    let settingMapModal: Modal = this.modal.create(
      "SettingMapPage",
      {
        data: routeData
      },
      myModalOptions
    );
    settingMapModal.present();

    settingMapModal.onWillDismiss(directionLineData => {
      //console.log(directionLineData);
    });

    settingMapModal.onDidDismiss(directionLineData => {
      console.log("directionLineData222", directionLineData);
      this.origin.lat = +directionLineData.origin.split(",")[0];
      this.origin.lng = +directionLineData.origin.split(",")[1];
      this.destination.lat = +directionLineData.destination.split(",")[0];
      this.destination.lng = +directionLineData.destination.split(",")[1];
      this.selectedMode = directionLineData.travelMode;
      console.log("directionLineData.travelMode", directionLineData.travelMode);

      console.log("selectedMode", this.selectedMode);

      this.departureTime = directionLineData.transitOptions.departureTime;
      if (this.selectedMode == "TRANSIT") {
        this.vehicle = directionLineData.transitOptions.modes.toUpperCase();
        console.log(" this.vehicle", this.vehicle);
      }
      if (this.selectedMode == "BICYCLE") {
        this.selectedMode = "BICYCLING";
      }
      this.onStartFromNewPlace = true;
      this.calculateAndDisplayRoute();
    });
  }
}
