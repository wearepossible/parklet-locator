// Access token
mapboxgl.accessToken = 'pk.eyJ1Ijoid2VhcmVwb3NzaWJsZSIsImEiOiJja3FrcXk1bnMwZXduMnBuc2kwMnY5eDBwIn0.9mpiXSSZEwSlwSeKs6XyNw';

// Set up the map
var map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/wearepossible/ckmx9appa0lw117n2trmek7bq', // style URL
    center: [-0.12, 51.51], // starting position [lng, lat]
    zoom: 10 // starting zoom
});

// Add navigation controls on map
map.addControl(new mapboxgl.NavigationControl());

// Fly to different cities
const gotoLondon = () => map.flyTo({ center: [-0.12, 51.51], zoom: 10 });
const gotoBirmingham = () => map.flyTo({ center: [-1.90, 52.48], zoom: 11 });
const gotoLeeds = () => map.flyTo({ center: [-1.55, 53.80], zoom: 11 });
const gotoBristol = () => map.flyTo({ center: [-2.59, 51.45], zoom: 11 });

// Create a function that executes when the button is clicked
const locApprove = () => {

    // Display a loading gif
    document.getElementById("nearest-loading").style.display = 'inline';

    // Get the user's actual latitude and longitude
    navigator.geolocation.getCurrentPosition(function (position, html5Error) {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;

        // Hide the loading gif again once loaded
        document.getElementById("nearest-loading").style.display = 'none';

        // Move the world map to your location
        map.flyTo({ center: [userLon, userLat], zoom: 15 });

    });
};

// Function to switch layers
const layerChange = (chosenLayer) => {

    const layers = ["public_greenspace", "private_greenspace", "imd", "carsperperson"]

    // Turn off all layers
    for (let layer of layers) {
        map.setLayoutProperty(layer, 'visibility', 'none');
        document.getElementById(layer).style.display = "none";
        document.getElementById(`btn-${layer}`).style.background = "#BF0978";
        document.getElementById(`btn-${layer}`).style.color = "#ffffff";
        document.getElementById(`btn-${layer}`).style.outline = "none";
    }

    // Turn on the layer you want
    map.setLayoutProperty(chosenLayer, 'visibility', 'visible');
    document.getElementById(chosenLayer).style.display = "block";
    document.getElementById(`btn-${chosenLayer}`).style.background = "#ffffff";
    document.getElementById(`btn-${chosenLayer}`).style.color = "#BF0978";
    document.getElementById(`btn-${chosenLayer}`).style.outline = "2px solid #BF0978";

}

// Setup Mapbox Draw
const draw = new MapboxDraw(
    {
        defaultMode: "draw_point",
        displayControlsDefault: false,
        styles: [
            {
                'id': 'highlight-points',
                'type': 'circle',
                'filter': ['all',
                    ['==', '$type', 'Point'],
                    ['==', 'meta', 'feature']],
                'paint': {
                    'circle-radius': 10,
                    'circle-color': '#32B08C',
                    'circle-stroke-color': 'white',
                    'circle-stroke-width': 2,
                    'circle-opacity': 0.5
                }
            }]
    });
map.addControl(draw);

// Create variables to hold the details of the location
let locID, loc, locLat, locLng;

// Click to place a parklet
map.on('click', function (e) {

    // Save location of click
    //console.log(e);
    locLat = e.lngLat.lat;
    locLng = e.lngLat.lng;

    // Get rid of all previously drawn points
    draw.deleteAll();

    // Define a new point
    loc = draw.add({
        id: locID,
        type: 'Feature',
        properties: {},
        geometry: { type: 'Point', coordinates: [locLng, locLat] }
    });

    // Log its ID
    locID = loc[0];

    // Log details of new point
    //console.log(draw.get(locID));

    // Zoom to location
    map.flyTo({ center: [locLng, locLat], zoom: 16 });
});

function submit() {

    const pointData = {
        datetime: new Date().toLocaleString('en-GB', { timeZone: 'UTC' }),
        lat: locLat,
        lng: locLng
    }

    if (pointData.lat && pointData.lng) {
        SheetDB.write('https://sheetdb.io/api/v1/m6npscfti1l0q', { sheet: 'parklets', data: pointData }).then(function (result) {
            console.log(result);
        }, function (error) {
            console.log(error);
        });
    }
}