/* eslint-disable no-unused-vars, no-shadow-global */
/* globals google firebase */

// Global Variables
var map;

function generateMarker({ position, icon, title }) {
  return new google.maps.Marker({
    position, icon, title, map,
    animation: google.maps.Animation.DROP,
  });
}

function generateInfo({contentString, marker}) {
  return new google.maps.InfoWindow({
    content: contentString
  });
}

function makeInfoBox(controlDiv, map) {
  // Set CSS for the control border.
  var controlUI = document.createElement('div');
  controlUI.style.boxShadow = 'rgba(0, 0, 0, 0.298039) 0px 1px 4px -1px';
  controlUI.style.backgroundColor = '#fff';
  controlUI.style.border = '2px solid #fff';
  controlUI.style.borderRadius = '2px';
  controlUI.style.marginBottom = '22px';
  controlUI.style.marginTop = '10px';
  controlUI.style.textAlign = 'center';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior.
  var controlText = document.createElement('div');
  controlText.style.color = 'rgb(25,25,25)';
  controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
  controlText.style.fontSize = '100%';
  controlText.style.padding = '6px';
  controlText.textContent =
      'Fra færgen ankommer i Oslo mandag 13/7 kl 9.00 til færgen afgår i Kristiansand torsdag 16/7 kl 20.15 modtager dette kort live opdateringer med små lydklip fra vejen.';
  controlUI.appendChild(controlText);

  var controlText2 = document.createElement('div');
  controlText2.style.color = 'rgb(25,25,25)';
  controlText2.style.fontFamily = 'Roboto,Arial,sans-serif';
  controlText2.style.fontSize = '100%';
  controlText2.style.padding = '6px';
  controlText2.textContent =
      'Ruten er indtegnet på kortet med rød og undervejs vil der poppe lyseblå markers op langs ruten. Klik på dem for at læse infomation om stedet og høre min fortælling';
  controlUI.appendChild(controlText2);

  var controlText3 = document.createElement('div');
  controlText3.style.color = 'rgb(25,25,25)';
  controlText3.style.fontFamily = 'Roboto,Arial,sans-serif';
  controlText3.style.fontSize = '100%';
  controlText3.style.padding = '6px';
  controlText3.textContent =
      'Har du feedback eller ønsker du at heppe på mig undervejs, skriv mig en mail på christiangraver@gmail.com';
  controlUI.appendChild(controlText3);
}

function generateContentString({author, town, dateString, alt, condition, temp, wind_speed, wind_direction, audio_url}) {
  return `<div id="content">`+
      `<div id="siteNotice">`+
      `</div>`+
      `<h2 id="firstHeading" class="firstHeading">${dateString}</h2>`+
      `<div id="bodyContent">`+
      `<p><b>Rytter:</b> ${author}<br />` +
      `<b>By:</b> ${town}<br />` +
      `<b>Højde over havet:</b> ${alt}m<br />` +
      `<b>Temperatur:</b> ${temp}<br />` +
      `<b>Vejrforhold:</b> ${condition}<br />` +
      `<b>Vindhastighed:</b> ${wind_speed}<br />` +
      `<b>Vindretning:</b> ${wind_direction} grader</p>` +
      `<p><a href="${audio_url}" target="_blank">Tryk her for at lytte</a></p>`+
      `</div>`+
      `</div>`;
}

function drawPolyline({ directionResult }) {
  return new google.maps.Polyline({
    path: google.maps.geometry.encoding.decodePath(directionResult.routes[0].overview_polyline),
    geodesic: true, strokeColor: '#00bcd4', strokeOpacity: 1.0, strokeWeight: 2, map
  });
}

// Map Initialize
function initMap() {
  console.log('Started initMap');
  
  //Add custom style to map
  var styledMapType = new google.maps.StyledMapType(
    [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ebe3cd"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#523735"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f1e6"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#c9b2a6"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#dcd2be"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#ae9e90"
      }
    ]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#93817c"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#a5b076"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#447530"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f1e6"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#fdfcf8"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f8c967"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#e9bc62"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e98d58"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#db8555"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#806b63"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8f7d77"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#ebe3cd"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#b9d3c2"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#92998d"
      }
    ]
  }
],
            {name: 'Adventure'});


  //Init center
  const initLocation = new google.maps.LatLng(55.697802, 12.506379);

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: initLocation,
    mapTypeControlOptions: {
            mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain','styled_map']}
  });

  //Associate the styled map with the MapTypeId and set it to display.
  map.mapTypes.set('styled_map', styledMapType);
  map.setMapTypeId('styled_map');

  generateMarker({
      position: initLocation,
      icon: '/images/dashboard/placemarker_red.png', 
      title: 'Center'
  })


  // Add route
  var src = 'https://storage.googleapis.com/spoken-c4172.appspot.com/route/Oslo-Kristiansand.kml';
  var kmlLayer = new google.maps.KmlLayer(src, {
          suppressInfoWindows: true,
          preserveViewport: false,
          map: map
        });

  //Start and end markers
  const start = new google.maps.LatLng(59.903757, 10.743548);
  const end = new google.maps.LatLng(58.144273, 7.985135);


  var startMarker = new google.maps.Marker({
    position: start, 
    label: 'Start',
    title: 'Start',
    map: map
  });

  var endMarker = new google.maps.Marker({
    position: end, 
    label: 'Slut',
    title: 'slut',
    map: map
  });

  // Create the DIV to hold the control and call the makeInfoBox() constructor
  // passing in this DIV.
  var infoBoxDiv = document.createElement('div');
  makeInfoBox(infoBoxDiv, map);
  map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(infoBoxDiv);


  var db = firebase.firestore();

  db.collection("impressions").where("author", "==", "Christian")
    .onSnapshot(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            console.log("Impression:", doc.data());
            var newImpression = doc.data();
            
            // Geo point of impression
            var point = new google.maps.LatLng(newImpression.lat, newImpression.lon);
            
            // Info

            //Add the point to the map.
            var newMarker = generateMarker({
              position: point,
              icon: '/images/dashboard/placemarker_blue.png', 
              title: 'Impression'
            })

            var contentString = generateContentString({
              author: newImpression.author,
              town: newImpression.town,
              dateString: newImpression.created, 
              alt: newImpression.alt.toFixed(2), 
              condition: newImpression.condition, 
              temp: newImpression.temperatur, 
              wind_speed: newImpression.wind_speed, 
              wind_direction: newImpression.wind_direction,
              audio_url: newImpression.audio_url
            })

            var infowindow = generateInfo({
              contentString: contentString, 
              marker: newMarker
            })

            newMarker.addListener('click', function() {
              infowindow.open(map, newMarker);
            });
    });
});
}
