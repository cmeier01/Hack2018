

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
	xmlHttp.send();
	return xmlHttp.responseText;
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(recordPosition);
    } else {
        console.log("Geolocation is not supported by this browser.");
	 coords = {latitude: 90,
                   longitude: 0};
	}
    }
}
function recordPosition(position) {
    coords = {latitude: position.coords.latitude,
              longitude: position.coords.longitude};
}

//var str = getLocations(10, "restaurants", "42.418560", "-71.106450");
console.log(str);
