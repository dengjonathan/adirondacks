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
  $(window).resize(function(){
    google.maps.event.trigger(map, 'resize');
  });

};

var icons = {climb: 'images/climb.jpeg', food: 'images/food.png',
              gear: 'images/gear.jpeg', camp: 'images/camp.jpeg'}

// Google Map marker constructor
var Marker = function(name, lat, lng, loc_type) {
  // FIXME: how to constructor to select correct icon?
  var icon = icons[loc_type];
  console.log(icons[loc_type]);
  var new_mark = new google.maps.Marker({
    name: name,
    position: {
      lat: lat,
      lng: lng
    },
    animation: google.maps.Animation.DROP,
    icon: icon,
  });
  new_mark.addListener('click', toggleBounce); //TODO; add some useful feature for listeners
  return new_mark;
};

// google place holder funciton to add bounce
function toggleBounce(marker) {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}
// // snippet to take markers off map
// marker.setMap(null);
