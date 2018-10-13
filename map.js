var stopsJSON = [{'stop_lat': '42.395428', 'stop_name': 'Alewife', 'stop_lon': '-71.142483', 'stop_id': 'place-alfcl'}, {'stop_lat': '42.39674', 'stop_name': 'Davis', 'stop_lon': '-71.121815', 'stop_id': 'place-davis'}, {'stop_lat': '42.3884', 'stop_name': 'Porter Square', 'stop_lon': '-71.11914899999999', 'stop_id': 'place-portr'}, {'stop_lat': '42.373362', 'stop_name': 'Harvard Square', 'stop_lon': '-71.118956', 'stop_id': 'place-harsq'}, {'stop_lat': '42.365486', 'stop_name': 'Central Square', 'stop_lon': '-71.103802', 'stop_id': 'place-cntsq'}, {'stop_lat': '42.36249079', 'stop_name': 'Kendall/MIT', 'stop_lon': '-71.08617653', 'stop_id': 'place-knncl'}, {'stop_lat': '42.361166', 'stop_name': 'Charles/MGH', 'stop_lon': '-71.070628', 'stop_id': 'place-chmnl'}, {'stop_lat': '42.35639457', 'stop_name': 'Park Street', 'stop_lon': '-71.0624242', 'stop_id': 'place-pktrm'}, {'stop_lat': '42.355518', 'stop_name': 'Downtown Crossing', 'stop_lon': '-71.060225', 'stop_id': 'place-dwnxg'}, {'stop_lat': '42.352271', 'stop_name': 'South Station', 'stop_lon': '-71.05524200000001', 'stop_id': 'place-sstat'}, {'stop_lat': '42.342622', 'stop_name': 'Broadway', 'stop_lon': '-71.056967', 'stop_id': 'place-brdwy'}, {'stop_lat': '42.330154', 'stop_name': 'Andrew', 'stop_lon': '-71.057655', 'stop_id': 'place-andrw'}, {'stop_lat': '42.320685', 'stop_name': 'JFK/UMass', 'stop_lon': '-71.052391', 'stop_id': 'place-jfk'}, {'stop_lat': '42.275275', 'stop_name': 'North Quincy', 'stop_lon': '-71.029583', 'stop_id': 'place-nqncy'}, {'stop_lat': '42.2665139', 'stop_name': 'Wollaston', 'stop_lon': '-71.0203369', 'stop_id': 'place-wlsta'}, {'stop_lat': '42.251809', 'stop_name': 'Quincy Center', 'stop_lon': '-71.005409', 'stop_id': 'place-qnctr'}, {'stop_lat': '42.233391', 'stop_name': 'Quincy Adams', 'stop_lon': '-71.007153', 'stop_id': 'place-qamnl'}, {'stop_lat': '42.2078543', 'stop_name': 'Braintree', 'stop_lon': '-71.0011385', 'stop_id': 'place-brntn'}, {'stop_lat': '42.31129', 'stop_name': 'Savin Hill', 'stop_lon': '-71.053331', 'stop_id': 'place-shmnl'}, {'stop_lat': '42.300093', 'stop_name': 'Fields Corner', 'stop_lon': '-71.061667', 'stop_id': 'place-fldcr'}, {'stop_lat': '42.29312583', 'stop_name': 'Shawmut', 'stop_lon': '-71.06573796000001', 'stop_id': 'place-smmnl'}, {'stop_lat': '42.284652', 'stop_name': 'Ashmont', 'stop_lon': '-71.06448899999999', 'stop_id': 'place-asmnl'}];


var map;
//the following function runs an http get request based on a station ID to return a sechedule JSON
//this is a synconous request which slows down the functionality of the page, but slowdown is very
//minimal
function getSchedule(ID)
{
	var xmlHttp = new XMLHttpRequest();	
	xmlHttp.open( "GET","https://mbta-lab-3.herokuapp.com/redline/schedule.json?stop_id=" + ID, false );
	xmlHttp.send( null );
	return xmlHttp.responseText;
}


