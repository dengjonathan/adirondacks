## About

Adirondacks is a neighborhood map Single Page Application built using Knockout,
JQuery,and Bootstrap.  Adirondacks allows climbers to explore climbing areas
and food places (pulled from the Yelp API) on the eastern side of the Adirondacks.

## Getting Started

Adirondacks is currently deployed at http://dengjonathan.github.io/Adirondacks

To run it on your local machine, clone the repository and cd into the adirondacks directory:

```
$ git clone https://github.com/dengjonathan/adirondacks
$ cd adirondacks
```
To make API calls to Google Maps and Yelp, you need to insert your own API keys into the
'app/secrets.example.js' file.  This file creates a global variable SECRETS which the
app will reference for API calls.

Once API keys are inserted, open the index.html file to run the app.:

```
$ open index.html
```

To use the app, click on any marker. This will open the app as a webpage in
your default browser.

Click on any location on the list or map to bring up relevant information about each site.

Additionally, typing a search term into the keyword input will filter available locations
based on name.

## Attribution
This app relies on the following libraries and APIs:
* Google Maps API
* Yelp API
* Knockout
* JQuery
* Bootstrap
* oauth-signature
