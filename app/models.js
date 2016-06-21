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

  // creates google map marker
  console.log('###', this.position.lat())
  this.marker = new Marker(this.name(), this.position, this.loc_type());
  this.infowindow = new google.maps.InfoWindow({
    content: this.desc()
  });

  // when marker is clicked will open up info window
  this.marker.addListener('click', function() {
    this.infowindow.open(map, new_mark);
  });

  //additional data from yelp
  this.data = {
    phone: arg.phone,
    image_url: arg.image_url,
    mobile_url: arg.mobile_url,
    rating: arg.rating,
    snippet_text: arg.snippet_text
  };

};

Location.prototype = {
  changeName: function(name) {
    this.loc_name = name;
  },
};


// Google Map object constructor
var Map = function(mapDiv, center_pos, options) {
  // TODO: refactor to have viewModel pass in args for constructor
  console.log('Google Map Initiating');
  console.log(mapDiv);
  console.log(center_pos);
  var mapOptions = options || {
    center: center_pos,
    zoom: 12,
    draggable: true,
    mapTypeId: google.maps.MapTypeId.HYBRID
  };
  return new google.maps.Map(mapDiv, mapOptions);
};

// Reference to marker icons
var LOC_ICONS = {
  climb: 'images/gear.jpeg',
  food: 'images/food.png',
  gear: 'images/gear.jpeg',
  camp: 'images/camp.jpeg'
};

// Google Map marker constructor
var Marker = function(name, position, loc_type) {
  var icon = LOC_ICONS[loc_type];
  console.log(position.lat());
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