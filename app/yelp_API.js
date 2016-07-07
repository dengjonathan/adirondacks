// Returns yelp_settings object for use during AJAX request to Yelp API
yelp_settings: function() {
  var yelp_url = 'https://api.yelp.com/v2/search?',
    consumerSecret = SECRETS.getConsumerSecret(),
    tokenSecret = SECRETS.getTokenSecret(),
    oauth_consumer_key = SECRETS.getConsumerKey(),
    oauth_token = SECRETS.getOAuthToken(),
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
      console.log('Successful yelp AJAX call!');
      /* upon successful AJAX response, convert response into Location
      objects to populate viewModel */
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
      // TODO: Do stuff on fail
      console.log('error during Yelp AJAX call');
    }
  };
  return yelp_settings
},
