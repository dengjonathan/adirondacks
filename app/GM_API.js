$.getScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyD7QeUbl2kO7TPllayriD04AkBdkoqBTWw', initMap)

function initMap() {
  console.log('this called');
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: -34.397,
      lng: 150.644
    },
    zoom: 8
  });
}
