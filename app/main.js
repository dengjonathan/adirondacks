// And the monster is alive!
appViewModel = new viewModel(data);

//need to wait until after Yelp API returns to apply Ko bindings
$.when($.ajax(appViewModel.yelp_settings())).then(function() {
  appViewModel.init();
  ko.applyBindings(appViewModel);
});
