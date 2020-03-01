
  function httpGet(theUrl)
  {
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
      xmlHttp.send( null );
      return xmlHttp.responseText;
  }
const map = new ol.Map({
    target: 'map',
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ],
    view: new ol.View({
      projection:'EPSG:4326',
      center: ol.proj.transform([-70, 40], 'EPSG:4326', 'EPSG:4327') ,
      zoom: 20
    })
  });
  
//reg_json=JSON.parse(httpGet("/api/data"));
  var stroke = new ol.style.Stroke({color: 'black', width: 2});
  var fill = new ol.style.Fill({color: 'red'});
  var markerVectorLayer = new ol.layer.Vector
  ({
    source: new ol.source.Vector(
        {
            url:"/api/data",
            format: new ol.format.GeoJSON()  
        }
    )
  });
  /*
  map.addLayer(markerVectorLayer);
 map.on("click",handleMapClick);
  function handleMapClick(evt){
    var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
    return feature;
    });
    if (feature) {
        var att = feature.getProperties();
        document.getElementById("name").innerText=att.attributes.name;
        document.getElementById("height").innerText=att.attributes.height;
    }

    
}*/

