console.log('ready');

function ListViewModel(){
var self = this;
self.places = ko.observableArray(['Lake Placid', 'MacKenzie Boulders', 'Roaring Brook Falls'])

}

ko.applyBindings(new ListViewModel());
