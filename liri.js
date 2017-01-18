//define global variables and get everything i need for node.js

var keys = require("./keys.js");//grab info from keys.js
var fs = require("fs");
var spotify = require('spotify');
var Twitter = require("twitter");
var request = require("request");
var robot = require("robotjs")
var userMovie;
var userSong;


//grabs the twitter keys and assigns them to variables
var consumerKey = keys.twitterKeys.consumer_key;
var consumerSecret = keys.twitterKeys.consumer_secret;
var tokenKey = keys.twitterKeys.access_token_key;
var tokenSecret = keys.twitterKeys.access_token_secret;

var client = new Twitter({
  consumer_key: consumerKey,
  consumer_secret: consumerSecret,
  access_token_key: tokenKey,
  access_token_secret: tokenSecret
});


//grabs user input

//calls a function based on user input
//only after the enter key has been pressed
if(robot.keyTap('enter')){
	//calls the command function to see what to do
	var userCommand = process.argv[2];
	command(userCommand);
}



//start of functions

//function that determines which command to use
function command(userRequest, randomText){
if (userRequest === "my-tweets"){
	social();
}else if (userRequest === "spotify-this-song"){
	//if statement used to see if the song is coming from user or random.txt
	if(randomText === undefined){
	userSong = process.argv[3]
	}
	else{
	userSong = randomText;
	}
	music(userSong);
}else if (userRequest === "movie-this"){
	userMovie = process.argv;
	movie(userMovie);
}else if(userRequest === "do-what-it-says"){
	doWhatItSays();
}

};




//twitter function that displays tweets
function social(){

	
 
var params = {screen_name: 'jshtx'};
client.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (!error) {
  	//for loop to cycle through the last 20 tweets
  	//it throws an error at 20 tweets for some reason, changed to 19
  	for(var i = 0; i < 19; i++){
  	console.log("");
  	console.log("==============================================");
  	console.log("")
  	console.log(tweets[i].text);	
    console.log("Tweet Created: " + tweets[i].created_at);
    console.log("");
    console.log("==============================================");
    console.log("");
	};
  }
});

};


//uses spotify to find data for songs
function music(userSong){

//calls spotify api	
spotify.search({ type: 'track', query: userSong }, function(err, data) {
    if ( err ) {
        console.log('Error occurred: ' + err);
        return;
    }
 
    //loop that displays five results

    //if no response is given the song the sign by ace of base is returned
   if (userSong === ""){
   	userSong = "the sign";
   }
    for(var i = 0; i <5; i++){
    
    console.log("");
    console.log("==============================================");
    console.log("Artist(s): " + data.tracks.items[i].artists[0].name);
    console.log("Song Name: " + data.tracks.items[i].name);
    console.log("Spotify link: " + data.tracks.items[i].preview_url);
    console.log("Album: " + data.tracks.items[i].album.name);
    console.log("==============================================");
    console.log("");
	}
});

}

//uses omdb to find data on movies
function movie(userMovie){
	
	//initializes movieName as an empty string
	var movieName = "";
	
	//loop used to add '+' for movies with more than one word in title
	for (var i = 3; i < userMovie.length; i++) {

  		if (i > 3 && i < userMovie.length) {
			movieName = movieName + "+" + userMovie[i];

    }
	else {

    movieName += userMovie[i];

    }
   }
   //if no response is given the movie mr. nobody is returned
   if (movieName === ""){
   	movieName = "mr+nobody";
   }

   var movieRequest = "http://www.omdbapi.com/?t=" + movieName + "&y=&tomatoes=true&plot=short&r=json";

  //requests the movie from the api and then displays the data	
  request(movieRequest, function(error, response, body) {

		
  // If the request is successful (i.e. if the response status code is 200)
  if (!error && response.statusCode === 200) {

    //Parses the object and displays it
    console.log("==============================================")
    console.log("Title: " + JSON.parse(body).Title);
    console.log("Year of Release: " + JSON.parse(body).Year);
    console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
    console.log("Country: " + JSON.parse(body).Country);
    console.log("Language: " + JSON.parse(body).Language)
    console.log("Summary of Plot: " + JSON.parse(body).Plot)
    console.log("Actors: " + JSON.parse(body).Actors)
    console.log("Rotten Tomatoes Rating: " + JSON.parse(body).tomatoRating)
    console.log("Rotten Tomatoes URL: " + JSON.parse(body).tomatoURL);
    console.log("==============================================")
  }
});


}

//function that grabs info from random.txt then uses that info in the spotify function
function doWhatItSays(){
	fs.readFile("random.txt", "utf8", function(err, data){

		var whatToDo = data.split(",")

		command(whatToDo[0], whatToDo[1]);
	

	});

}