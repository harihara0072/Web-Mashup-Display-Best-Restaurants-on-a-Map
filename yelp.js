var map;
var marker;
var markers = [];

function initialize () {
  map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 32.75, lng: -97.13},
          zoom: 16
        });
      }


function sendRequest () {
   for(var m = 0; m < markers.length; m++){
    markers[m].setMap(null);
   }
   var search = document.getElementById("search").value;
   var new_search = search.split(" ").join("+");
   var bounds = map.getBounds();
   var lat = bounds.getSouthWest().lat();
   var long = bounds.getNorthEast().lng();
   var rad = google.maps.geometry.spherical.computeDistanceBetween(bounds.getSouthWest(), bounds.getNorthEast());
   var new_rad = (Math.round(rad/2)).toString();
   var xhr = new XMLHttpRequest();
   xhr.open("GET", "proxy.php?term="+ new_search + "&latitude="+lat+"&longitude="+long+"&radius="+ new_rad +"&limit=10");
   xhr.setRequestHeader("Accept","application/json");
   xhr.onreadystatechange = function () {
       if (this.readyState == 4) {
          var json = JSON.parse(this.responseText);
          var str = JSON.stringify(json,undefined,2);
          var length = json.businesses.length
          if(length == 0){
            document.getElementById("output").innerHTML = "<h3> No matching restaurants found </h3>";
          }
          else{
            var count = 1;
            var table =  "<table style='width:100%' border='1px solid black'><tr><th align='left'>Name</th><th align='left'>Image</th><th align = 'left'>Rating</th></tr>";
            for(var i = 0; i <length; i ++){
              var cords = json.businesses[i].coordinates;
              setmarker(cords, count);
              count++;
              table += "<tr><td><a href='" + json.businesses[i].url +"'>"+ json.businesses[i].name + " </a></td><td><img src='" + json.businesses[i].image_url + "' style='width:100px;height:100px;'</td> <td>"+ json.businesses[i].rating +"</td></tr>"
          }
            document.getElementById("output").innerHTML = table ;
          }
          
       }
   };
   xhr.send(null);
}

function setmarker(cordinates, c){
  marker = new google.maps.Marker({
    map: map,
    draggable: true,
    animation: google.maps.Animation.DROP,
    position: {lat: cordinates.latitude , lng:cordinates.longitude },
    title: c.toString(),
    label: c.toString()
  });
  markers.push(marker);
}
