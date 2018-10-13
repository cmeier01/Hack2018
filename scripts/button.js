

var KEY = 47E95D014FC94726A766DE678392A41
//type is exactly either "resturants" or "attractions"
//distance in miles user is willing to travel
//lat and lng are latitude and longitude values of the user
function getLocations(distance, type, lat, lng)
{
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open( "GET","http://api.tripadvisor.com/api/partner/2.0/map/" + lat + "," + lng +"/" + type "?key=" + KEY, false );
	xmlHttp.send( null );
	return xmlHttp.responseText;
}

