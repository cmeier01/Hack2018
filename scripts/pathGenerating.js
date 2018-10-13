var KEY = AIzaSyDzc3RwxBdsanvGcvASbFUSUmZgrRlT2v8;

function getTravelPath(oLat, oLong, dLat, dLong, mode)
{
	var xmlHttp = new XMLHttpRequest();
	//distance unused in this version														//IDK if this - is supposed to be here //@NVM im dum af
	xmlHttp.open( "GET","http://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins="+latitude+","+longitude+"&destinations="+dLat+"%2C" + dLong + "%7C&mode=" + mode + "&key=" + KEY, false);
	
        xmlHttp.send();
	return xmlHttp.responseText;
}


/*Available parameters:
	- listLoc which has main info for nearest locations
	- list which has total info for nearest locations
		- Both sorted low-->high
	- a json format of the Google API (needs to be parsed for time data)

  Needed for calcs:
	- time data between each (?) point
	- amount of time a person is willing to spend at a spot (can be defaulted to an hour)
	- 

  General Algo?
	- //Initialize itinerary list (closest allowable point to farthest?)
	- Heuristic: least amount of "overlap" in lat and long directions?
	- Backwards cost: amount of time taken to get to each node
	- 

*/