function initMap() {
	var map = new google.maps.Map(document.getElementById('map'), {
	center: {lat: 42.352271 , lng: -71.05524200000001},
		zoom: 12
        });

	//add a subway marker for each red line stop
	for(var i = 0; i < 22; i++){
		var LatLng = new google.maps.LatLng(stopsJSON[i].stop_lat, stopsJSON[i].stop_lon)
		stopsJSON[i].latlng = LatLng //add the latlng object to the JSON data for future use
		var marker = new google.maps.Marker({
			position: LatLng,
			title: stopsJSON[i].stop_name,
			icon: "subway_icon_extra_small.png"
		});

		//the following code is added in part 2 to create the train schedule functionality
	
        	var infowindow = new google.maps.InfoWindow({
        		content: ""
        	});

        	marker.setMap(map);	
		
	
		//the folowing code creates an event listener whose
		//content is determined when it is clicked, so that all of the data doesnt need
		//to be loaded when the page is opened. The setContent() method is used
	        marker.addListener('click', function() {
			//use the name of the location to determine the index in the stopsJSON list
			var name = this.title;
			var index;
			for (var k = 0; k < 22; k++){
				if(name == stopsJSON[k].stop_name){
					index = k;
				}
			}
			var schedule = getSchedule(stopsJSON[index].stop_id);
			schedule = JSON.parse(schedule);

			var contentString = "<h1>Schedule for " + name + "</h1><div>";
			for (var j = 0; j < 10; j++){
				//this prevents crashes from API failing to provide 10 trains worth of info
				if(j in schedule.data){
					contentString += "<h2>Train " + (j+1) + "</h2>"; 
					contentString += 
						"<p>arrives: " + schedule.data[j].attributes.arrival_time + "</p>" +
						"<p>departs: " + schedule.data[j].attributes.departure_time + "</p>" + "<p>";
					if(schedule.data[j].attributes.direction_id == 1) {
						contentString += "Northbound</p>";
					} else{
						contentString += "Southbound</p>";
					}
					contentString += "<p></p><p></p>";
				}
			}
			contentString += "</div>";
			infowindow.setContent(contentString);

			infowindow.open(map, this);
	        });               
		
	}
	
	var line_one_coordinates = [];
	//the connection between savin hill and JFK is hard coded in
	var line_two_coordinates = [{lat: 42.320685, lng: -71.052391}];

	for(i = 0; i < 18; i++){
		line_one_coordinates[i] = {lat: parseFloat(stopsJSON[i].stop_lat), lng: parseFloat(stopsJSON[i].stop_lon)};
	}
	
	for(i = 18; i < 22; i++){
		line_two_coordinates[i-17] = {lat: parseFloat(stopsJSON[i].stop_lat), lng: parseFloat(stopsJSON[i].stop_lon)};
	}

	var line_one = new google.maps.Polyline({
	          path: line_one_coordinates,
	          geodesic: true,
        	  strokeColor: '#FF0000',
          	  strokeOpacity: 1.0,
          	  strokeWeight: 2
        });	

	var line_two = new google.maps.Polyline({
	          path: line_two_coordinates,
	          geodesic: true,
        	  strokeColor: '#FF0000',
          	  strokeOpacity: 1.0,
          	  strokeWeight: 2
        });	

	line_one.setMap(map);
	line_two.setMap(map);

	//all of the following code was added in part 2 related to the user location
	
	if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
	    var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

		   
	var contentString = "";
		 
	var close_station_coord;
	var distances = [];
	for (i = 0; i < 22; i++){
		var distance = google.maps.geometry.spherical.computeDistanceBetween(stopsJSON[i].latlng, pos) * 0.000621371;
		//distance is the distance, in miles, between the user and train station i. 0.000621371 is the meter->mile conversion
		stopsJSON[i].my_dist = distance;
		distances[i] = distance;
	}
	distances.sort();
	for (i = 0; i < 22; i++){
		for (j = 0; j < 22; j++){
			if(distances[i] == stopsJSON[j].my_dist){
				if(i == 0){
					close_station_coord = stopsJSON[j].latlng;
					contentString += '<div id="content">'+
        	    			'<div id="siteNotice">'+
        	    			'</div>'+
        	    			'<h1 id="firstHeading" class="firstHeading">Closest Stations</h1>'+
        	    			'<div id="bodyContent">'+
		    			'you are nearest to '+ stopsJSON[j].stop_name + ' station' +
		    			'<p></p>' +
        	    			'</div>';
				}
				contentString += "<div>" + stopsJSON[j].stop_name + " Station:   " + distances[j].toFixed(2) + " miles</div>";
			}
		}
	}	
	
	



        var infowindow = new google.maps.InfoWindow({
        	content: contentString
        });
	var loc_marker = new google.maps.Marker({
         	position: pos,
                title: "Your Location"
       	});
        loc_marker.setMap(map);	


        loc_marker.addListener('click', function() {
		infowindow.open(map, this);
        });               
               
        
	var line_loc_to_nearest = new google.maps.Polyline({
	          path: [pos, close_station_coord],
	          geodesic: true,
        	  strokeColor: '#00FF00',
          	  strokeOpacity: 1.0,
          	  strokeWeight: 3
        });
	line_loc_to_nearest.setMap(map);


    	//end function based on geolocation being enabled
          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
	}
	

	

	

}

	function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        	infoWindow.setPosition(pos);
        	infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
     }




