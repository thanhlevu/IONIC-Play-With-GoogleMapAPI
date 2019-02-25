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
  vehicle: [string];
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

          // ==> measure the Distance between 2 geolocation points
          /*  console.log(
            "Radius: ",
            that.getDistanceFromLatLonInKm(
              60.211127,
              24.65591,
              60.187734,
              24.940871
            )
          ); */

          // ==> measure the Distance between 2 geolocation points.
          /* var loc1 = new google.maps.LatLng({ lat: 60.211127, lng: 24.65591 }); // ({ lat: 60.2222, lng: 24.656 })  or (60.2222,24.656)
          var loc2 = new google.maps.LatLng(60.187734, 24.940871);
          console.log(
            "Distance(m): ",
            google.maps.geometry.spherical.computeDistanceBetween(loc1, loc2)
          ); */

          // ==> display the route from "origin" to "destination"
          // if using the public transport
          if (that.onStartFromNewPlace == false) {
            that.origin = that.currentLocation;
          }

          if (that.selectedMode !== "TRANSIT") {
            that.directionsService.route(
              {
                origin: that.origin, // { lat: 60.221492899999994, lng: 24.7788449 }  or 60.2222,24.656 or "Espoo"
                destination: that.destination,
                travelMode: google.maps.TravelMode[that.selectedMode]
                //   transitOptions: {
                //     departureTime: new Date("now"), // Date Format:  "2019-03-25T22:00:00Z"
                //     arrivalTime: new Date("2019-03-25T22:00:00Z"),
                //     modes: ["TRAIN"], // BUS, RAIL, SUBWAY, TRAIN, TRAM
                //     routingPreference: "FEWER_TRANSFERS" // "FEWER_TRANSFERS" or "LESS_WALKING"
                //   }
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
          // if using the private transport
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

          //Get The Route's Info
          //https://maps.googleapis.com/maps/api/directions/json?origin=60.221501, 24.778792&destination=helsinky&mode=transit&transit_mode=train&departure_time=now&key=AIzaSyAj6v6LHIeWH3B-Il-AZiXuhMWq3hHsQu8
          /*           let url = `https://maps.googleapis.com/maps/api/directions/json?origin=${
            that.MyLocation.lat
          },${
            that.MyLocation.lng
          }&destination=helsinky&mode=transit&transit_mode=train&departure_time=now&key=AIzaSyAj6v6LHIeWH3B-Il-AZiXuhMWq3hHsQu8`;
          console.log("url: " + url);
          that.http.get(url).subscribe((data: DirectionMapJson) => {
            console.log(
              data.routes[0].legs[0].departure_time.text,
              data.routes[0].legs[0].duration.text
            );
            for (var j = 0; j < data.routes[0].legs[0].steps.length; j++) {
              if (data.routes[0].legs[0].steps[j].transit_details) {
                console.log(
                  data.routes[0].legs[0].steps[j].transit_details.departure_time
                    .text,
                  data.routes[0].legs[0].steps[
                    j
                  ].transit_details.line.vehicle.type.split("_")[1],
                  data.routes[0].legs[0].steps[j].transit_details.line
                    .short_name
                );
              } else {
                console.log(data.routes[0].legs[0].steps[j].travel_mode);
              }
              console.log(
                data.routes[0].legs[0].steps[j].distance.text,
                data.routes[0].legs[0].steps[j].duration.text
              );
            }
            console.log(data.routes[0].legs[0].arrival_time.text);
          }); */
        },
        function() {}
      );
    } else {
      // Browser doesn't support Geolocation
    }
  }

  /*   initMap() {
    this.geolocation
      .getCurrentPosition()
      .then(resp => {
        // resp.coords.latitude
        // resp.coords.longitude
        //60.221501, 24.778792   = kilorinne
        let coords = new google.maps.LatLng(
          resp.coords.latitude,
          resp.coords.longitude
        );
        //https://maps.googleapis.com/maps/api/directions/json?origin=60.221501, 24.778792&destination=helsinky&mode=transit&transit_mode=train&departure_time=now&key=AIzaSyDHY3SLJrzEYN-nWVsI5ix4dU1hrL5TJ3o
        let url = `https://maps.googleapis.com/maps/api/directions/json?origin=${
          resp.coords.latitude
        },${
          resp.coords.longitude
        }&destination=helsinky&key=AIzaSyAj6v6LHIeWH3B-Il-AZiXuhMWq3hHsQu8`;
        console.log("url: " + url);
        this.http.get(url).subscribe(data => {
          console.log("data: ", data);
        });

        let mapOptions: google.maps.MapOptions = {
          center: coords,
          zoom: 10,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        this.map = new google.maps.Map(
          this.mapElement.nativeElement,
          mapOptions
        );

        let marker: google.maps.Marker = new google.maps.Marker({
          map: this.map,
          position: coords
        });

        let coords2 = new google.maps.LatLng(
          resp.coords.latitude + 100,
          resp.coords.longitude + 100
        );
        let marker2: google.maps.Marker = new google.maps.Marker({
          map: this.map,
          position: coords2
        });

        console.log(
          "Radius: ",
          this.getDistanceFromLatLonInKm(
            resp.coords.latitude,
            resp.coords.longitude,
            resp.coords.latitude + 100,
            resp.coords.longitude + 100
          )
        );
      })
      .catch(error => {
        console.log("Error getting location", error);
      });

    let watch = this.geolocation.watchPosition();
    watch.subscribe(data => {
      // data can be a set of coordinates, or an error (if an error occurred).
      // data.coords.latitude
      // data.coords.longitude
    });
  } */

  // measure the Distance between 2 geolocation points by using Math Formular
  /*   deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
  getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2 - lat1); // deg2rad below
    var dLon = this.deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  } */

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
      console.log("selectedMode", this.selectedMode);

      this.departureTime = directionLineData.transitOptions.departureTime;
      if (this.selectedMode == "")
        this.vehicle = directionLineData.transitOptions.modes;
      this.onStartFromNewPlace = true;
      this.calculateAndDisplayRoute();
    });
  }
}
