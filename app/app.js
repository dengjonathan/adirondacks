// API success flags
var YELP_LOADED = false;
var GOOGLE_LOADED = false;

/* STEP 1: init appViewModel with bindings to DOM*/
var appViewModel = new ViewModel(data);
ko.applyBindings(appViewModel);

/*
STEP 2: ajax call for Google Maps API and once response recieved initialize
  map and bind to appViewModel.map property
*/
$.getScript(GOOGLE_MAPS_URL + SECRETS.getGoogleMapsKey(), function(data, status, jqxhr) {
  console.log('Google Maps API', jqxhr.status, status);
  appViewModel.initMapFeature();
  GOOGLE_LOADED = true;
}).fail(function() {
  var error_msg = 'Google Maps is not working for some reason...'
  appViewModel.error(error_msg);
  setTimeout(function() {
    error_msg += 'Definitely Google\'s fault, not the developer\'s... ';
    appViewModel.error(error_msg);
  }, 1000);
  setTimeout(function() {
    error_msg += 'Try again in a few minutes =(';
    appViewModel.error(error_msg);
  }, 1000);
});

/*
STEP 3: ajax call to Yelp API and once response recieved add Location objects
  to appViewModel and update map markers
*/
$.ajax(getYelpSettings('Keene Valley', 'food')).success(
  function(results, textStatus, jqxhr) {
    console.log('yelp AJAX call', textStatus, jqxhr.status);
    YELP_LOADED = true;
    if (GOOGLE_LOADED) {
      yelpConvert(results, appViewModel);
      appViewModel.addLocations();
    }
  }).fail(function() {
  var error_msg = 'The Yelp API is not working for some reason...'
  error_msg += 'But you can still use the app! =)';
  appViewModel.error(error_msg);
});

// And the monster is alive!!!!
