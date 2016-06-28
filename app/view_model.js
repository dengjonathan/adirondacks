// viewModel constructor
var viewModel = function() {
  // TODO: figure out the self/this wieirdness
  var self = this;
  this.locations = ko.observableArray([]);
  this.status = ko.observable('active');
  self.center = ko.observable({
    lat: 44.1899178,
    lng: -73.7866135
  });
  self.mapDiv = document.getElementById('map');
  this.map = {};
  this.filter = {
    types: ['climb', 'food'],
    keyword: 'roaring'
  };
  self.keyword= ko.observable('');
  self.query = ko.observable('');
  this.loc_types = ko.observableArray(['climb', 'food']);
  this.mileage = ko.observableArray([100, 50, 10, 5, 1]);
  // this.climbs = ko.computed(function() {
  //   return self.loadData();
  // });
  this.foods = ko.observableArray(this.locations());
  this.trip = ko.observableArray([]);
  // location that has infowindow open
  this.selectedLocation = ko.observable();
  this.filtered_locations = ko.computed(function() {
    var filter = self.keyword().toLowerCase();
    console.log(self.locations());
    if (!filter) {
      return self.locations();
    } else {
      return ko.utils.arrayFilter(self.locations(), function(item) {
        return item.name().toLowerCase().indexOf(filter) > -1;
      });
    }
  });
  this.yelp_settings = ko.computed(function() {
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
      cache: true, // This is crucial to include as well to prevent jQuery from adding on a cache-buster parameter "_=23489489749837", invalidating our oauth-signature
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
    var foods = this.foods();
    console.log(locations);
    console.log(value);
    console.log(foods);
    // this.foods.removeAll();
    if(value){
      this.foods(
        locations.filter(function(each) {
          return each.name().toLowerCase().indexOf(value.toLowerCase()) > -1;
        })
      );
    } else {
      this.foods(locations);
    }
    console.log(this.foods());
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
