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


/*
Parameters being passed in from button.js:
	- coords has user latitude and longitude
	- listLocsUP is the string that holds the 10 locations
	- const distance is distance from user
*/

var listLocs = [];		//final sorted list of parsed locations
var list = []; 			//will become final sorted list of unparsed locations
function parseLocations(listLocsUP)
{
	list = JSON.parse(listLocsUP); //list passed in

	var user = new User(coords.latitude, coords.longitude);
	

	/*This is where you parse from the (10?) locations passed to you*/
	for (var i = 0; i < list.data.length; i ++) {
		var locInfo = list.data[i];

		var id = locInfo.location_id;
		var lat = locInfo.latitude;
		var long = locInfo.longitude;
		var rat = locInfo.rating;
		var nR = locInfo.num_reviews;
		var a = locInfo.category.name;			//@TODO: locations-->groups-->name? and what about map/attractions-->groups-->name or maps/attractions-->groups-->categories-->name?
		if (locInfo.hours != null) {
			var oT = locInfo.hours.week_ranges[day].times["open_time"];
			var cT = locInfo.hours.week_ranges[day].times["close_time"];

			/*Getting rid of values that don't line up with the current time*/
			if(oT != null) {
				if (user.time /*+ travelTime*/ < timeToInt(oT)) {
					break;
				}
			}
			if (cT != null) {
				if (user.time > timeToInt(cT) - timeBuffer) {
					break;
				}
			}
		}

		//Remove visited: Parse through the user list and if id's match, break;

		var loc = new Location(id, lat, long, rat, nR, a, oT, cT, user);
	
		listLocs.push(loc);
	}
	removeDuplicates(listLocs);
	
	listLocs.sort(compLocs); //Sorts based on compLocs, v nice, ehyyyy, low -> high
	list.data.sort(compLocs);	//Now they're both in same sorted order

//Not too great at sorting....????
	for (var k = 0; k < listLocs.length; k ++) {
		console.log(listLocs[k].rating);
		console.log(listLocs[k].id);
	}
/*Giving user options for what to do: 
	- Technically they parse the info, give it to user, but we might write the code for that anyways*/

}


//const numLocs = 10; //We can use .length of arrays instead
let day = 0; //Enumerated ?
const timeBuffer = 60; //in minutes


function User(lat, long)
{
	var currTime = new Date();
	this.time = 60 * currTime.getHours() + currTime.getMinutes();

	this.latitude = lat;
	this.longitude = long;
	
	//availTime,
	//attracts,
	//visiedLocs = [],
}
function Location(id, lat, long, rat, nR, a, oT, cT, user)
{
	this.id = id;
	this.latitude = lat;
	this.longitude = long;
	this.rating = rat;
	this.num_reviews = nR;
	this.attract = a;
	this.timeOpen = oT;
	this.timeClose = cT;
	this.distance = str8Dist(user.latitude, user.longitude, lat, long);
}

function str8Dist(uLat, uLong, lLat, lLong) 
{
	return Math.pow(Math.pow(uLong-lLong, 2) + Math.pow(uLat - lLat), 0.5);
}

/*Compares two locations based first on rating then on number of reviews. 
	If tied for both, first come first serve.*/
/*Also sorts low to high.*/
function compLocs(loc1, loc2)
{
	if (loc1.rating != loc2.rating) {
		return loc1.rating > loc2.rating;
	} else {
		return loc1.num_reviews > loc2.num_reviews;
	}
}

function timeToInt(time)
{
	var hours = parseInt(time.substring(0, 2));
	var minutes = parseInt(time.substring(3,5));

	return 60 * hours + minutes;
}

/*Removes duplicates :V*/
function removeDuplicates(listLocs)
{
	for (var i = 0; i < listLocs.length - 1; i ++) {
		for (var j = i + 1; j < listLocs.length; j ++) {
			if (listLocs[i].id == listLocs[j].id) {
				listLocs.splice(j, 1);
				j --;
			}
		}
	}
}


//@TODO: "promises": don't need callback functions anymore?