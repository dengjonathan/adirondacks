// viewModel constructor
var viewModel = function() {
    var self = this;
    self.locations = ko.observableArray([]);
    self.status = ko.observable('active');
    self.center = ko.observable({
        lat: 44.1992034912109,
        lng: -73.786865234375
    });
    self.mapDiv = document.getElementById('map');
    self.map = {};
    self.filter = {
        types: ['climb', 'food'],
        keyword: 'roaring'
    };
    self.keyword = ko.observable('');
    self.slideout = {};
    self.query = ko.observable('');
    self.loc_types = ko.observableArray(['climb', 'food']);
    self.mileage = ko.observableArray([100, 50, 10, 5, 1]);
    self.filtered_locations = ko.observableArray(self.locations());
    self.selectedLocation = ko.observable();
    self.yelp_settings = ko.computed(function() {
        var yelp_url = 'https://api.yelp.com/v2/search?',
            consumerSecret = 'fTfDa0IIFU0QzF7caXw3Ba9-bEQ',
            tokenSecret = 'hH68LJgKUkwLNhUf0Yavw6jdVes',
            oauth_consumer_key = 'QbAL_pqgAo730xi3DAC2qA',
            oauth_token = 'aBZbbpsTdhq9869cQVdja221aJaFuDqv',
            term = 'food',
            location = 'Keene+Valley+NY',
            radius = '40000',
            httpMethod = 'GET';

        var parameters = {
            oauth_consumer_key: oauth_consumer_key,
            oauth_token: oauth_token,
            oauth_nonce: (Math.floor(Math.random() * 1e12).toString()),
            oauth_timestamp: Math.floor(Date.now() / 1000),
            oauth_signature_method: 'HMAC-SHA1',
            oauth_version: '1.0',
            callback: 'cb',
            term: term,
            location: location,
            radius: radius
        };

        var encodedSignature = oauthSignature.generate(
            'GET',
            yelp_url,
            parameters,
            consumerSecret,
            tokenSecret, {
                encodeSignature: false
            });

        parameters.oauth_signature = encodedSignature;

        var yelp_settings = {
            url: yelp_url,
            data: parameters,
            cache: true, // self is crucial to include as well to prevent jQuery from adding on a cache-buster parameter "_=23489489749837", invalidating our oauth-signature
            dataType: 'jsonp',
            success: function(results) {
                console.log('Success yelp AJAX call!');
                results.businesses.forEach(function(e) {
                    var arg = {
                        name: e.name,
                        position: {
                            lat: e.location.coordinate.latitude,
                            lng: e.location.coordinate.longitude
                        },
                        desc: e.snippet_text,
                        loc_type: 'food',
                        phone: e.display_phone,
                        image_url: e.image_url,
                        mobile_url: e.mobile_url,
                        rating: e.rating,
                    };
                    self.locations.push(new Location(arg));
                });
            },
            fail: function() {
                // Do stuff on fail
                console.log('error during Yelp AJAX call');
            }
        };
        return yelp_settings
    });
};

//viewmodel methods
viewModel.prototype = {

    initMap: function() {
        var self = this;
        // console.log(this.mapDiv, this.center())
        this.map = new Map(this.mapDiv, this.center());
    },

    changeCenter: function(arg) {
        this.center = ko.observable({
            lat: parseInt($(arg.lat).val()),
            lng: parseInt($(arg.lng).val())
        })
        this.initMap();
    },

    addMarkers: function() {
        var self = this;
        self.filtered_locations().forEach(function(location) {
            location.marker.setAnimation(google.maps.Animation.DROP);
            location.marker.setMap(self.map);
        })
    },

    removeMarkers: function() {
        // set all current markers to null
        this.filtered_locations().forEach(function(location) {
            location.marker.setMap(null);
        });
    },

    addBounce: function() {
        this.filtered_locations().forEach(function(location) {
            location.marker.setAnimation(google.maps.Animation.BOUNCE);
        });
    },

    removeBounce: function() {
        this.filtered_locations().forEach(function(location) {
            location.marker.setAnimation(null);
        });
    },

    loadData: function() {
        // load all initial climbing locations
        console.log('loadData called');
        var self = this;
        data.forEach(function(e) {
            self.locations().push(new Location(e));
        });
    },

    search: function(value) {
        this.removeMarkers();
        var locations = this.locations();
        if (value) {
            this.filtered_locations(
                locations.filter(function(each) {
                    return each.name().toLowerCase().indexOf(value.toLowerCase()) > -1;
                })
            );
        } else {
            this.filtered_locations(locations);
        }
        this.addMarkers();
    },

    // initializies ViewModel with map and adds markers
    init: function() {
        this.loadData();
        this.initMap();
        this.addMarkers();
        this.query.subscribe(this.search.bind(this));
    }
};

// And the monster is alive!
appViewModel = new viewModel(data);

// add new markers when Yelp API Ajax request returns
$.when($.ajax(appViewModel.yelp_settings())).then(function() {
    appViewModel.addMarkers();
    appViewModel.search();
});

appViewModel.init();
ko.applyBindings(appViewModel);
