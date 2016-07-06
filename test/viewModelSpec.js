describe('viewModel test suite', function() {
  var viewModel;
  beforeEach(function() {
    viewModel = new ViewModel();
  })

  describe('viewModel with properties', function() {
    it('has a center location with lat/long', function() {
      expect(typeof(viewModel.center().lat)).toBe('number')
    });
  })

  describe('viewModel should send and recieve Async requests', function(){

    it('should send and recieve a Google Maps call', function(){
      return;
    });

    it('should send and recieve Yelp API calls', function(){
      return;
    });

    it('should populate self.locations when Yelp API returns,' function()[
      return;
    ])

  })
});
