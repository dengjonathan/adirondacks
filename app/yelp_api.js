//var yelp_request: 'http: //api.yelp.com/v2/search?&oauth_consumer_key=SOMEKEYHERE&oauth_token=SOMETOKENHERE&oauth_nonce=192824960453&oauth_timestamp=1432097803&oauth_signature_method=HMAC-SHA1&oauth_version=1.0&callback=cb&location=1032+Castro+Street%2C+Mou ntain+View&term=cafe&cll=37.385083%2C-122.08460200000002&oauth_signature=OURENCODEDSIGNATURE';
var yelp_url = 'https://api.yelp.com/v2/search?', yelp_results;

// generate nonce key
function nonce_generate() {
  return (Math.floor(Math.random() * 1e12).toString());
}

var httpMethod = 'GET';

var parameters = {
  oauth_consumer_key: 'QbAL_pqgAo730xi3DAC2qA',
  oauth_token: 'aBZbbpsTdhq9869cQVdja221aJaFuDqv',
  oauth_nonce: nonce_generate(),
  oauth_timestamp: Math.floor(Date.now() / 1000),
  oauth_signature_method: 'HMAC-SHA1',
  oauth_version: '1.0',
  callback: 'cb',
  term: 'food',
  location: 'Keene+Valley+NY',
  radius: '20000'
};

var consumerSecret = 'fTfDa0IIFU0QzF7caXw3Ba9-bEQ',
  tokenSecret = 'hH68LJgKUkwLNhUf0Yavw6jdVes';

// generates a RFC 3986 encoded, BASE64 encoded HMAC-SHA1 hash
var encodedSignature = oauthSignature.generate('GET', yelp_url, parameters, consumerSecret, tokenSecret, {
  encodeSignature: false
});

parameters.oauth_signature = encodedSignature;

var settings = {
  url: yelp_url,
  data: parameters,
  cache: true, // This is crucial to include as well to prevent jQuery from adding on a cache-buster parameter "_=23489489749837", invalidating our oauth-signature
  dataType: 'jsonp',
  success: function(results) {
    console.log('Success yelp AJAX call!');
    appViewModel.yelp_results = ko.observableArray(results.businesses);
  },
  fail: function() {
    // Do stuff on fail
    console.log('error during Yelp AJAX call');
  }
};

// Send AJAX query via jQuery library.
$.ajax(settings);
