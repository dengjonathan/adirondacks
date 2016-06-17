var viewModel = {
  status: ko.observable('active'),

  places: ko.observableArray(['Keene Valley','Lake Placid', 'Saranac Lake']),

  getPlaces: function(type){
    return places.filter(function(place){return place.type = type;});
  },

  setMap: function(places){}
};


ko.applyBindings(viewModel, $('html')[0]);
