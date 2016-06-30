##About
This is a project for the Udacity Full Stack Nanodegree. It is a neighborhood
map of climbs and places to eat on the eastern side of the Adirondacks in
NY State.

##Basic Instruction
To run the app, download the repository and cd into the project folder:

```cd adirondacks```

Open the index.html file in a modern browser (i.e. Chrome, Firefox):

```open index.html```

Open the index.html file in a modern browser (chrome, firefox, ie11, etc.).
Click markers or list items to select a location and retrieve info about it.
Type into the filter/search box to filter the shown locations.
Click page the small arrow at the bottom of the list to collapse or expand the list.
Click anywhere on the actual map to close the information window that opens.
Ensure options above filter/search box are what you want them to be.
Notes

##Notes

Screens smaller than 800px wide are treaded differently than large screens to help prevent blocking information with the list. This includes autocallapse of the list, smaller infowindows, and no panorama on smaller screens.
Most points have a panorama or streetview nearby. Those will open one in the infowindow if so.
Session storage is used, so information will only pull once per point until you close that tab. This speeds up clicking a point again and reduces api calls.
This tool uses Knockout, jquery, and also includes modernizr in hopes of further cross browser support. A modern browser is still recommended.
The page is responsive but it is not intended for mobile viewing on small devices. If you are viewing on a mobile phone, landscape is recommended as the width of the list is fixed.
Foursquare API powers the site information outside of the map and panorama.
Google maps api v3 powers the maps and panoramas.
Points used are not very interesting for the most part. They are for demonstration purposes mainly and were not carefulyl picked.
Status API Training Shop Blog About
