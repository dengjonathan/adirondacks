var data = [
          {
            name: "Beer Walls",
            lat: 44.192149,
            long: -73.778619,
            loc_type: "climb",
            desc: "A cragging wall"
          }, {
            name: "Noonmark Diner",
            lat: 44.292149,
            long: -73.898619,
            loc_type: "food",
            desc: "Classic diner on the Keene Valley Main Street"
}];

//Base location superclass
var Location = function(arg) {
  var self = this;
  this.loc_name = ko.observable(arg.name);
  this.lat = ko.observable(arg.lat);
  this.long = ko.observable(arg.long);
  this.location = ko.computed(function() {
    return self.lat() + ", " + self.long();
  })
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
