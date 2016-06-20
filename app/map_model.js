var CENTER_COORD = {
  lat: 44.1899178,
  lng: -73.7866135
};

var map;

function initMap() {
  console.log('Google Map Initiating');

  var mapDiv = document.getElementById('map');

  var mapOptions = {
    center: CENTER_COORD,

    zoom: 12,
    draggable: true,
    mapTypeId: google.maps.MapTypeId.HYBRID
  };

  map = new google.maps.Map(mapDiv, mapOptions);

  // event listeners
  $(window).resize(function() {
    google.maps.event.trigger(map, 'resize');
  });

};

var icons = {
  climb: 'images/gear.jpeg',
  food: 'images/food.png',
  gear: 'images/gear.jpeg',
  camp: 'images/camp.jpeg'
}

// TODO: make custom info window for every maker
var infowindow = new google.maps.InfoWindow({
  content: 'contentString'
});

// Google Map marker constructor
var Marker = function(name, lat, lng, loc_type) {
  // FIXME: how to constructor to select correct icon?
  var icon = icons[loc_type];
  var new_mark = new google.maps.Marker({
    name: name,
    position: {
      lat: lat,
      lng: lng
    },
    animation: google.maps.Animation.DROP,
    icon: icon,
  });
  // new_mark.addListener('click', toggleBounce); //TODO; add some useful feature for listeners
  new_mark.addListener('click', function() {
    infowindow.open(map, new_mark);
  });
  return new_mark;
};


// // snippet to take markers off map
// marker.setMap(null);
