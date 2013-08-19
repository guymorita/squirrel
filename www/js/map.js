var Map = function(){
  this.slidePage = function (path,type) {
    navSvc.slidePage(path,type);
    $('#map').remove();
  };
  
  $('body').append('<div id="map"></div>');
  this.map = L.map('map', {
    center: [51.505, -0.09],
    zoom: 13
  });
  
  L.tileLayer('http://otile3.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
      maxZoom: 18
  }).addTo(this.map);

  this.map.locate({setView: true, maxZoom: 16});

  this.onLocationFound = function(e) {
      this.radius = e.accuracy / 2;

      L.marker(e.latlng).addTo(this.map)
                        .dragging.enable();
      this.newLocation = {
        _id: locationID,
        lat: e.latlng.lat,
        lng: e.latlng.lng
      }
      locationObj[locationID] = newLocation;
      locationID++;
  }

  this.map.on('locationfound', this.onLocationFound);

  this.onLocationError = function(e) {
    alert(e.message);
  }

  this.map.on('locationerror', this.onLocationError);
}