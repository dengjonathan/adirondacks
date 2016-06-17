var CENTER_COORD = {
  lat: 44.1899178,
  lng: -73.7866135
};

function initMap() {
  console.log('Google Map Initiating');
  
  var mapDiv = document.getElementById('map');

  var mapOptions = {
    center: CENTER_COORD,
    zoom: 12,
    draggable: true
  };

  var map = new google.maps.Map(mapDiv, mapOptions);

  var marker = new google.maps.Marker({
    position: CENTER_COORD,
    title: "Hello World!"
  });

  marker.setMap(map);
};
