// viewModel constructor
var viewModel = function() {
  // TODO: figure out the self/this wieirdness
  var self = this;
  self.locations = ko.observableArray([]);
  this.status = ko.observable('active');
  self.center = ko.observable({
    lat: 44.1899178,
    lng: -73.7866135
  });
  self.mapDiv = document.getElementById('map');
  self.map = {};
  self.filter = {
    types: ['climb', 'food'],
    keyword: 'roaring'
  };
  self.keyword = ko.observable('');
  self.query = ko.observable('');
  self.loc_types = ko.observableArray(['climb', 'food']);
  self.mileage = ko.observableArray([100, 50, 10, 5, 1]);
  self.filtered_locations = ko.observableArray(self.locations());
  self.selectedLocation = ko.observable();
  self.yelp_settings = ko.computed(function() {
    var yelp_url = 'https://api.yelp.com/v2/search?',
      consumerSecret = 'fTfDa0IIFU0QzF7caXw3Ba9-bEQ',
      tokenSecret = 'hH68LJgKUkwLNhUf0Yavw6jdVes',
      oauth_consumer_key = 'QbAL_pqgAo730xi3DAC2qA',
      oauth_token = 'aBZbbpsTdhq9869cQVdja221aJaFuDqv',
      term = 'food',
      location = 'Keene+Valley+NY',
      radius = '20000',
      httpMethod = 'GET';

    var parameters = {
      oauth_consumer_key: oauth_consumer_key,
      oauth_token: oauth_token,
      oauth_nonce: (Math.floor(Math.random() * 1e12).toString()),
      oauth_timestamp: Math.floor(Date.now() / 1000),
      oauth_signature_method: 'HMAC-SHA1',
      oauth_version: '1.0',
      callback: 'cb',
      term: term,
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
        console.log('Success yelp AJAX call!');
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
        // Do stuff on fail
        console.log('error during Yelp AJAX call');
      }
    };
    return yelp_settings
  });
};

//viewmodel methods
viewModel.prototype = {
  // change the locations shown by location type and mileage
  changeFilter: function(request) {
    var loc_types = [];
    var keyword = $(request.keyword).val();
    console.log($(request.climb).val());
    if ($(request.climb).val() == 'on') {
      loc_types.push('climb')
    }
    if ($(request.food).val() == 'on') {
      loc_types.push('food')
    }
    this.filter = {
      loc_type: loc_types,
      keyword: keyword
    };
    console.log(this.filter);
  },

  filterLocations: function() {
    if (!this.filter.keyword) {
      this.filterLocations = this.locations;
    } else {
      this.filterLocations = ko.utils.arrayFilter(this.locations(), function(item) {
        return ko.utils.stringStartsWith(this.filter.keyword);
      });
    }
  },

  initMap: function() {
    var self = this;
    self.map = new Map(self.mapDiv, self.center());
  },

  changeCenter: function(arg) {
    this.center = ko.observable({
      lat: parseInt($(arg.lat).val()),
      lng: parseInt($(arg.lng).val())
    })
    this.initMap();
  },

  // adds all markers to google 71
  addMarkers: function() {
    console.log('adding markers to map')
    var self = this;
    this.locations().forEach(function(location) {
      location.marker.setMap(self.map);
    })
  },

  loadData: function() {
    // load all initial climbing locations
    console.log('loadData called');
    var self = this;
    data.forEach(function(e) {
      self.locations().push(new Location(e));
    });
  },

  // adds location to trip planning array
  addTrip: function(new_loc) {
    // FIXME: this points to location added for some reason
    console.log('location added to trip');
    this.trip.push(new_loc)
  },

  //removes trip from trip planning array
  removeTrip: function(loc) {
    console.log('location removed from trip');
    this.trip.remove(loc);
  },

  slideOut: function() {
    var slideout = new Slideout({
      'panel': document.getElementById('panel'),
      'menu': document.getElementById('menu'),
      'padding': 256,
      'tolerance': 70
    });
    slideout.toggle();
  },

  search: function(value) {
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
  },

  // initializies ViewModel with map and adds markers
  init: function() {
    this.loadData();
    this.initMap();
    this.addMarkers();
    this.query.subscribe(this.search.bind(this));
  }
};

// And the monster is alive!
appViewModel = new viewModel(data);

//need to wait until after Yelp API returns to apply Ko bindings
$.when($.ajax(appViewModel.yelp_settings())).then(function() {
  appViewModel.init();
  ko.applyBindings(appViewModel);
});
