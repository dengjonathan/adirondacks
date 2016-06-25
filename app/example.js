// Model
var Model = {
    names: ["Naruto", "Sakura", "Sasuke"],
    count: 0,
    location: {
    	x: 35.1400759,
      y: 134.1828015
    },

    // Fetch one of three names, a different one on each click
    getName: function () {
        var self = this;
        var position = self.count % self.names.length;
        var currentName = self.names[position];

        self.count++;

        return currentName;
    }
};

// ViewModel
var FiddleViewModel = {
    init: function () {
        var self = this;
        var nagiJapan = new google.maps.LatLng(Model.location.x, Model.location.y);
        var map;

        self.name = ko.observable("");

        // Sets up map
        function mapInitialize() {
            var mapElement = $('#map-canvas')[0];
            var mapOptions = {
                center: nagiJapan,
                disableDefaultUI: true,
                zoom: 12
            };

            return (new google.maps.Map(mapElement, mapOptions));
        }

        // Sets up lone info window
        function infoWindowInitialize() {
            var infoWindowHTML =
                '<div id="info-window"' +
                'data-bind="template: { name: \'info-window-template\', data: name }">' +
                '</div>';

            self.infoWindow = new google.maps.InfoWindow({
                content: infoWindowHTML
            });
            var isInfoWindowLoaded = false;

            /*
             * When the info window opens, bind it to Knockout.
             * Only do this once.
             */
            google.maps.event.addListener(self.infoWindow, 'domready', function () {
                if (!isInfoWindowLoaded) {
                    ko.applyBindings(self, $("#info-window")[0]);
                    isInfoWindowLoaded = true;
                }
            });
        }

        // Sets up marker
        function markerInitialize() {
            var marker = new google.maps.Marker({
                position: nagiJapan,
                map: map
            });

            google.maps.event.addListener(marker, 'click', function () {
                /**
                 * If you uncomment the below, the connection between
                 * the DOM in the info window and Knockout will break
                 * after closing the window, making it stuck on the
                 * last thing.
                 *
                 * So, you must open your info window before applying
                 * any updates to it, else they won't register if it
                 * is closed.
                 **/

                //self.setName("Loading....");
                self.infoWindow.open(map, marker);

                // Get and apply name
                var name = Model.getName();
                self.setName(name);
            });
        }

        // Actually call functions to set things up
        map = mapInitialize();
        infoWindowInitialize();
        markerInitialize();
    },

    // Apply new name
    setName: function (name) {
        var self = this;
        self.name(name);
    }
};

// Apply bindings to ViewModel and start the initializing
ko.applyBindings(FiddleViewModel);
FiddleViewModel.init();
