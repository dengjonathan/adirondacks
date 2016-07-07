/* This module makes async calls to APIs to populate data into viewModel.
//FIXME

   initMap {function} - makes call to the Google Maps API, binds Map Instancevto viewmodel.map property
    and displays map in DOM in div with id='map'.

    getYelp {function} - makes call to Yelp API and returns array of location objects populated with data
     from yelp
*/

var GOOGLE_MAPS_URL = 'https://maps.googleapis.com/maps/api/js?key=';
var MAP_DIV = document.getElementById('map');

/* Initializes map and binds to viewModel
  @requires google Maps API script
  @param {object} ViewModel: KO viewModel instance
*/
function initMap(viewModel) {
  //create new google map object
  viewModel.map = new google.maps.Map(MAP_DIV, {
    center: viewModel.center,
    zoom: 11,
    mapTypeId: google.maps.MapTypeId.HYBRID
  });
  viewModel.map.addMarkers = function() {
    var self = this;
    viewModel.filtered_locations().forEach(function(location) {
      location.marker.setAnimation(google.maps.Animation.DROP);
      location.marker.setMap(self);
    });
  };
  viewModel.map.hideMarkers = function() {
    viewModel.filtered_locations().forEach(function(location) {
      location.marker.setVisible(false);
    });
  };
  viewModel.map.showMarkers = function() {
    viewModel.filtered_locations().forEach(function(location) {
      location.marker.setAnimation(google.maps.Animation.DROP);
      location.marker.setVisible(true);
    });
  };
  viewModel.map.addMarkers(viewModel.locations());
}

/*
Provides settings object for API call to Yelp API
  @param {string} location - name of location to center search
  @param {string} term - search term

  @returns {object} settings - settings for ajax call to yelp
*/
function getYelpSettings(location, term) {
  var yelp_url = 'https://api.yelp.com/v2/search?',
    consumerSecret = SECRETS.getConsumerSecret(),
    tokenSecret = SECRETS.getTokenSecret(),
    httpMethod = 'GET';

  var parameters = {
    oauth_consumer_key: SECRETS.getConsumerKey(),
    oauth_token: SECRETS.getOAuthToken(),
    oauth_nonce: (Math.floor(Math.random() * 1e12).toString()),
    oauth_timestamp: Math.floor(Date.now() / 1000),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_version: '1.0',
    callback: 'cb',
    term: term.replace(' ', '+'),
    location: location.replace(' ', '+'),
    radius: '40000'
  };

  var encodedSignature = oauthSignature.generate(
    'GET',
    yelp_url,
    parameters,
    consumerSecret,
    tokenSecret);

  parameters.oauth_signature = encodedSignature;

  var yelp_settings = {
    url: yelp_url,
    data: parameters,
    cache: true, // self is crucial to include as well to prevent jQuery from adding on a cache-buster parameter "_=23489489749837", invalidating our oauth-signature
    dataType: 'jsonp'
  };
  return yelp_settings
}

/*
Converts Yelp API results into Location Objects for viewModel
    @param {array} results - array of objects returned from Yelp API
    @param {object} ViewModel: KO viewModel instance
*/
function yelpConvert(results, viewModel) {
  results.businesses.forEach(function(e) {
    var arg = {
      name: e.name,
      position: {
        lat: e.location.coordinate.latitude,
        lng: e.location.coordinate.longitude
      },
      desc: e.snippet_text,
      loc_type: 'food',
      phone: e.display_phone,
      image_url: e.image_url,
      mobile_url: e.mobile_url,
      rating: e.rating,
    };
    appViewModel.locations.push(new Location(arg));
  });
}
