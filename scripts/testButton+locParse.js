

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
}

getLocation();

//var str = getLocations(10, "restaurants", "42.418560", "-71.106450");
/*listLocsUP is a string*/
var listLocsUP = getLocations(10, "restaurants", coords.latitude, coords.longitude);
console.log(listLocsUP);




/*
 - parameters:
 	- for user: 
 		- longitude
 		- latitude
 		- (desired current time)
 		- (desired total time)
 		- (desired attractions)
 		- (list of visited locations)
 		- 
 	- for the output:
 		- List of (10) nearest locations, for each location:
 			- longitude
 			- latitude
 			- distance(longitude, latitude)
 			- Rating:
 			- Num of Reviews:
 			- Attraction type:
 			- 

*/

/*
var User = 
{
	longitude,
	latitude,
	//curTime,
	//availTime,
	//attracts,
	//visiedLocs = [],
};



var Locations = 
{
	longitude,
	latitude,
	rating,
	numReviews,
	attract,
	//timeOpen,
	//timeClose,
};
*/

/*@TODO:
	- Actually get the object from the API
	- Pass back a sorted list of parsed locations along with sorted list of unparsed locations
		- Ratings and Reviews passed in unparsed locations
		- @TODO: both lists sorted and of same length, so index i corresponds to the same locations
		in both lists
	- Remove duplicates
	- Implement / Remove already visited locations
	- Attraction preferences
	- Add in time functionality
		- Also @TODO: here for additional pruning when creating routes
	- Maybe creating routes?

	- Getting time data (Travel AND estimated stay time)
		- @Stay time: maybe let the user edit the amount of time they estimate to spend 
		at a location AFTER "route" is returned
	- After returning list to user:
		- ^@Above: let user edit amount of time for individual locations
		- Let user delete individual locations from the list that they've either:
			a. Been to already (esp. if we don't implement the "list of locations traveled")
			b. Don't want to go to that location (based on yet-to-be implemented ratings and ratings)
*/


const numLocs = 10;
let day = 0; //Enumerated ?
const timeBuffer = 60; //in minutes


function User(lat, long)
{
	this.latitude = lat;
	this.longitude = long;
	//this.time = //calculate from 60*hours + minutes
	//availTime,
	//attracts,
	//visiedLocs = [],
}
function Location(id, lat, long, rat, nR, a)
{
	this.id = id;
	this.latitude = lat;
	this.longitude = long;
	this.rating = rat;
	this.numReviews = nR;
	this.attract = a;
	this.distance = function(uLat, uLong) 
	{
		return Math.pow(Math.pow(uLong-this.longitude, 2) + Math.pow(uLat - this.lat), 0.5);
	}
}

/*Compares two locations based first on rating then on number of reviews. 
	If tied for both, first come first serve.*/
function compLocs(loc1, loc2)
{
	if (loc1.rating != loc2.rating) {
		return loc1.rating > loc2.rating;
	} else {
		return loc1.numReviews > loc2.numReviews;
	}
}

function timeToInt(time)
{
	var hours = parseInt(time.substr(0, 2));
	var minutes = parseInt(time,substr(3,5));

	return 60 * hours + minutes;
}

//@TODO:
function removeDuplicates(listLocs)
{

}

/*Test Initializations*/

var list = JSON.parse(listLocsUP); //list passed in

var user = User(coords.latitude, coords.longitude);
var listLocs = [];		//final sorted list of parsed locations

/*This is where you parse from the 10 locations passed to you*/
for (int i = 0; i < numLocs; i ++) {
	var id = list[i].location_id;
	var lat = list[i].latitude;
	var long = list[i].longitude;
	var rat = list[i].rating;
	var nR = list[i].num_reviews;
	var a = list[i].attraction_types["name"];
	//var oT = list[i].hours.week_ranges[day].times["open_time"];//
	//var cT = list[i].hours.week_ranges[day].times["close_time"];
	//if (!(currTime /*+ travelTime*/ > timeToInt(oT) && currTime < timeToInt(cT) - timeBuffer)) {
		//break;
	//}

	//Remove visited: Parse through the user list and if id's match, break;

	var loc = Location(lat, long, rat, nR, a);

	listLocs[i] = loc;
}

listLocs.sort(compLocs); //Sorts based on compLocs, v nice, ehyyyy
//remove duplicates

/*Giving user options for what to do: 
	- Technically they parse the info, give it to user, but we might write the code for that anyways*/


console.log(listLocs);	