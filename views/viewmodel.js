function viewModel() {
    var self = this;
    self.places = ko.observableArray(['Lake Placid', 'MacKenzie Boulders', 'Roaring Brook Falls']);
};

$(document).ready(function() {
    console.log('document ready');

    ko.applyBindings(new viewModel());
});
