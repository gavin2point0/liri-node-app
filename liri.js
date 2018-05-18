require("dotenv").config();
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs');
var ajax = require('ajax-request');
var keys = require('./keys.js')
var apiKey = '1bc73a7d'


var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var operator = process.argv[2];
var input = process.argv[3];

function run() {
  switch (operator) {

    case 'my-tweets':

      client.get('statuses/user_timeline', { screen_name: 'eggboiis', count: 20 }, function (error, tweets, response) {
        if (!error) {
          for (i = 0; i < tweets.length; i++) {
            console.log(tweets[i].text);
          }
        } else {
          console.log(error)
        }
      });
      break;

    case 'spotify-this-song':

      spotify.search({ type: 'track', query: input }, function (err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        var item = data.tracks.items[0];

        console.log(`
      Song: ${item.name}
      Artist: ${item.artists[0].name}
      Album: ${item.album.name}
      Spotify Link: ${item.external_urls.spotify}
      
      `)

      });
      break;

    case 'movie-this':
      var queryURL = 'http://www.omdbapi.com/?apikey=1bc73a7d&t=' + input

      ajax({
        url: queryURL,
        method: 'GET',
        json: true
      }, function (err, res, body) {
        if (err) {
          console.log(err)
        }

        console.log(`
      Title: ${body.Title}
      Year of Release: ${body.Year}
      IMDB Rating: ${body.Ratings[0].Value}
      Rotten Tomatoes Rating: ${body.Ratings[1].Value}
      Country: ${body.Country}
      Language: ${body.Language}
      Plot Summary: ${body.Plot}
      Actors: ${body.Actorsno}
      `)


      });

      break;

    case 'do-what-it-says':
      fs.readFile('random.txt', 'utf8', function (error, data) {

        if (error) {
          console.log(error)
        }

        var dataArr = []

        dataArr = data.split(',')

        operator = dataArr[0]
        input = dataArr[1]
        run()

      })


      break;

    default:
      console.log('please enter a valid command');
  }
}
run();