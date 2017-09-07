var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require('file-system');
var apiKeys = require('./keys')

//console.log(apiKeys)



var myArgs = process.argv.slice(2);
 console.log('myArgs: ', myArgs);

 if (myArgs[0] == "my-tweets"){
 	displayTweets();
 }

 if (myArgs[0] == "spotify-this-song"){
 	displaySong(myArgs[1]);
 }

 if (myArgs[0] == "movie-this"){
 	displayMovie(myArgs[1]);

 }

 if (myArgs[0] == "do-what-it-says"){
 	displayWhatItSays(myArgs[1]);
 }

 function displayTweets(){
 	console.log("displayTweets");
 	var client = new Twitter({
	  consumer_key: apiKeys.keys.twitterKeys.consumer_key,
	  consumer_secret: apiKeys.keys.twitterKeys.consumer_secret,
	  access_token_key: apiKeys.keys.twitterKeys.access_token_key,
	  access_token_secret: apiKeys.keys.twitterKeys.access_token_secret
	});
	 
	var params = {screen_name: 'roboLIRI'};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error){
		for(var i = 0 ; i < 20; i++){
			if(tweets[i]){
				console.log(tweets[i].text);
			  	console.log(tweets[i].created_at);
		 	}
		}

	    //console.log(tweets);
	  }
	  else{
	  	console.log(error);
	  }
	});

 }
 function displaySong(song){
 	console.log("displaySong called with " + song)
 	var spotify = new Spotify({
	  id: apiKeys.keys.spotifyKeys.client_id,
	  secret: apiKeys.keys.spotifyKeys.client_secret
	});
	 
	spotify.search({ type: 'track', query: song }, function(err, data) {
		if (err) {
			return console.log('Error occurred: ' + err);
		}
	 	//console.log(data.tracks.items[0]);
		//console.log(data); 
		console.log("Album: " + data.tracks.items[0].album.name)
		console.log("Artist: " + data.tracks.items[0].artists[0].name)
		console.log("Preview Link: " + data.tracks.items[0].preview_url)
		console.log("Song: " + data.tracks.items[0].name)
	});

 }
 function displayMovie(movie){
 	var movieName = movie || "Mr. Nobody";

	var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";

	request(queryUrl, function (error, response, body) {
		console.log('error:', error); 
		console.log('statusCode:', response && response.statusCode);
		var data = JSON.parse(body);
		console.log("Title: " + data.Title);
		console.log("Year: " + data.Year);
		console.log("IMDB Rating: " + data.imdbRating);

		for(var i = 0; i < data.Ratings.length; i++){
		 
		     if(data.Ratings[i].Source == "Rotten Tomatoes"){
				console.log("Rotten Tomatoes: " + data.Ratings[i].Value);
		     }
		}

		console.log("Country: " + data.Country);
		console.log("Plot: " + data.Plot);
		console.log("Actors: " + data.Actors);
	  //var data = JSON.parse("{"+body+"}");
	  //console.log(data);
	  //console.log('body:', body);  
	});

	//console.log(queryUrl);

 }
 function displayWhatItSays(){
 	fs.readFile('./random.txt', 'utf8', function (err,data) {
  		if (err) {
    		return console.log(err);
  		}
  		console.log(data);
  		var myArgs = data.split(",");
  		console.log(myArgs);

  		if (myArgs[0] == "my-tweets"){
 			displayTweets();
 		}

 		if (myArgs[0] == "spotify-this-song"){
 			displaySong(myArgs[1]);
 		}

 		if (myArgs[0] == "movie-this"){
 			displayMovie(myArgs[1]);

 		}
	});

 }


 	