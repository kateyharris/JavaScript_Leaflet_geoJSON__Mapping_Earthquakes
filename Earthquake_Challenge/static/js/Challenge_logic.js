// Add console.log to check to see if our code is working.
console.log("working");

// We create the tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  accessToken: API_KEY
});

// We create the second satelite tile layer that will be an option for our map.
let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  accessToken: API_KEY
});

// Deliverable 3: Step 1, Using the options from the Mapbox styles, add a third map style as a tile layer object
let dark = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  accessToken: API_KEY
});

// Create the map object with center, zoom level and default layer.
let map = L.map('mapid', {
  center: [40.7, -94.5],
  zoom: 3,
  layers: [streets]
});

// Create a base layer that holds all three maps.
let baseMaps = {
  "Streets": streets,
  "Satellite": satelliteStreets,
  // Deliverable 3: Step 2, Add the map variable to the base layer object.
  "Dark": dark
};

// Create the earthquake layer for our map.
let earthquakes = new L.LayerGroup();
// Deliverable 1: Step 1, add a second layer group variable for the tectonic plate data.
let tectonicPlates = new L.LayerGroup();
// Deliverable 2: Step 1, add a third layer group variable for the major earthquake data.
let majorEQ = new L.LayerGroup();

// We define an object that contains the overlays.
// This overlay will be visible all the time.
let overlays = {
  // Deliverable 1: Step 2, add a reference to the tectonic plate data to the overlay object.
  "Tectonic Plates": tectonicPlates,

  "Earthquakes": earthquakes,
  // Deliverable 2: Step 2, add a reference to the major earthquake data to the overlay object.
  "Major Earthquakes": majorEQ
};

// Then we add a control to the map that will allow the user to change which
// layers are visible.
L.control.layers(baseMaps, overlays).addTo(map);

//////////////////////////////////////////// ALL EARTHQUAKES ///////////////////////////////////////////////////

// Retrieve the earthquake GeoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {

  // This function returns the style data for each of the earthquakes we plot on
  // the map. We pass the magnitude of the earthquake into two separate functions
  // to calculate the color and radius.
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  // This function determines the color of the marker based on the magnitude of the earthquake.
  function getColor(magnitude) {
    if (magnitude > 5) {
      return "#ea2c2c";
    }
    if (magnitude > 4) {
      return "#ea822c";
    }
    if (magnitude > 3) {
      return "#ee9c00";
    }
    if (magnitude > 2) {
      return "#eecc00";
    }
    if (magnitude > 1) {
      return "#d4ee00";
    }
    return "#98ee00";
  }

  // This function determines the radius of the earthquake marker based on its magnitude.
  // Earthquakes with a magnitude of 0 were being plotted with the wrong radius.
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 3.25;
  }

  // Creating a GeoJSON layer with the retrieved data.
  L.geoJson(data, {
    // We turn each feature into a circleMarker on the map.
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    // We set the style for each circleMarker using our styleInfo function.
    style: styleInfo,
    // We create a popup for each circleMarker to display the magnitude and location of the earthquake
    //  after the marker has been created and styled.
    onEachFeature: function (feature, layer) {
      layer.bindPopup("<h4>Magnitude: " + feature.properties.mag + "<hr>Location: " + feature.properties.place + "</h4>");
    }
  }).addTo(earthquakes);

  // Then we add the earthquake layer to our map.
  earthquakes.addTo(map);
});
/////////////////////////////////////////////// MAJOR EARTHQUAKES //////////////////////////////////////////////////////

// Deliverable 2: Step 3, use the d3.json() callback method to make a call to the major earthquake data from the GeoJSON
// Summary Feed for M4.5+ Earthquakes for the Past 7 Days.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson").then(function (data) {

  // Deliverable 2: Step 4, use the same parameters in the styleInfo() function
  // that will make a call to the getColor() and getRadius() functions.
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  // Deliverable 2: Step 5, change the getColor() function to use only three colors for the following magnitudes;
  // magnitude less than 5, a magnitude greater than 5, and a magnitude greater than 6.
  function getColor(magnitude) {
    if (magnitude > 6) {
      return "blue";
    }
    if (magnitude > 5) {
      return "white";
    }
    return "none";
  }

  // Deliverable 2: Step 6, use the same parameters from the preceding step in the getRadius() function.  
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 4;
  }

  // Deliverable 2: Step 7, pass the major earthquake data into the GeoJSON layer and do the following with the geoJSON() layer:
  // Turn each feature into a circleMarker on the map
  // Style each circle with styleInfo() function
  // Create a popup for the circle to display the magnitude and location of the earthquake
  // Add the major earthquake layer group variable
  L.geoJson(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: styleInfo,
    onEachFeature: function (feature, layer) {
      layer.bindPopup("<h2>Magnitude: " + feature.properties.mag + "</h2> <hr> <h3>Location: " + feature.properties.place + "</h3>");
    }
  }).addTo(majorEQ);

  // Deliverable 2: Step 8, add the major earthquake layer group variable to the map, i.e, majorEQ.addTo(map), and then close the d3.json() callback.
  majorEQ.addTo(map);
});

// Here we create a legend control object.
let legend = L.control({ position: "bottomright" });

// Then add all the details for the legend
legend.onAdd = function () {
  let div = L.DomUtil.create("div", "info legend");

  const magnitudes = [0, 1, 2, 3, 4, 5];
  const colors = [
    "#98ee00",
    "#d4ee00",
    "#eecc00",
    "#ee9c00",
    "#ea822c",
    "#ea2c2c"
  ];

  // Looping through our intervals to generate a label with a colored square for each interval.
  for (var i = 0; i < magnitudes.length; i++) {
    console.log(colors[i]);
    div.innerHTML +=
      "<i style='background: " + colors[i] + "'></i> " +
      magnitudes[i] + (magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] + "<br>" : "+");
  }
  return div;
};

// Finally, we add our legend to the map.
legend.addTo(map);

/////////////////////////////////////////////// TECTONIC PLATES //////////////////////////////////////////////////////

// Deliverable 1: Step 3, using d3.json() callback method, make a call to the tectonic plate data using the 
// GeoJSON/PB2002_boundaries.json data from this GitHub repository for the tectonic plate data. 
d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then((data) => {
  L.geoJson(data, {
    style: { color: "#703606", weight: 3 },
  }).addTo(tectonicPlates);

  // Add the tectonic layer group to the map.
  tectonicPlates.addTo(map);
});