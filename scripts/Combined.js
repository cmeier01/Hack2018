const distance = 10;
var KEY_TA = "47E95D014FC94726A766DE678392A416";
var coords;

//@TODO: get these values from gui
var finalDest = {latitude: 0, longitude: 0}; //@TODO: real values, maybe just initialize to boston MA

var finDestNode;

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

function Node(lat, long, rat, idd)
{
  this.latitude = lat;
  this.longitude = long;
  this.rating = rat;
  this.id = idd;

  this.timeReq = REQTIME;
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

const DEFAULT_TIME = 360; //minutes

var listLocs = [];    //final sorted list of parsed locations
var list = [];      //will become final sorted list of unparsed locations
var user;

var REQTIME = 45; //minutes; amount of time required to go through an attraction
const DEFAULT_MODE = "walking"; //Assume people take the time to see the sights



var priorQ;

var day = 0; //Enumerated ?
const timeBuffer = 60; //in minutes

var KEY_GM = "AIzaSyDzc3RwxBdsanvGcvASbFUSUmZgrRlT2v8";


function parseLocations(listLocsUP)
{
  list = JSON.parse(listLocsUP); //list passed in

  user = new User(coords.latitude, coords.longitude, DEFAULT_TIME);
  

  /*This is where you parse from the (10?) locations passed to you*/
  for (var i = 0; i < list.data.length; i ++) {
    var locInfo = list.data[i];

    var id = locInfo.location_id;
    var lat = locInfo.latitude;
    var long = locInfo.longitude;
    var rat = locInfo.rating;
    var nR = locInfo.num_reviews;
    var a = locInfo.category.name;      //@TODO: locations-->groups-->name? and what about map/attractions-->groups-->name or maps/attractions-->groups-->categories-->name?
    if (locInfo.hours != null) {
      if (locInfo.hours.week_ranges[day] != null) {
        var oT = locInfo.hours.week_ranges[day].times["open_time"];
        var cT = locInfo.hours.week_ranges[day].times["close_time"];
      }
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
  
  listLocs.sort(compLocs); //Sorts based on compLocs, v nice, ehyyyy, high -> low
  list.data.sort(compLocs); //Now they're both in same sorted order

//Not too great at sorting....????
  for (var k = 0; k < listLocs.length; k ++) {
    console.log(listLocs[k].rating);
    console.log(listLocs[k].id);
  }
/*Giving user options for what to do: 
  - Technically they parse the info, give it to user, but we might write the code for that anyways*/


  generatePath();
}


//const numLocs = 10; //We can use .length of arrays instead

function Path(startNode, index, totalTime)
{
  this.currNode = startNode;
  //this.currNode = {latitude: startNode.latitude, longitude: startNode.longitude, rating: startNode.rating, id: startNode.id, timeReQ: startNode.timeReq};
  //aggregate backcost
  this.backCost = getTravelPath(user.latitude, user.longitude, startNode.latitude, startNode.longitude);
  this.forwardCost = getTravelPath(user.latitude, user.longitude, finalDest.latitude, finalDest.longitude);
  this.rateCost = 5 - startNode.rating; //+ some function of the num of reviews //@TODO: should be weighted more...?
  this.totalCost = this.backCost + this.forwardCost + this.rateCost;

  this.totalRating = startNode.rating; //aggregate rating of the path

  this.timeLeft = totalTime - this.backCost - startNode.timeReq;
  this.unvisitedNodes = listLocs.splice(index, 1);  //unvisitedNodes is not actually made of Node objects
              //@TODO: is listLocs pass by reference??
  this.visitedOrder = [];
  this.visitedOrder.push(startNode.id);
}

function User(lat, long, tt)
{
  var currTime = new Date();
  this.time = 60 * currTime.getHours() + currTime.getMinutes();

  this.latitude = lat;
  this.longitude = long;
  
  this.availTime = tt;
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
/*Also sorts high to low.*/
function compLocs(loc1, loc2)
{
  if (loc1.rating != loc2.rating) {
    return loc1.rating < loc2.rating;
  } else {
    return loc1.num_reviews < loc2.num_reviews;
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



//function getPathInfo(oLat, oLong, dLat, dLong, mode)
//{
//  var xmlHttp = new XMLHttpRequest();
  //distance unused in this version                           //IDK if this - is supposed to be here //@NVM im dum af
//  xmlHttp.open( "GET","https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins="+oLat+","+oLong+"&destinations="+dLat+/*"%2C"*/ + dLong + /*"%7C*/"&mode=" + mode + "&key=" + KEY_GM, false);
  
//        xmlHttp.send();
//  return xmlHttp.responseText;
//}



var origin1 = new google.maps.LatLng(55.930385, -3.118425);
var origin2 = 'Greenwich, England';
var destinationA = 'Stockholm, Sweden';
var destinationB = new google.maps.LatLng(50.087692, 14.421150);

var service = new google.maps.DistanceMatrixService();


function callback(response, status) {
  if (status == 'OK') {
    var origins = response.originAddresses;
    var destinations = response.destinationAddresses;

    for (var i = 0; i < origins.length; i++) {
      var results = response.rows[i].elements;
      for (var j = 0; j < results.length; j++) {
        var element = results[j];
        var distance = element.distance.text;
        var duration = element.duration.text;
        var from = origins[i];
        var to = destinations[j];
        return duration;
      }
    }
  }
}


//returns int value containing the time calc'ed by Google Maps to get from origin to destination
function getTravelPath(oLat, oLong, dLat, dLong)
{
  var resultsP = service.getDistanceMatrix(
  {
    origins: [new google.maps.LatLng(oLat, oLong)],
    destinations: [new google.maps.LatLng(dLat, dLong)],
    travelMode: 'WALKING',
/*    transitOptions: TransitOption
    drivingOptions:DrivingOptions,
    unitSystem: UnitSystem,
    avoidHighways: Boolean,
    avoidTolls: Boolean,*/
  }, callback);


  if (resultsP != null) {
    return resultsP / 60; //minutes
  }

  return 100000000; //big number, @TODO: make it a value outside range of totalTime or smnthn
}









// //returns int value containing the time calc'ed by Google Maps to get from origin to destination
// function getTravelPath(oLat, oLong, dLat, dLong)
// {
//  var travelInfoUP = getPathInfo(oLat, oLong, dLat, dLong, DEFAULT_MODE); //list passed in

//  var resultsP = JSON.parse(travelInfoUP);

//  resultsP = resultsP.rows["elements"]["duration"].value; //seconds

//  if (resultsP != null) {
//    return resultsP / 60; //minutes
//  }

//  return 100000000; //big number, @TODO: make it a value outside range of totalTime or smnthn
// }

/*Available parameters:
  - listLocs which has main info for nearest locations
  - list which has total info for nearest locations
    - Both sorted high-->low
  - a json format of the Google API (needs to be parsed for time data)
  - User info

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



//@TODO: Idk if it passes object (starNode) by reference or by value so I'll assume reference


//highest to lowest? (pop pops off last element and returns)
function compPaths(path1, path2)
{
  return path1.totalCost > path2.totalCost;
}

//@TODO: DEEP COPIES!
function expand(path)
{
   finDestNode= new Node(finalDest.latitude, finalDest.longitude, 0, -1); //0 time "spent" there, -1 is unique id
finDestNode.timeReq = 0;

  path.unvisitedNodes.push(finDestNode); //make sure no matter where you are you can finish; this gets taken off anyways
  for (var i = 0; i < path.unvisitedNodes.length; i ++) {
    var nextPath = path;
    var nextInfo = unvisitedNodes[i];
    var nextNode = new Node(nextInfo.latitude, nextInfo.longitude, nextInfo.rating, nextInfo.id);
    nextPath.backCost = path.backCost + getTravelPath(path.currNode.latitude, path.currNode.longitude, nextNode.latitude, nextNode.longitude);
    nextPath.forwardCost = getTravelPath(nextPath.latitude, nextPath.longitude, finalDest.latitude, finalDest.longitude);
    nextPath.rateCost = 5 - nextNode.rating;
    nextPath.totalCost = nextPath.backCost + nextPath.forwardCost + nextPath.rateCost;

    nextPath.totalRating = path.totalRating + nextNode.rating;

    nextPath.timeLeft = path.timeLeft - getTravelPath(path.currNode.latitude, path.currNode.longitude, nextNode.latitude, nextNode.longitude);
    nextPath.unvisitedNodes = path.unvisitedNodes.splice(i, 1);

    if (nextPath.timeLeft + nextPath.forwardCost > 0) { //there is time to get to the final end goal
      nextPath.visitedOrder.push(nextNode.id);
    }
  }
}


//@TODO: way to keep track of path?
//@TODO: this assumes that you can get to destination in one step using time alotted
function generatePath()
{
  console.log("AAA");
  //Priority queue of paths
  priorQ = [];

  //List of possible solutions
  var solnList = [];

  //Initialize priority queue, starts with highest star rating (lowest index)
  for (var i = 0; i < listLocs.length; i ++) {
    var info = listLocs[i];
    var nextNode = new Node(info.latitude, info.longitude, info.rating, info.id);

    var newPath = new Path(nextNode, i, user.availTime);

    priorQ.push(newPath);
  }
  var homePath = new Path(finDestNode, listLocs.length, user.availTime);
  priorQ.push(homePath); //will this screw things up?


  priorQ.sort(compPaths);


  while (priorQ.length != 0) {
    var thisPath = priorQ.pop();

    if (thisPath.currNode.id == finDestNode.id) {
      solnList.push(thisPath);
    } else {
      expand(priorQ, thisPath);
    }

  }

  var maxInd = 0;
  for (var i = 1; i < solnList.length; i ++) {
    if (solnList[i].totalRating > solnList[maxInd].totalRating) {
      maxInd = i;
    }
  }

  for (var i = 0; i < solnList[maxInd].visitedOrder.length; i ++) {
    console.log(solnList[maxInd].visitedOrder[i]);
  }
}