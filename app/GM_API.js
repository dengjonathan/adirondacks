/* This module makes async call to the Google Maps API are binds Map Instance
to viewmodel.map property and displays map in DOM in div with id='map'.

This module can be called with the global function initMap

  *requires: ViewModel instance, google maps API key stored in secrets
  *returns: Map Instance bound to ViewModel property and displayed in DOM
    and adds markers to map
 */

var GOOGLE_MAPS_URL = 'https://maps.googleapis.com/maps/api/js?key=';
GOOGLE_MAPS_URL += SECRETS.getGoogleMapsKey();

var MAP_DIV = document.getElementById('map');

// var add_markers = function(mapDiv, options) {
//   this.addMarkers = function(locations) {
//     locations.forEach(function(location) {
//       location.marker.setAnimation(google.maps.Animation.DROP);
//       location.marker.setMap(self.map);
//     });
//   };
// };

/* async API call, init Map and addMarkers once it returns */
function initMap(viewModel) {
  $.when(
    $.getScript(GOOGLE_MAPS_URL, function(data, textStatus, jqxhr) {
      console.log('Google Maps API', jqxhr.status, textStatus);
    })).then(
    function() {
      viewModel.map = new google.maps.Map(MAP_DIV, {
        center: viewModel.center(),
        zoom: 11,
        mapTypeId: google.maps.MapTypeId.HYBRID
      });
      //   viewModel.map.addMarkers = add_markers;
    });
}
initMap(appViewModel);
