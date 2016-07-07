  "use strict";

  // viewModel constructor
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
