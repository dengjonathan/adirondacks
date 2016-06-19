var viewModel = function(data) {
  var self = this;
  this.status = ko.observable('active');
  this.map = map;
  this.center = ko.observable({
    // FIXME: get these to display on view and allow them to be changed
    'lat': 44.1899178,
    'lng': -73.7866135
  });
  this.filter = undefined;
  this.loc_types = ko.observableArray(['all', 'climb', 'food', 'bivy', 'run']);
  this.mileage = ko.observableArray([100, 50, 10, 5, 1]);
  this.locations = ko.observableArray(
    data.map(function(e) {
      return new Location(e);
    })
  );
  this.markers = ko.computed(function() {
    var markers = [];
    ko.utils.arrayForEach(this.locations(),
      function(each) {
        markers.push(new Marker(each.name(), each.lat(), each.lng(), each.loc_type()));
      });
    return markers;
  }, this);

};

//viewmodel functions
viewModel.prototype = {
  // change the locations shown by location type and mileage
  changeFilter: function(request) {
    console.log(request.loc_type);
    var filter = {
      loc_type: $(request.loc_type).val(),
      mileage: $(request.mileage).val()
    };
    this.filter = filter;
    console.log(this);
  },

  changeCenter: function(request){
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
    this.locations.push(new Location(arg));
  },

  //TODO: how to set point to select the viewModel
  removeLoc: function(location) {
    console.log(this.locations);
    $(this).parent().locations.remove(location);
  },

  // adds all markers to google map
  addMarkers: function() {
    this.markers().forEach(function(marker) {
      marker.setMap(this.map);
    })
  },
  // initializies ViewModel with map
  init: function() {
    initMap();
    this.addMarkers();
  }
};


appViewModel = new viewModel(data)
ko.applyBindings(appViewModel);
