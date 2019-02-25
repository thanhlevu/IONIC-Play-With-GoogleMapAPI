import { Component } from "@angular/core";
import { IonicPage, NavParams, ViewController } from "ionic-angular";
import { HttpClient } from "@angular/common/http";
import {
  DirectionMapJson,
  LocalAddressJson,
  GeolocationByName,
  DirectionLineData
} from "../../type";

declare var google;
/**
 * Generated class for the SettingMapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-setting-map",
  templateUrl: "setting-map.html"
})
export class SettingMapPage {
  directionMapJson: DirectionMapJson;
  departure_time: string;
  originGeo: string;
  routeData: any;
  vehicle: string;
  routeUrl: string;
  constructor(
    private navParams: NavParams,
    private view: ViewController,
    private http: HttpClient
  ) {}

  ionViewWillLoad() {
    this.routeData = this.navParams.get("data");
    console.log("this.routeData2", this.routeData);
    this.departure_time =
      this.routeData.departure_time.getHours() +
      ":" +
      this.routeData.departure_time.getMinutes();
    this.vehicle = "Car";
    //this.originGeo = this.routeData.originGeo;
    this.getRouteInfo();
  }

  //to get the location's info by Geolocation ==> https://maps.googleapis.com/maps/api/geocode/json?latlng=60.221501,%2024.778792&key=AIzaSyAj6v6LHIeWH3B-Il-AZiXuhMWq3hHsQu8

  //to get the location's info by name ==> https://maps.googleapis.com/maps/api/geocode/json?address=helsinki&key=AIzaSyAj6v6LHIeWH3B-Il-AZiXuhMWq3hHsQu8
  getRouteInfo() {
    //set the new departure time for the route
    this.routeData.departure_time.setHours(this.departure_time.split(":")[0]);
    this.routeData.departure_time.getMinutes(this.departure_time.split(":")[1]);

    //Get The Route's Info AIzaSyAj6v6LHIeWH3B-Il-AZiXuhMWq3hHsQu8    ====     AIzaSyDHY3SLJrzEYN-nWVsI5ix4dU1hrL5TJ3o
    //https://maps.googleapis.com/maps/api/directions/json?origin=60.221501, 24.778792&destination=helsinky&mode=transit&transit_mode=train&departure_time=now&key=AIzaSyDHY3SLJrzEYN-nWVsI5ix4dU1hrL5TJ3o

    //check if the user wants to start from somewhere else
    console.log("2this.destinationGeo", this.routeData.destinationGeo);
    if (this.originGeo) {
      //locating by name is less accurate than by geolocation
      this.routeUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${
        this.originGeo
      }
        &destination=${this.routeData.destinationGeo.lat}, ${
        this.routeData.destinationGeo.lng
      }`;
    } else {
      this.routeUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${
        this.routeData.originGeo.lat
      }, ${this.routeData.originGeo.lng}
      &destination=${this.routeData.destinationGeo.lat}, ${
        this.routeData.destinationGeo.lng
      }`;
    }
    console.log("2this.routeUrl", this.routeUrl);

    switch (this.vehicle) {
      case "Car": {
        this.routeUrl += "&mode=driving";
        break;
      }
      case "Walking": {
        this.routeUrl += "&mode=walking";
        break;
      }
      case "Bike": {
        this.routeUrl += "&mode=bicycle";
        break;
      }
      case "Bus": {
        this.routeUrl += "&mode=transit&transit_mode=bus";
        break;
      }
      case "Train": {
        this.routeUrl += "&mode=transit&transit_mode=train";
        break;
      }
      case "Rail": {
        this.routeUrl += "&mode=transit&transit_mode=rail";
        break;
      }
      case "Metro": {
        this.routeUrl += "&mode=transit&transit_mode=subway";
        break;
      }
    }
    console.log("2this.routeUrl", this.routeUrl);

    // set the departure time if using the public transport
    if (this.routeUrl.includes("&mode=transit&")) {
      this.routeUrl += `&departure_time=${Math.round(
        this.routeData.departure_time.getTime() / 1000
      )}&key=AIzaSyAj6v6LHIeWH3B-Il-AZiXuhMWq3hHsQu8`;
    } else {
      this.routeUrl += `&departure_time=${this.routeData.departure_time.getTime()}&key=AIzaSyAj6v6LHIeWH3B-Il-AZiXuhMWq3hHsQu8`;
    }
    // https://maps.googleapis.com/maps/api/directions/json?origin=60.22149729999999, 24.778862399999998
    // &destination=60.259639, 24.845552&mode=transit&transit_mode=bus&departure_time=1550989407792&key=AIzaSyAj6v6LHIeWH3B-Il-AZiXuhMWq3hHsQu8
    // https://maps.googleapis.com/maps/api/directions/json?origin=60.221501,%2024.778792&destination=helsinky&mode=transit&transit_mode=bus&departure_time=now&key=AIzaSyAj6v6LHIeWH3B-Il-AZiXuhMWq3hHsQu8
    console.log("routeUrls: ", this.routeUrl);

    this.http
      .get(this.routeUrl)
      .subscribe((directionData: DirectionMapJson) => {
        this.directionMapJson = directionData;

        if (directionData.routes[0]) {
          for (
            let j = 0;
            j < directionData.routes[0].legs[0].steps.length;
            j++
          ) {
            let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${
              directionData.routes[0].legs[0].steps[j].start_location.lat
            },${
              directionData.routes[0].legs[0].steps[j].start_location.lng
            }&key=AIzaSyAj6v6LHIeWH3B-Il-AZiXuhMWq3hHsQu8`;

            this.http.get(url).subscribe((localAddress: LocalAddressJson) => {
              let that = this;
              that.directionMapJson.routes[0].legs[0].steps[
                j
              ].start_location_address =
                localAddress.results[0].formatted_address;
            });

            //set the Icon for travel mode
            switch (
              this.directionMapJson.routes[0].legs[0].steps[j].travel_mode
            ) {
              case "WALKING": {
                this.directionMapJson.routes[0].legs[0].steps[j].travel_icon =
                  "walk";
                break;
              }
              case "DRIVING": {
                if (this.vehicle == "undefined" || "Car") {
                  this.directionMapJson.routes[0].legs[0].steps[j].travel_icon =
                    "car";
                }
                if (this.vehicle == "Bike") {
                  this.directionMapJson.routes[0].legs[0].steps[j].travel_icon =
                    "bicycle";
                }
                break;
              }
              case "BICYCLING": {
                this.directionMapJson.routes[0].legs[0].steps[j].travel_icon =
                  "bicycle";

                break;
              }
              case "TRANSIT": {
                switch (
                  this.directionMapJson.routes[0].legs[0].steps[j]
                    .transit_details.line.vehicle.type
                ) {
                  case "BUS": {
                    this.directionMapJson.routes[0].legs[0].steps[
                      j
                    ].travel_icon = "bus";

                    this.directionMapJson.routes[0].legs[0].steps[
                      j
                    ].travel_mode =
                      "BUS " +
                      this.directionMapJson.routes[0].legs[0].steps[j]
                        .transit_details.line.short_name;
                    break;
                  }

                  case "COMMUTER_TRAIN" || "TRAM" || "RAIL": {
                    this.directionMapJson.routes[0].legs[0].steps[
                      j
                    ].travel_icon = "train";

                    this.directionMapJson.routes[0].legs[0].steps[
                      j
                    ].travel_mode =
                      "TRAIN " +
                      this.directionMapJson.routes[0].legs[0].steps[j]
                        .transit_details.line.short_name;
                    break;
                  }
                  case "SUBWAY": {
                    this.directionMapJson.routes[0].legs[0].steps[
                      j
                    ].travel_icon = "subway";

                    this.directionMapJson.routes[0].legs[0].steps[
                      j
                    ].travel_mode =
                      "SUBWAY " +
                      this.directionMapJson.routes[0].legs[0].steps[j]
                        .transit_details.line.short_name;
                    break;
                  }
                  case "FERRY": {
                    this.directionMapJson.routes[0].legs[0].steps[
                      j
                    ].travel_icon = "boat";

                    this.directionMapJson.routes[0].legs[0].steps[
                      j
                    ].travel_mode =
                      "SHIP" +
                      this.directionMapJson.routes[0].legs[0].steps[j]
                        .transit_details.line.short_name;
                    break;
                  }
                }
              }
            }
          }
        }
      });
  }

  closeModal() {
    let directionLineData = {
      origin: this.routeUrl.split("origin=")[1].split("&destination")[0],
      destination: this.routeUrl.split("&destination=")[1].split("&")[0],
      travelMode: this.routeUrl
        .split("&mode=")[1]
        .split("&")[0]
        .toUpperCase(),
      transitOptions: {
        departureTime: this.routeData.departure_time,
        //arrivalTime: this.routeUrl.split("&arrival_time=")[1].split("&")[0],
        modes:
          this.routeUrl.split("&mode=")[1].split("&")[0] == "transit"
            ? [this.routeUrl.split("&transit_mode=")[1].split("&")[0]]
            : "", // BUS, RAIL, SUBWAY, TRAIN, TRAM
        routingPreference: "LESS_WALKING" // "FEWER_TRANSFERS" or "LESS_WALKING"
      }
    };
    console.log("directionLineDatadd ", directionLineData);
    this.view.dismiss(directionLineData);
  }
}
