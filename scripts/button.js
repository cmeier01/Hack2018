var KEY = "47E95D014FC94726A766DE678392A416";
var coords;
//type is exactly either "restaurants" or "attractions"
//distance in miles user is willing to travel
//lat and lng are latitude and longitude values of the user
function getLocations(distance, type, lat, lng)
{
	var xmlHttp = new XMLHttpRequest();
	//distance unused in this version
	xmlHttp.open( "GET","http://api.tripadvisor.com/api/partner/2.0/map/" + lat + "," + lng + "/" + type + "?key=" + KEY, false );
	
        //xmlHttp.open( "GET","http://api.tripadvisor.com/api/partner/2.0/map/" + lat + "," + lng + "/" + type + "?key=" + KEY + "?distance=" + distance, false );
        xmlHttp.send();
	return xmlHttp.responseText;
}

/*Gets the user's location using navigator*/
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(recordPosition);
    } else {
        console.log("Geolocation is not supported by this browser.");
<<<<<<< HEAD
	      coords = {latitude: 90,
                  longitude: 0};
	  }
=======
	 coords = {latitude: 90,
                   longitude: 0}; //placeholder value
	}
    }
>>>>>>> faf918950644b88fab1c8a9586569c1a434d229e
}

function recordPosition(position) {
    coords = {latitude: position.coords.latitude,
              longitude: position.coords.longitude};
}

<<<<<<< HEAD
getLocation();

//var str = getLocations(10, "restaurants", "42.418560", "-71.106450");
/*listLocsUP is a string*/
var listLocsUP = getLocations(10, "restaurants", coords.latitude, coords.longitude);
console.log(listLocsUP);
=======
//test data
//var str = getLocations(10, "restaurants", "42.418560", "-71.106450");

//getLocation();
//var str = getLocations(10, "restaurants", coords.latitude , coords.longitude);
console.log(str);
>>>>>>> faf918950644b88fab1c8a9586569c1a434d229e
