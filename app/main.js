console.log(model);

var viewModel = {
  self: this,
  status: ko.observable('active'),
  model: model,
  filter: undefined,
  locations: model.getLocs(),
  locations2: ko.observableArray(self.locations),
  //select locations from model according to current filter
  map: '', // find some way to select google map

  //viewmodel functions
  changeFilter: function(filter) {
    this.filter = filter;
    this.locations = model.getLocs(filter);
  },

  setMap: function(places) {},

  addLoc: function(loc_type, name, lat, long, desc){
    this.model.addLoc(loc_type, name, lat, long, desc);
  },

};

ko.applyBindings(viewModel);
