describe('viewModel test suite', function() {
  var viewModel;
  beforeEach(function() {
    viewModel = new ViewModel();
  });

  describe('viewModel with properties', function() {
    it('has a center location with lat/long', function() {
      expect(typeof(viewModel.center().lat)).toBe('number');
    });
  })

  describe('app should have Google Maps functionality', function() {
    var map, mapCanvas;

    beforeEach(function() {
      // create fake DOM element for map
      mapCanvas = document.createElement("div");
      mapCanvas.setAttribute("id", 'map-canvas');
      // map instance
      map = new google.maps.Map(mapCanvas);
    });


    it('should create map based on call to google Maps API', function() {
      //send some test to google maps

    }) console.log(status);
    expect(status).toBe(200);
  });

  it('should send and recieve Yelp API calls', function() {
    return;
  });

  it('should populate self.locations when Yelp API returns', function() {
    return;
  });
});

// describe('Location object', function() {
//
// });
// });
