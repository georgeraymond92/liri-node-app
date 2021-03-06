// require all of my needed modules and define variables
require("dotenv").config();
var keys = require('./keys.js');;
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
// Had to use this to be able to see the full json object in my console logs so i could proporly parse the objects
var util = require('util');
var fs = require("fs");
var request = require('request');
var spotifyClient = new Spotify(keys.spotify);
var twitterClient = new Twitter(keys.twitter);
var argument = process.argv[2];
var songName = "";
var movieName = "";
var params = {screen_name: 'GeorgeMRaymond', count:20};

// Created a switch to determine what code to execute depending on the argument provided

switch(argument){

    // Twitter call

    case 'my-tweets':

        twitterClient.get('statuses/user_timeline', params, function(error, tweets, response) {
            if (!error) {
                for (var i = 0; i < tweets.length; i++) {
                    console.log(tweets[i].text);
                    console.log(tweets[i].created_at);
                    console.log('');
                    
                }
            }
        });
        
    break;

    // Spotify call

    case 'spotify-this-song':
        
        if (process.argv.length === 3) {
            
            spotifyClient.search({type:"track", query:'the sign ace of base'}, function(error, data){
                if(error) {
                    console.log('Error occurred: ' + error);
                }
    
                var songs = data.tracks.items;
                for(var i=0; i<songs.length; i++) {
                    console.log(i);
                    console.log("Song Name: " + songs[i].name);
                    console.log('artist(s): ' + songs[i].artists.map(function(artist){
                        return artist.name;
                    }));
                    console.log('preview song: ' + songs[i].preview_url);
                    console.log("album: " + songs[i].album.name);
                }
            });

        } else {

            for (i = 3;i < process.argv.length; i++) {
                songName += process.argv[i] + " ";
            };
        
            spotifyClient.search({type:"track", query:songName}, function(error, data){
                if(error) {
                    console.log('Error occurred: ' + error);
                }

                var songs = data.tracks.items;
                for(var i=0; i<songs.length; i++) {
                    console.log(i);
                    console.log("Song Name: " + songs[i].name);
                    console.log('artist(s): ' + songs[i].artists.map(function(artist){
                        return artist.name;
                    }));
                    console.log('preview song: ' + songs[i].preview_url);
                    console.log("album: " + songs[i].album.name);
                }
            });
        }

    break;

    // OMDB call using request

    case "movie-this":
    
        for (i = 3;i < process.argv.length; i++) {
            movieName += process.argv[i] + " ";
        };

        request('http://www.omdbapi.com/?apikey=995d01b&t=' + movieName, function (error, response, body) {
        var jsonData = JSON.parse(body);
        console.log('error:', error); // Print the error if one occurred
        console.log(jsonData.Title);
        console.log(jsonData.Year);
        console.log(jsonData.Rated);
        console.log(jsonData.imdbRating);
        console.log(jsonData.Country);
        console.log(jsonData.Language);
        console.log(jsonData.Plot);
        console.log(jsonData.Actors);
        });


    break;

    // do-what-it-says reads the content of random.txt then calls out to the spotify api 

    case "do-what-it-says":

        fs.readFile('random.txt', 'utf8', function (err, data){
            if (err) throw err;
            var dataArr = data.split(",");
            argument = dataArr[0];
            songName = dataArr[1];
            console.log(argument);
            console.log(songName);

            spotifyClient.search({type:"track", query:songName}, function(error, data){
                if(error) {
                    console.log('Error occurred: ' + error);
                }
                var songs = data.tracks.items;
                for(var i=0; i<songs.length; i++) {
                    console.log(i);
                    console.log("Song Name: " + songs[i].name);
                    console.log('Artist(s): ' + songs[i].artists.map(function(artist){
                        return artist.name;
                    }));
                    console.log('Preview Song Here: ' + songs[i].preview_url);
                    console.log("Album: " + songs[i].album.name);
                }
            });

        });
        
    
    break;

};

