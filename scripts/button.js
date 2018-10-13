const distance = 10;
var KEY_TA = "47E95D014FC94726A766DE678392A416";
var coords;

//@TODO: get these values from gui
var finalDest = {latitude: 0, longitude: 0}; //@TODO: real values, maybe just initialize to boston MA


//type is exactly either "restaurants" or "attractions"
//distance in miles user is willing to travel
//lat and lng are latitude and longitude values of the user
  //Might also call twice; once for current destination, once for final destination
function getLocations(distance, type, lat, lng)
{
	var xmlHttp = new XMLHttpRequest();
	//distance unused in this version
	xmlHttp.open( "GET","http://api.tripadvisor.com/api/partner/2.0/map/" + lat + "," + lng + "/" + type + "?key=" + KEY_TA, false );
	
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
	      coords = {latitude: 90,
                  longitude: 0};
	  }
}

function recordPosition(position) {
    coords = {latitude: position.coords.latitude,
              longitude: position.coords.longitude};

    var listLocsUP = getLocations(distance, "restaurants", coords.latitude, coords.longitude);

    parseLocations(listLocsUP);
}

getLocation();


//var str = getLocations(10, "restaurants", "42.418560", "-71.106450");
/*listLocsUP is a string*/

//test data