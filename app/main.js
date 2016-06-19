var viewModel = function(data) {
  this.status = ko.observable('active');
  this.center = ko.observable();
  this.filter = undefined;
  this.loc_types = ko.observableArray(['all', 'climb', 'food', 'bivy', 'run'])
  this.mileage = ko.observableArray([100, 50, 10, 5, 1])
  this.locations = ko.observableArray(
    data.map(function(e) {
      return new Location(e);
    })
  );
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
  removeLoc: function(location){
    console.log(this.locations);
    $(this).parent().locations.remove(location);
  },

};


var AppViewModel = new viewModel(data);

ko.applyBindings(AppViewModel);
