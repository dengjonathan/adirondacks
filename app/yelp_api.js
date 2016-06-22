/* This script accesses Yelp API and saves information to the variable yelp results*/
var yelp_results;

function getYelp(){
  var yelp_API = {
    yelp_url: 'https://api.yelp.com/v2/search?',
    // TODO: find way to access this info without openly displaying
    consumerSecret: 'fTfDa0IIFU0QzF7caXw3Ba9-bEQ',
    tokenSecret: 'hH68LJgKUkwLNhUf0Yavw6jdVes',
    oauth_consumer_key: 'QbAL_pqgAo730xi3DAC2qA',
    oauth_token: 'aBZbbpsTdhq9869cQVdja221aJaFuDqv',
    term: 'food',
    location: 'Keene+Valley+NY',
    radius: '20000',
  };

  // generate nonce key
  function nonce_generate() {
    return (Math.floor(Math.random() * 1e12).toString());
  }

  var httpMethod = 'GET';

  var parameters = {
    oauth_consumer_key: yelp_API.oauth_consumer_key,
    oauth_token: yelp_API.oauth_token,
    oauth_nonce: nonce_generate(),
    oauth_timestamp: Math.floor(Date.now() / 1000),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_version: '1.0',
    callback: 'cb',
    term: yelp_API.term,
    location: yelp_API.location,
    radius: yelp_API.radius
  };

  var encodedSignature = oauthSignature.generate(
    'GET',
    yelp_API.yelp_url,
    parameters,
    yelp_API.consumerSecret,
    yelp_API.tokenSecret,
    {
      encodeSignature: false
    });

  parameters.oauth_signature = encodedSignature;

  var yelp_settings = {
    url: yelp_API.yelp_url,
    data: parameters,
    cache: true, // This is crucial to include as well to prevent jQuery from adding on a cache-buster parameter "_=23489489749837", invalidating our oauth-signature
    dataType: 'jsonp',
    success: function(results) {
      console.log('Success yelp AJAX call!');
      // FIXME do you want only businesses?
      appViewModel.yelp_results = results.businesses;
    },
    fail: function() {
      // Do stuff on fail
      console.log('error during Yelp AJAX call');
    }
  };

  // Send AJAX query via jQuery library.
  return $.ajax(yelp_settings);
};
