// initialize all data store variables in memory
// base location object
var Location = function(name, lat, long, desc) {
  this.loc_name = ko.observable(name);
  this.lat = ko.observable(lat);
  this.long = long;
  this.desc = desc || '';
};

//location methods
Location.prototype = {
  getName: function() {
    return this.name;
  },
  getLoc: ko.computed(function() {
    return this.lat + ', ' + this.long;
  }),
  getType: function() {
    return (this.loc_type);
  },
  getDescription: function() {
    return this.description();
  },
  setDescription: function(string) {
    this.description(string);
  }
};

// location child objects
var Climb = function(name, lat, long, desc, grade){
  Location.call(this, name, lat, long, desc);
  this.grade = grade;
}

Climb.prototype = Object.create(Location.prototype);

function Food(name, lat, long, loc_type, desc){
  Location.call(this, name, lat, long, loc_type, desc);
  // add some food specific variables
}

Food.prototype = Object.create(Location.prototype);

function Gear(name, lat, long, loc_type, desc, grade) {
  Location.call(this, name, lat, long, loc_type, desc);
};

Gear.prototype = Object.create(Location.prototype);

function Bivy(name, lat, long, loc_type, desc, grade) {
  Location.call(this, name, lat, long, loc_type, desc);
};

Bivy.prototype = Object.create(Location.prototype);

var model = {
  loc_types: ['climb', 'food', 'gear', 'bivy'],
  constructors: {
    climb: Climb,
    food: Food,
    gear: Gear,
    bivy: Bivy
  },
  locations: [],

  //model methods
  addLoc: function(loc_type, name, lat, long, desc) {
    var func = this.constructors[loc_type];
    console.log(func);
    var n = new func(name, lat, long, loc_type, desc);
    this.locations.push(n);
  },

  removeLoc: function(name) {
    var n = this.locations.filter(function(e) {
        return e == name;
      })
      // remove this location
  },

  // editLoc: function(name, lat, long, loc_type, desc) {
  //   var n = new Location(e.name, e.lat, e.long, e.loc_type, e.desc);
  //   places[e.name] = n;
  // },

  getLocs: function(filter) {
    if (filter){
      return this.locations.filter(filter);
    }
    return this.locations;
  },

  init: function() {
    var self = this;
    var starter_locs = [new Climb('Beer Walls', '77', '89', 'A Place', '5.12'), new Climb('Beer Walls2', '77', '89', 'A Place', '5.12'), new Climb('Beer Walls3', '77', '89', 'A Place', '5.12')];
    starter_locs.forEach(function(e){
      self.locations.push(e);
    });
}
};

model.init();
