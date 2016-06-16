// represent a single location
var Location = function(name, lat, long, loc_type){
  this.name = ko.observable(name);
  this.lat = ko.observable(lat);
  this.long = ko.observable(long);
  this.loc_type = ko.observable(type);
}

//location methods
Location.prototype = {
  getName: function(){return this.name;},
  getLoc: function(){return (this.lat, this.loc);},
  getType: function(){return(this.loc_type);}
};

var viewModel = {
  status: ko.observable('active'),
  places: ko.observableArray(['Keene Valley','Lake Placid', 'Saranac Lake'])
};

ko.applyBindings(viewModel, $('html')[0]);
