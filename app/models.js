// initial data to be loaded into viewModel
var data = [{
    name: "Beer Walls",
    position: {
        lat: 44.14329,
        lng: -73.75542
    },
    loc_type: "climb",
    desc: "Found in 1982, the Beer Walls have become, without a doubt, the most popular crag in Keene Valley due to its' accessibility, ease of top-roping, and many climbs with moderate difficulty. With such a large variety of climbs from 5.4 to 5.13b, the Beer Walls can be rather busy on beautiful weekend days. But where else can climbers go to enjoy the richest Adirondack views without having to scale the slabs of Chapel Pond, or endure the steep approach and walls of Washbowl? Though this may be the case, there is ALWAYS something to climb. "
}, {
    name: "Wallface",
    position: {
        lat: 44.137,
        lng: -74.035
    },
    loc_type: "food",
    desc: "Wallface is the largest and tallest cliff of NY state: almost 800' of very steep rock. With its quite long access from the end of the road and rather undefined access to the base of the cliff, Wallface definitely has an alpine dimension. Don't be scared though, climbing this huge cliff is really very interesting and enjoyable!"
}, {
    name: 'Roaring Brook Falls',
    position: {
        lat: 44.150377,
        lng: -73.7628508
    },
    loc_type: 'climb',
    desc: 'A great WI2+ in the winter.  Sketchy though.'
}, {
    name: 'Wilmington Notch - High Falls Crag',
    position: {
        lat: 44.33899,
        lng: -73.89223
    },
    loc_type: 'climb',
    desc: 'Sees major winter crowds.'
}, {
    name: 'Chapel Pond',
    position: {
        lat: 44.14234,
        lng: -73.75522
    },
    loc_type: 'climb',
    desc: 'Chapel Pond is one of the premier ice arenas in the Adirondacks, offering a stone\'s-throw approach, accessible routes of all difficulty levels, and pleasant climbing conditions...usually. The pond area is directly across from the main parking lot on Rt. 73, while Chapel Pond Canyon is lookers right from the parking lot, and semi hidden down--you guessed it--a canyon. The main face of Chapel Pond is NE facing, so it is sunny in the morning, then falls into the shade as the day progresses.'
}, {
    name: 'Hurricane Crag',
    position: {
        lat: 44.21541,
        lng: -73.69944
    },
    loc_type: 'climb',
    desc: 'A wonderful multipitch area with some great crack and face routes. Potential for new climbs is a definite possibility. The crag is an easy approach. It is roughly 20 minutes from the road. The rock is excellent in quality and there are spectacular views from an amazing summit. Hurricane is definately a worthy destination.'
}
];

/* Location class - creates a location object including marker and relevant
information */
var Location = function(arg) {
    var self = this;
    this.name = ko.observable(arg.name);
    this.position = {
        lat: ko.observable(arg.position.lat),
        lng: ko.observable(arg.position.lng)
    };
    this.location = ko.computed(function() {
        return self.position.lat() + ", " + self.position.lng();
    });
    this.desc = ko.observable(arg.desc);
    this.loc_type = ko.observable(arg.loc_type);
    this.icon = LOC_ICONS[this.loc_type()];

    //additional data from yelp
    this.phone = ko.observable(arg.phone);
    this.image_url = ko.observable(arg.image_url);
    this.mobile_url = ko.observable(arg.mobile_url);
    this.rating = ko.observable(arg.rating);

    // creates google map marker
    this.marker = new Marker(this.name(), this.position, this.loc_type());
    // hard code the contents of the infowindow
    var content = '<h2 data-bind="$data"><a href="' + this.mobile_url() + '">' + this.name() + '</a></h2>';
    content += '<p>' + this.desc() + '</p>';
    content += '<p>Phone: ' + this.phone() + '</p>';
    content += '<p data-bind="text: status">Yelp Rating: ' + this.rating() + '</p>';
    content += '<img src="' + this.image_url() + '">';
    this.infowindow = new google.maps.InfoWindow();
    this.infowindow.setContent(content);

    // when marker is clicked will open up info window
    this.marker.addListener('click', function() {
        var view_model = appViewModel
        if (view_model.selectedLocation()) {
            view_model.selectedLocation().infowindow.close();
        }
        view_model.selectedLocation(self);
        self.infowindow.open(map, self.marker);
    });

    this.marker.addListener();
};

Location.prototype = {
    changeName: function(name) {
        this.loc_name = name;
    },
};

// Google Map object constructor
var Map = function(mapDiv, center_pos, options) {
    var mapOptions = options || {
        center: center_pos,
        zoom: 11,
        mapTypeId: google.maps.MapTypeId.HYBRID
    };
    return new google.maps.Map(mapDiv, mapOptions);
};

// Reference to marker icons
var LOC_ICONS = {
    climb: 'images/climb.gif',
    food: 'images/food.png',
    gear: 'images/gear.gif',
    camp: 'images/camp.gif'
};

// Google Map marker constructor
var Marker = function(name, position, loc_type) {
    var icon = LOC_ICONS[loc_type];
    return new google.maps.Marker({
        name: name,
        position: {
            lat: position.lat(),
            lng: position.lng()
        },
        animation: google.maps.Animation.DROP,
        icon: icon,
    });
};
