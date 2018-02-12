'use strict';
/* global PB2 $ L */

const locateButton = document.querySelector('#locateButton');
let map;
const appID = 'map-demo';
let username;
let userImgURL;
let geoTracker;

console.log('using hostname: '+window.location.hostname);
const pb2 = new PB2(window.location.hostname, appID);

function initSocket(name, img) {
    pb2.setReceiver( function(data) {
        console.log('got data from server: ' + JSON.stringify(data));
        addMarker(data.json.lat, data.json.lon, data.json.username, data.json.userImg, data.me);
    });
}

function onLocationFound(pos) {
    console.log('sending coordinates');
    const msg = {};
    msg.client_name = $('#name').val();
    // msg.app_id = appID;
    msg.time = Date.now();
    msg.lat = pos.coords.latitude;
    msg.lon = pos.coords.longitude;
    msg.username = username;
    msg.userImg = userImgURL;

    pb2.sendJson(msg);
    $('#message').val('');
}

function addMarker(lat, lon, name, imgUrl, me) {
    console.log('adding marker', lat, lon, name, imgUrl, me);
    const img = '<img src='+imgUrl+' />';
    const userIcon = L.divIcon({
        html: img,
        className: 'image-icon',
        popupAnchor: [25, -5],
    });
    console.log('me: '+me);
    let user = me ? name + ' (it\'s you!)' : name;
    L.marker([lat, lon], {icon: userIcon}).addTo(map)
        .bindPopup(user+'<br/>Latitude: ' + lat + '<br/> Longtitude: ' + lon).openPopup();
}

function onLocationError(e) {
    alert(e.message);
}

function getLocation() {
    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);

    map.locate({
        setView: true,
        maxZoom: 16,
    });
}

function init() {
    map = new L.Map('map');
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    map.attributionControl.setPrefix('');

    // map view before we get the location
    map.setView(new L.LatLng(51.505, -0.09), 13);
    getRandomUser();
    initSocket();
}

function toUpperCase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function getRandomUser() {
    fetch('https://randomuser.me/api/')
      .then( (result) => {
        return result.json();
      })
      .then( (jsonresult) => {
        username = toUpperCase(jsonresult.results[0].name.first+' ')+
                        toUpperCase(jsonresult.results[0].name.last);
        userImgURL = jsonresult.results[0].picture.thumbnail;
    });
}

function initGeoTracker() {
    const options = {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0,
    };
    geoTracker = navigator.geolocation.watchPosition(
        onLocationFound, onLocationError, options);
}

locateButton.addEventListener('click', (evt) => {
    initGeoTracker();
});

init();
