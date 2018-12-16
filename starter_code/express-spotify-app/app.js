const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require("path")

var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste your credentials here
var clientId = '9e21bda4cbc041e5b7d73880d3612569',
    clientSecret = 'afcb4ff4280b4f209fb0a0adee523e77';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


app.get('/', function (req, res) {  
  res.render("index")
})

app.get('/search', function (req, res) {  
  spotifyApi.searchArtists(req.query.myArtist)
    .then(data => {
      console.log(data.body.artists.items[0])
      res.render("artists", data.body.artists.items[0])
    
    })
    .catch(err => {
      // ----> 'HERE WE CAPTURE THE ERROR'
    })
})

app.get('/artists', (req, res) => {
  //res.render('artists', { artists: [ { name: 'Drake'}, { name: 'Madonna'} ] })    
  spotifyApi.searchArtists(req.query.whateverelse).then(data => {
      data.body.artists.items.forEach((a) => {
          a.image = a.images[0]
      })
      res.render('artists', { artists: data.body.artists.items })
      //res.send(data)
  })
})

// app.get('/artists', (req, res) => {
//     spotifyApi.searchArtists('drake')
//         .then(data => {
//             res.send(data)
//         })
// })

app.listen(3000)