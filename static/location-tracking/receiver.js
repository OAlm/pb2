'use strict';
/* global $ PB2 document L */
const pb2 = new PB2(window.location.hostname, 'location-tracking-demo');
pb2.setReceiver(onMessage);

let map;
let marker;

let users = {};
function updateMarker(userid, username, lat, lon) {
    console.log('add marker '+lat+' '+lon);
    console.log(map);

    if(userid in users) {
        map.removeLayer(users[userid]);
    }
    marker = new L.marker([lat, lon]);
    marker.addTo(map)
        .bindPopup(username+' <br/>Latitude: ' + lat + '<br/> Longtitude: ' + lon).
        openPopup();
    users[userid] = marker;
}

function onMessage(data) {
    // const c = pos.coords;
    console.log(data);
    updateMarker(data.socketid, data.json.user, data.json.lat, data.json.lon);
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
    initMap();
});
