// And the monster is alive!
appViewModel = new viewModel(data);
appViewModel.init();
$.when($.ajax(appViewModel.yelp_settings)).then(ko.applyBindings(appViewModel))
//need to wait until after Yelp API returns to apply Ko bindings
