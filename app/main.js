// viewModel constructor
var viewModel = function() {
  var self = this;
  this.status = ko.observable('active');
  self.center = ko.observable({
    lat: 44.1899178,
    lng: -73.7866135
  });
  self.mapDiv = document.getElementById('map');
  this.map = {};
  this.filter = {
    types: ['climb', 'food', 'bivy', 'run'],
    selected: false
  };
  this.loc_types = ko.observableArray(['climb', 'food', 'bivy', 'run']);
  this.mileage = ko.observableArray([100, 50, 10, 5, 1]);
  this.locations = ko.observableArray([]);
  this.yelp_results = [];
};

//viewmodel methods
viewModel.prototype = {
  // change the locations shown by location type and mileage
  changeFilter: function(request) {
    console.log(request.loc_type);
    var filter = {
      loc_type: $(request.loc_type).val(),
      mileage: $(request.mileage).val()
    };
    this.filter = filter;
  },

  changeCenter: function(request) {
    this.center = {
      loc_type: $(request.lat).val(),
      name: $(request.lng).val(),
    };
  },

  // add location to view model
  addLoc: function(request) {
    var arg = {
      loc_type: $(request.loc_type).val(),
      name: $(request.name).val(),
      lat: $(request.lat).val(),
      long: $(request.long).val(),
      desc: $(request.desc).val(),
    };
    this.locations().push(new Location(arg));
  },

  //FIXME: how to set point to select the viewModel
  removeLoc: function(location) {
    $(this).parent().locations.remove(location);
  },

  initMap: function() {
    var self = this;
    self.map = new Map(self.mapDiv, self.center());
  },

  // adds all markers to google 71
  addMarkers: function() {
    var self = this;
    this.locations().forEach(function(location) {
      location.marker.setMap(self.map);
    })
  },

  loadData: function() {
    // load all initial climbing locations
    var self = this;
    data.forEach(function(e) {
      self.locations().push(new Location(e));
    });
  },

  loadYelp: function() {
    var self = this;
    //external function to access yelp API
    getYelp();
    this.yelp_results.forEach(function(e) {
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
      console.log(self);
      console.log(arg);
      self.locations().push(new Location(arg));
    });
  },
  // initializies ViewModel with map and adds markers
  init: function() {
    this.loadData();
    // FIXME: why does this work when explicity called, but not when init?
    this.loadYelp();
    this.initMap();
    this.addMarkers();
  }
};

// And the monster is alive!
appViewModel = new viewModel(data)
appViewModel.init();
ko.applyBindings(appViewModel);
