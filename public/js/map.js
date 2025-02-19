document.addEventListener("DOMContentLoaded",()=>{
  let mapElement = document.getElementById("map");

  // Get coordinates from data attributes
  let lat = mapElement.getAttribute("data-lat");
  let lng = mapElement.getAttribute("data-lng");

  // Default coordinates if not provided
  lat = lat ? parseFloat(lat) : 21.76287;
  lng = lng ? parseFloat(lng) : 72.15331;

  // Initialize map
  let map = L.map("map").setView([lat, lng], 10);

  
  //use from openStreetMap
  //for showing map it's necessary to use tiles
  let tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  let attribution = "&copy; WanderNest";

  //in map is working on layers . so our base layer is tilelayer and above this we can diffrent layers like circle layer and all
  // Add a tile layer (OpenStreetMap)
  L.tileLayer(tileUrl, { attribution }).addTo(map);

  //circle layer
  //it's take the location first then object for options
  //   let circleLayer = L.circle([21.76287, 72.15331], { radius: 200 });
  //   circleLayer.addTo(map);

  //polygon
  //we can made any of shape using this . we need to give array of cordinated of all point of shape.like if it is triangle then we need to give 3 point..

  //for TRIANGLE
  //location of bermudaTriangle
  //   let bermudacoors = [
  //     [25.7617, -80.1918], // Miami, Florida, USA
  //     [18.4655, -66.1057], // San Juan, Puerto Rico
  //     [32.3078, -64.7505], // Bermuda (Hamilton, Bermuda)
  //   ];
  //   let PolygonLayer = L.polygon(bermudacoors, { color: "red" }).addTo(map);
  //   // zoom the map to the polyline
  //   map.fitBounds(polygon.getBounds());

  //line draw
  // create a red polyline from an array of LatLng points
  //   var latlngs = [
  //     [45.51, -122.68],
  //     [37.77, -122.43],
  //     [34.04, -118.2],
  //   ];

  //   var polyline = L.polyline(latlngs, { color: "red" }).addTo(map);

  // zoom the map to the polyline
  //   map.fitBounds(polyline.getBounds());

  // //custom icon
  // let myIcon = L.icon({
  //     iconUrl:
  //     "https://tse4.mm.bing.net/th?id=OIP.ni29-sNKfKa1LugE05I6wQHaL_&pid=Api&P=0&h=180",
  //     iconSize: [38, 95],
  // });

  //MARKERS
  let marker = L.marker([lat,lng]);
  marker.bindPopup("WanderLust"); // we can give html also in this
  marker.addTo(map);
})