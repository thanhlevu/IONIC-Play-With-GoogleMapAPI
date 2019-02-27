# IONIC-Play-With-GoogleMapAPI
IONIC-Play-With-GoogleMapAPI

$ ionic cordova plugin add cordova-plugin-geolocation
$ npm install --save @ionic-native/geolocation@4
$ ionic cordova plugin add cordova-plugin-google-nearby --variable API_KEY="AIzaSyAj6v6LHIeWH3B-Il-AZiXuhMWq3hHsQu8"
$ npm install --save @ionic-native/google-nearby@4

// to find out where is the error
npm install rxjs@6 rxjs-compat@6 --save npm install @ionic-native/core@5.0.0-beta.14
npm install --save @ionic-native/calendar@5.0.0-beta.14 
npm install --save @ionic-native/status-bar@5.0.0-beta.14

// ==> to get the location's info by Geolocation ==> https://maps.googleapis.com/maps/api/geocode/json?latlng=60.221501,%2024.778792&key=AIzaSyAj6v6LHIeWH3B-Il-AZiXuhMWq3hHsQu8

// ==> to get the location's info by name ==> https://maps.googleapis.com/maps/api/geocode/json?address=helsinki&key=AIzaSyAj6v6LHIeWH3B-Il-AZiXuhMWq3hHsQu8

// ==> Get The Route's Info AIzaSyAj6v6LHIeWH3B-Il-AZiXuhMWq3hHsQu8    ====     AIzaSyDHY3SLJrzEYN-nWVsI5ix4dU1hrL5TJ3o

// ==> https://maps.googleapis.com/maps/api/directions/json?origin=60.221501, 24.778792&destination=helsinky&mode=transit&transit_mode=train&departure_time=now&key=AIzaSyDHY3SLJrzEYN-nWVsI5ix4dU1hrL5TJ3o

// ==> https://maps.googleapis.com/maps/api/directions/json?origin=60.22149729999999,24.778862399999998&destination=60.259639, 24.845552&mode=transit&transit_mode=bus&departure_time=1550989407792&key=AIzaSyAj6v6LHIeWH3B-Il-AZiXuhMWq3hHsQu8
 
// ==> https://maps.googleapis.com/maps/api/directions/json?origin=60.221501,%2024.778792&destination=helsinky&mode=transit&transit_mode=bus&departure_time=now&key=AIzaSyAj6v6LHIeWH3B-Il-AZiXuhMWq3hHsQu8
