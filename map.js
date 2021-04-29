
// Access token
mapboxgl.accessToken = 'pk.eyJ1Ijoid2VhcmVwb3NzaWJsZSIsImEiOiJja2tncjNkdGMxODJ3MnBxdWllMXhncDV2In0.ud6gHlMUoxsJS5yDPdXtaA';

// Set up the map
var map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [-0.12, 51.5], // starting position [lng, lat]
    zoom: 9 // starting zoom
});