var filmlist = new Array();
	$(document).bind("pageinit", function(){
		$.getJSON('http://elastic.restopengov.org/gcba/set-filmaciones/_search?q=Fecha%20de%20Rodaje:11/01/2011&size=10', function(data){
			for(i = 0; i < data.hits.hits.length; i++){
				var num = data.hits.hits[i]._source["Número"];
				num = Math.round(num);				
				filmdire = data.hits.hits[i]._source["Calle de Locación"] + " " + num + ", Ciudad Autónoma de Buenos Aires, Argentina";
				filmtit = data.hits.hits[i]._source["Título del Proyecto"];
				filmtip = data.hits.hits[i]._source["Tipo de Producción"];
				console.log(data.hits.hits[i]._source["Calle de Locación"]);
				filmlist[i] = [filmdire, filmtit, filmtip];
		}	
						mapa(filmlist);	
		});
		
	});
	
	var map;
	var baires = new google.maps.LatLng(-34.6166667, -58.44999999999999);
	var geocoder = new google.maps.Geocoder();
	var mapStyles = [
	              {
	                featureType: "poi.business",
	                stylers: [
	                  { visibility: "off" }
	                ]
	              },{
	                featureType: "road",
	                elementType: "labels",
	                stylers: [
	                  { visibility: "on" }
	                ]
	              },{
	                featureType: "road",
	                elementType: "labels",
	                stylers: [
	                  { visibility: "on" }
	                ]
	              },{
	                featureType: "road",
	                elementType: "geometry",
	                stylers: [
	                  { visibility: "simplified" },
	                  { lightness: 40 }
	                ]
	              },{
	                featureType: "transit.line",
	                stylers: [
	                  { visibility: "on" }
	                ]
	              },{
	                featureType: "transit.station.bus",
	                stylers: [
	                  { visibility: "off" }
	                ]
	              }
	            ];
	
function mapa(filmlist){

		  var myOptions = {
	         zoom:12,minZoom: 9,center:baires,mapTypeId:google.maps.MapTypeId.ROADMAP,disableDefaultUI: true,
		    styles: mapStyles
	        };
	        map = new google.maps.Map(document.getElementById('map_canvas'),
	            myOptions);
	
				// Safari supports the W3C Geolocation method
			  if(navigator.geolocation) {
			    navigator.geolocation.getCurrentPosition(function(position) {
			      initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
			     
				var locCircleOptions = {
				      strokeColor: "#FF0000",
				      strokeOpacity: 0.5,
				      strokeWeight: 2,
				      fillColor: "#FF0000",
				      fillOpacity: 1,
				      map: map,
				      center: initialLocation,
				      radius: 200
				    };
			    	var locCircle = new google.maps.Circle(locCircleOptions);
			
			      map.setCenter(initialLocation);
			    }, function() {
			      handleNoGeolocation(browserSupportFlag);
			    });
			  } else {
			    // Browser doesn't support Geolocation
			    handleNoGeolocation();
			  }

			  function handleNoGeolocation() {
			    initialLocation = baires;
			    map.setCenter(initialLocation);
			  }
	
	
	for(i=0; i < filmlist.length; i++){
		geocodeit(map, filmlist[i][0], filmlist[i][1], filmlist[i][2]);
	}
}
function geocodeit(map, dire, film, tipo){
	var geoOptions = {
      address: dire,
      region: "NO"
    };
		geocoder.geocode(geoOptions, geoCallback(map, film, tipo));
}
function geoCallback(map, film, tipo) {
   return function(results, status) {
     if (status == google.maps.GeocoderStatus.OK) {
       addMarker(map, film, tipo, results[0].geometry.location);	
		if(film==1){ // si hay una sola idea posicionar el mapa en esa idea
			map.setCenter(results[0].geometry.location);
		}
     } else {
       console.log("Geocode failed " + status);
     }
   };
 }
function addMarker(map, film, tipo, location) {
  var marker = new google.maps.Marker({ map : map, position : location, title: film});
  var infowindow = new google.maps.InfoWindow( {
    content : film
  });
  new google.maps.event.addListener(marker, "click", function() {
	$('.data').empty().html(film+"<br /><small>"+tipo+"</small>");
  });
}