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

    //FIXME: seperate out to google maps functionality out of the viewModel
    // initMap: function() {
    //   this.map = new Map(this.mapDiv, this.center());
    // },

    changeCenter: function(arg) {
      this.center = ko.observable({
        lat: parseInt($(arg.lat).val()),
        lng: parseInt($(arg.lng).val())
      })
      // FIXME: seperate out map concerns
      this.initMap();
    },

    addMarkers: function() {
      // var self = this;
      // self.filtered_locations().forEach(function(location) {
      //   location.marker.setAnimation(google.maps.Animation.DROP);
      //   location.marker.setMap(self.map);
      // })
    },

    removeMarkers: function() {
      // // FIXME: hide/show markers rather than take them off the map every time
      // // set all current markers to null
      // this.filtered_locations().forEach(function(location) {
      //   location.marker.setVisible(true);
      // });
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

    //seperate out map concerns
    // checkMap: function() {
    //   if (!self.map) {
    //     self.error = 'Error loading map';
    //   }
    //   console.log(self.map);
    // },

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
