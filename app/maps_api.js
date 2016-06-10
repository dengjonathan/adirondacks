var map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 44.2561727,
            lng: -73.8008399
        },
        zoom: 10
    });
}

initMap();
