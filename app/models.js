// initial data to be loaded into viewModel
var data = [{
  name: "Beer Walls",
  position: {
    lat: 44.192149,
    lng: -73.778619
  },
  loc_type: "climb",
  desc: "A cragging wall"
}, {
  name: "Noonmark Diner",
  position: {
    lat: 44.150377,
    lng: -73.7628508
  },
  loc_type: "food",
  desc: "Classic diner on the Keene Valley Main Street"
}, {
  name: 'Roaring Brook Falls',
  position: {
    lat: 44.150377,
    lng: -73.7628508
  },
  loc_type: 'climb',
  desc: 'A great WI2+ in the winter.  Sketchy though.'
}];

/* Location class - creates a location object including marker and relevant
information */
var Location = function(arg) {
    var self = this;
    this.name = ko.observable(arg.name);
    this.position = {
      lat: ko.observable(arg.position.lat),
      lng: ko.observable(arg.position.lng)
    };
    this.location = ko.computed(function() {
      return self.position.lat() + ", " + self.position.lng();
    });
    this.desc = ko.observable(arg.desc);
    this.loc_type = ko.observable(arg.loc_type);
    this.icon = LOC_ICONS[this.loc_type()];

    //additional data from yelp
    this.phone = ko.observable(arg.phone);
    this.image_url = ko.observable(arg.image_url);
    this.mobile_url = ko.observable(arg.mobile_url);
    this.rating = ko.observable(arg.rating);

    // creates google map marker
    this.marker = new Marker(this.name(), this.position, this.loc_type());
    // hard code the contents of the infowindow
    var content = '<h2 data-bind="$data"><a href="' + this.mobile_url() + '">' + this.name() +'</a></h2>';
    content += '<p>' + this.desc() + '</p>';
    content += '<p>Phone: ' + this.phone() + '</p>';
    content += '<p data-bind="text: status">Yelp Rating: ' + this.rating() + '</p>';
    content += '<img src="' + this.image_url() + '">';
    this.infowindow = new google.maps.InfoWindow();
    this.infowindow.setContent(content);

      // when marker is clicked will open up info window
      this.marker.addListener('click', function() {
        // FIXME: how to select an object oriented way currently stored in global var
        var view_model = appViewModel
        if (view_model.selectedLocation()){
            view_model.selectedLocation().infowindow.close();
        }
        view_model.selectedLocation(self);
        self.infowindow.open(map, self.marker);
      });

      this.marker.addListener();
    };

    Location.prototype = {
      changeName: function(name) {
        this.loc_name = name;
      },
    };

    // Google Map object constructor
    var Map = function(mapDiv, center_pos, options) {
      // TODO: refactor to have viewModel pass in args for constructor
      var mapOptions = options || {
        center: center_pos,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.HYBRID
      };
      return new google.maps.Map(mapDiv, mapOptions);
    };

    // Reference to marker icons
    var LOC_ICONS = {
      climb: 'images/climb.gif',
      food: 'images/food.png',
      gear: 'images/gear.gif',
      camp: 'images/camp.gif'
    };

    // Google Map marker constructor
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

    // // snippet to take markers off map
    // marker.setMap(null);
