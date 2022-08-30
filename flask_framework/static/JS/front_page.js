// load the map
mapboxgl.accessToken = 'pk.eyJ1IjoidHJhdmVyc2FsIiwiYSI6ImNsN2dvZjhzZDA2Z2gzdG85bzgydDJ5YjEifQ.ofShUt_XPbwQtpYikGJlhg';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [6.301957,62.467713], // starting position [lng, lat]
    zoom: 17, // starting zoom
    projection: 'globe' // display the map as a 3D globe
});
 
map.on('style.load', () => {
    map.setFog({}); // Set the default atmosphere style
});

// Create a default Marker, colored black, rotated 45 degrees.
const marker2 = new mapboxgl.Marker({ color: 'black', rotation: 0 })
    .setLngLat([6.301957,62.467713])
    .setPopup(new mapboxgl.Popup().setHTML("<a href=\"/historical\">Historial data</a>"))
    .addTo(map);