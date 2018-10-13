var KEY_GM = "AIzaSyDzc3RwxBdsanvGcvASbFUSUmZgrRlT2v8";

const REQTIME = 45; //minutes; amount of time required to go through an attraction
const DEFAULT_MODE = "walking"; //Assume people take the time to see the sights


//function getPathInfo(oLat, oLong, dLat, dLong, mode)
//{
//	var xmlHttp = new XMLHttpRequest();
	//distance unused in this version														//IDK if this - is supposed to be here //@NVM im dum af
//	xmlHttp.open( "GET","https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins="+oLat+","+oLong+"&destinations="+dLat+/*"%2C"*/ + dLong + /*"%7C*/"&mode=" + mode + "&key=" + KEY_GM, false);
	
//        xmlHttp.send();
//	return xmlHttp.responseText;
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
    transitOptions: /*TransitOptions*/,
    drivingOptions: /*DrivingOptions*/,
    unitSystem: UnitSystem,
    avoidHighways: Boolean,
    avoidTolls: Boolean,
  }, callback);


	if (resultsP != null) {
		return resultsP / 60; //minutes
	}

	return 100000000; //big number, @TODO: make it a value outside range of totalTime or smnthn
}









// //returns int value containing the time calc'ed by Google Maps to get from origin to destination
// function getTravelPath(oLat, oLong, dLat, dLong)
// {
// 	var travelInfoUP = getPathInfo(oLat, oLong, dLat, dLong, DEFAULT_MODE); //list passed in

// 	var resultsP = JSON.parse(travelInfoUP);

// 	resultsP = resultsP.rows["elements"]["duration"].value; //seconds

// 	if (resultsP != null) {
// 		return resultsP / 60; //minutes
// 	}

// 	return 100000000; //big number, @TODO: make it a value outside range of totalTime or smnthn
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

function Node(lat, long, rat, id)
{
	this.latitude = lat;
	this.longitude = long;
	this.rating = rat;
	this.id = id;

	this.timeReq = REQTIME;
}

//@TODO: Idk if it passes object (starNode) by reference or by value so I'll assume reference
function Path(startNode, index, totalTime)
{
	this.currNode = {latitude: startNode.latitude, longitude: startNode.longitude, rating: startNode.rating, id: startNode.id, timeReQ: startNode.timeReq};
	//aggregate backcost
	this.backCost = getTravelPath(user.latitude, user.longitude, startNode.latitude, startNode.longitude);
	this.forwardCost = getTravelPath(user.latitude, user.longitude, finalDest.latitude, finalDest.longitude);
	this.rateCost = 5 - startNode.rating; //+ some function of the num of reviews //@TODO: should be weighted more...?
	this.totalCost = backCost + forwardCost + rateCost;

	this.totalRating = startNode.rating; //aggregate rating of the path

	this.timeLeft = totalTime - backCost - startNode.timeReq;
	this.unvisitedNodes = listLocs.splice(index, 1);	//unvisitedNodes is not actually made of Node objects
							//@TODO: is listLocs pass by reference??
	this.visitedOrder = [];
	this.visitedOrder.push(startNode.id);
}

//highest to lowest? (pop pops off last element and returns)
function compPaths(path1, path2)
{
	return path1.totalCost > path2.totalCost;
}

var priorQ;
var finDestNode = new Node(finalDest.latitude, finalDest.longitude, 0, -1); //0 time "spent" there, -1 is unique id
finDestNode.timeReq = 0;

//@TODO: DEEP COPIES!
function expand(path)
{
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