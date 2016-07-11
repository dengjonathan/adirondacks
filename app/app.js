(function() {
  "use strict";

  /*
  ***MODEL***
  This section contains initial data (which would be requested from DB
  in a server side app) as well as constructors for objects used by the
  viewModel
  */

  // initial data to be loaded into viewModel
  var data = JSON.parse(database);

  /*
    @constructor
    @param {object} arg: properties of location object
  */
  var Location = function(arg) {
    var self = this;
    self.name = ko.observable(arg.name);
    this.position = {
      lat: ko.observable(arg.position.lat),
      lng: ko.observable(arg.position.lng)
    };
    this.desc = ko.observable(arg.desc);
    this.loc_type = ko.observable(arg.loc_type);
    this.icon = LOC_ICONS[this.loc_type()];

    // data only available for locations loaded from Yelp API
    this.phone = ko.observable(arg.phone || 'Info unavailable for this location.');
    this.image_url = ko.observable(arg.image_url);
    this.mobile_url = ko.observable(arg.mobile_url || 'Info unavailable for this location.');
    this.rating = ko.observable(arg.rating || 'Info unavailable for this location.');

    // Each location has a google map marker
    this.marker = new Marker(this.name(), this.position, this.loc_type());
    // hard code the contents of the infowindow
    var content = '<h2><a href="' + this.mobile_url() + '">' + this.name() + '</a></h2>';
    content += '<p>' + this.desc() + '</p>';
    content += '<p>Phone: ' + this.phone() + '</p>';
    content += '<p data-bind="text: status">Yelp Rating: ' + this.rating() + '</p>';
    content += this.image_url() ? '<img src="' + this.image_url() + '">' : '<p>No Image Available for this location</p>';
    this.infowindow = new google.maps.InfoWindow({
      content: content
    });
    // when marker is clicked will open up info window
    this.marker.addListener('click', this.openWindow.bind(this));
  };

  Location.prototype.openWindow = function() {
    var view_model = appViewModel;
    toggleBounce(this.marker);
    if (view_model.selectedLocation()) {
      view_model.selectedLocation().infowindow.close();
      toggleBounce(view_model.selectedLocation().marker);
    }
    view_model.selectedLocation(this);
    this.infowindow.open(map, this.marker);
  };

  // Reference to marker icons
  var LOC_ICONS = {
    climb: 'images/climb.gif',
    food: 'images/food.png',
  };

  /*
    @constructor
    @param {string} name
    @param {object} position: obj with properties lat, lng
    @param {string} loc_type: 'climb' or 'food'
  */
  var Marker = function(name, position, loc_type) {
    var icon = LOC_ICONS[loc_type];
    return new google.maps.Marker({
      name: name,
      position: {
        lat: position.lat(),
        lng: position.lng()
      },
      animation: google.maps.Animation.DROP,
      icon: icon,
    });
  };

  function toggleBounce(marker) {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
    }
  }

  /*
  ***API-CALLS***
  This section includes helper functions for async calls in app.js
  */
  var GOOGLE_MAPS_URL = 'https://maps.googleapis.com/maps/api/js?key=';
  var MAP_DIV = document.getElementById('map');

  /*
  Initializes map and binds to viewModel
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
    return yelp_settings;
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

  /*
    ViewModel constructor
  */
  function ViewModel() {
    var self = this;
    self.locations = ko.observableArray([]);
    self.center = {
      lat: 44.1992034912109,
      lng: -73.786865234375
    };
    self.map = {};
    self.query = ko.observable('');
    self.selectedLocation = ko.observable('');
    self.filtered_locations = ko.observableArray(self.locations());
    self.error = ko.observable();
  }

  //viewmodel methods
  ViewModel.prototype = {

    // load all initial climbing locations from data model
    loadData: function() {
      var self = this;
      data.forEach(function(e) {
        self.locations.push(new Location(e));
      });
    },

    // updates markers on map and list in response to search term
    search: function(value) {
      this.map.hideMarkers();
      var locations = this.locations();
      if (value) {
        this.filtered_locations(
          locations.filter(function(each) {
            return each.name().toLowerCase().indexOf(value.toLowerCase()) > -1;
          })
        );
      } else {
        this.filtered_locations(locations);
      }
      this.map.showMarkers(this.filtered_locations());
    },

    // initializies ViewModel with map and adds markers
    initMapFeature: function() {
      this.loadData();
      this.filtered_locations(this.locations());
      initMap(this);
      this.map.addMarkers(this.locations());
      this.query.subscribe(this.search.bind(this));
    },

    /* updates locations list and map markers when locations added, i.e.
     when Yelp API returns locations */
    addLocations: function() {
      this.filtered_locations(this.locations());
      this.map.addMarkers(this.locations());
    }
  };

  /*
    ***APP***
    This section:
      1. Initializes ViewModel
      2. Makes async calls to external APIs
      3. Updates data in viewModel due to data from API-CALLS
    This module manages the execution order of scripts, ensuring that functions
    requiring external scripts to have loaded will wait for these async calls to
    have responded.
  */
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
    var error_msg = 'Google Maps is not working for some reason...';
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
    var error_msg = 'The Yelp API is not working for some reason...';
    error_msg += 'But you can still use the app! =)';
    appViewModel.error(error_msg);
  });

  // And the monster is alive!!!!

})();
