var data = [{
    name: "Beer Walls",
    lat: 44.192149,
    lng: -73.778619,
    loc_type: "climb",
    desc: "A cragging wall"
  }, {
    name: "Noonmark Diner",
    lat: 44.292149,
    lng: -73.898619,
    loc_type: "food",
    desc: "Classic diner on the Keene Valley Main Street"
  }, {
    name: 'Roaring Brook Falls',
    lat: 44.150377,
    lng: -73.7628508,
    loc_type: 'climb',
    desc: 'A great WI2+ in the winter.  Sketchy though.'
  }

];

//Base location superclass
var Location = function(arg) {
  var self = this;
  this.name = ko.observable(arg.name);
  this.lat = ko.observable(arg.lat);
  this.lng = ko.observable(arg.lng);
  this.location = ko.computed(function() {
    return self.lat() + ", " + self.lng();
  });
  this.desc = ko.observable(arg.desc);
  this.loc_type = ko.observable(arg.loc_type);
};

Location.prototype = {
  changeName: function(name) {
    this.loc_name = name;
  }
}



// location child objects
// var Climb = function(arg) {
//   Location.call(this, arg);
//   this.grade = ko.observable(arg.grade);
// }
//
// Climb.prototype = Object.create(Location.prototype);
//
// function Food(name, lat, long, loc_type, desc) {
//   Location.call(this, name, lat, long, loc_type, desc);
//   // add some food specific variables
// }
//
// Food.prototype = Object.create(Location.prototype);
//
// function Gear(name, lat, long, loc_type, desc, grade) {
//   Location.call(this, name, lat, long, loc_type, desc);
// };
//
// Gear.prototype = Object.create(Location.prototype);
//
// function Bivy(name, lat, long, loc_type, desc, grade) {
//   Location.call(this, name, lat, long, loc_type, desc);
// };
//
// Bivy.prototype = Object.create(Location.prototype);
