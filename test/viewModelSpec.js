describe('viewModel test suite', function() {
  var viewModel;
  beforeEach(function() {
    viewModel = new ViewModel();
  });

  describe('viewModel with properties', function() {
    it('has a center location with lat/long', function() {
      expect(typeof(viewModel.center().lat)).toBe('number')
    });
  })

  describe('app should send and recieve Async requests', function() {

    it('should send and recieve a Google Maps call', function() {
      var status;
      // var GOOGLE_MAPS_URL = 'https://maps.googleapis.com/maps/api/js?key=';
      // GOOGLE_MAPS_URL += SECRETS.getGoogleMapsKey();
      $.getScript(GOOGLE_MAPS_URL, function(data, textStatus, jqxhr) {
        status = jqxhr;
      })
      console.log(status);
      expect(status).toBe(200);
    });

    it('should send and recieve Yelp API calls', function() {
      return;
    });

    it('should populate self.locations when Yelp API returns', function() {
      return;
    });
  });

  describe('Location object', function() {

  });
});
