  "use strict";

  // viewModel constructor
  function ViewModel() {
    var self = this;
    self.locations = ko.observableArray([]);
    self.center = ko.observable({
      lat: 44.1992034912109,
      lng: -73.786865234375
    });
    self.mapDiv = document.getElementById('map');
    self.map = {};
    self.query = ko.observable('');
    self.filtered_locations = ko.observableArray(self.locations());
    self.selectedLocation = ko.observable();
    self.error = ko.observable();
  };

  //viewmodel methods
  ViewModel.prototype = {

    // Returns yelp_settings object for use during AJAX request to Yelp API
    yelp_settings: function() {
      var yelp_url = 'https://api.yelp.com/v2/search?',
        consumerSecret = SECRETS.getConsumerSecret(),
        tokenSecret = SECRETS.getTokenSecret(),
        oauth_consumer_key = SECRETS.getConsumerKey(),
        oauth_token = SECRETS.getOAuthToken(),
        location = 'Keene+Valley+NY',
        radius = '40000',
        httpMethod = 'GET';

      var parameters = {
        oauth_consumer_key: oauth_consumer_key,
        oauth_token: oauth_token,
        oauth_nonce: (Math.floor(Math.random() * 1e12).toString()),
        oauth_timestamp: Math.floor(Date.now() / 1000),
        oauth_signature_method: 'HMAC-SHA1',
        oauth_version: '1.0',
        callback: 'cb',
        location: location,
        radius: radius
      };

      var encodedSignature = oauthSignature.generate(
        'GET',
        yelp_url,
        parameters,
        consumerSecret,
        tokenSecret, {
          encodeSignature: false
        });

      parameters.oauth_signature = encodedSignature;

      var yelp_settings = {
        url: yelp_url,
        data: parameters,
        cache: true, // self is crucial to include as well to prevent jQuery from adding on a cache-buster parameter "_=23489489749837", invalidating our oauth-signature
        dataType: 'jsonp',
        success: function(results) {
          console.log('Successful yelp AJAX call!');
          /* upon successful AJAX response, convert response into Location
          objects to populate viewModel */
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
            self.locations.push(new Location(arg));
          });
        },
        fail: function() {
          // TODO: Do stuff on fail
          console.log('error during Yelp AJAX call');
        }
      };
      return yelp_settings
    },

    initMap: function() {
      this.map = new Map(this.mapDiv, this.center());
    },

    changeCenter: function(arg) {
      this.center = ko.observable({
        lat: parseInt($(arg.lat).val()),
        lng: parseInt($(arg.lng).val())
      })
      this.initMap();
    },

    addMarkers: function() {
      var self = this;
      self.filtered_locations().forEach(function(location) {
        location.marker.setAnimation(google.maps.Animation.DROP);
        location.marker.setMap(self.map);
      })
    },

    removeMarkers: function() {
      // FIXME: hide/show markers rather than take them off the map every time
      // set all current markers to null
      this.filtered_locations().forEach(function(location) {
        location.marker.setVisible(true);
      });
    },

    loadData: function() {
      // load all initial climbing locations
      console.log('loadData called');
      var self = this;
      data.forEach(function(e) {
        self.locations().push(new Location(e));
      });
    },

    search: function(value) {
      this.removeMarkers();
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
      this.addMarkers();
    },

    checkMap: function() {
      if (!self.map) {
        self.error = 'Error loading map';
      }
      console.log(self.map);
    },

    // initializies ViewModel with map and adds markers
    init: function() {
      this.loadData();
      this.query.subscribe(this.search.bind(this));
      // show error if map doesn't load
      setTimeout(this.checkMap, 3000)
    }
  };

  // And the monster is alive!
  var appViewModel = new ViewModel(data);

  // TODO: wait until map is loaded to do map specific actions
  $.when(appViewModel.initMap()).then(appViewModel.addMarkers());

  // add new markers when Yelp API Ajax request returns
  $.when($.ajax(appViewModel.yelp_settings())).then(function() {
    appViewModel.addMarkers();
    appViewModel.search();
  });

  appViewModel.init();
  ko.applyBindings(appViewModel);
