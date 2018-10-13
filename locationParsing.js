/*
 - parameters:
 	- for user: 
 		- longitude
 		- lattitude
 		- (desired current time)
 		- (desired total time)
 		- (desired attractions)
 		- (list of visited locations)
 		- 
 	- for the output:
 		- List of (10) nearest locations, for each location:
 			- longitude
 			- lattitude
 			- distance(longitude, lattitude)
 			- Rating:
 			- Num of Reviews:
 			- Attraction type:
 			- 

*/

/*
var User = 
{
	longitude,
	lattitude,
	//curTime,
	//availTime,
	//attracts,
	//visiedLocs = [],
};



var Locations = 
{
	longitude,
	lattitude,
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


function User(long, lat)
{
	this.longitude = long;
	this.lattitude = lat;
	//this.time = //calculate from 60*hours + minutes
	//availTime,
	//attracts,
	//visiedLocs = [],
}
function Location(id, long, lat, rat, nR, a)
{
	this.id = id;
	this.longitude = long;
	this.lattitude = lat;
	this.rating = rat;
	this.numReviews = nR;
	this.attract = a;
	this.distance = function(uLong, uLat) 
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

	return 60*hours + minutes;
}

//@TODO:
function removeDuplicates(listLocs)
{

}

/*Test Initializations*/

var list = JSON.parse(/*API object*/); //list passed in

var user = User(0,0);
var listLocs = [];		//final sorted list of parsed locations

/*This is where you parse from the 10 locations passed to you*/
for (int i = 0; i < numLocs; i ++) {
	var id = list[i].location_id;
	var long = list[i].longitude;
	var lat = list[i].lattitude;
	var rat = list[i].rating;
	var nR = list[i].num_reviews;
	var a = list[i].attraction_types["name"];
	//var oT = list[i].hours.week_ranges[day].times["open_time"];//
	//var cT = list[i].hours.week_ranges[day].times["close_time"];
	//if (!(currTime /*+ travelTime*/ > timeToInt(oT) && currTime < timeToInt(cT) - timeBuffer)) {
		//break;
	//}

	//Remove visited: Parse through the user list and if id's match, break;

	var loc = Location(long, lat, rat, nR, a);

	listLocs[i] = loc;
}

listLocs.sort(compLocs); //Sorts based on compLocs, v nice, ehyyyy
//remove duplicates

/*Giving user options for what to do: 
	- Technically they parse the info, give it to user, but we might write the code for that anyways*/