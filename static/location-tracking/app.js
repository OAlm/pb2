'use strict';
/* global $ PB2 navigator document L */
const pb2 = new PB2(window.location.hostname, 'location-tracking-demo');
//pb2.setReceiver(onMessage);

let map;
let marker;

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(onLocation, error);
    } else {
        $('#coords').text('Geolocation is not supported by this browser.');
    }
}

function addMarker(name, lat, lon) {
    console.log('add marker '+lat+' '+lon);
    console.log(map);
    marker = new L.marker([lat, lon]); 
    marker.addTo(map)
        .bindPopup(name+' <br/>Latitude: ' + lat + '<br/> Longtitude: ' + lon).
        openPopup();
}

function onLocation(pos) {
    const c = pos.coords;
    console.log(c);
    const user = $('#name').val();
    const loc =
        {
          user: user,
          lat: c.latitude,
          lon: c.longitude,
          accuracy: c.accuracy,
          heading: c.heading,
          speed: c.speed,
          altitude: c.altitude,
          altitudeAccuracy: c.altitudeAccuracy,
        };
    if(marker) {
        map.removeLayer(marker);
    }
    addMarker(user, c.latitude, c.longitude);
    // map.setView(new L.LatLng(c.latitude, c.longitude), 13);
    pb2.sendJson(loc);
}

function error(err) {
  console.warn('ERROR(' + err.code + '): ' + err.message);
}


function initMap() {
    map = new L.Map('map');
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    map.attributionControl.setPrefix('');

    // map view before we get the location
    map.setView(new L.LatLng(51.505, -0.09), 13);
}

$(document).ready(function() {
    $('#name').val('Unknown traveller');
    initMap();
    getLocation();
});
