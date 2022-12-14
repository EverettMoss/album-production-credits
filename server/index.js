const PORT = 8000

const axios = require('axios')
const express = require('express')
const cors = require('cors')
var bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json());
app.use(cors())


//get album from front end
app.get('/get_credits/:album', async (req, res) => {
  const album = req.params.album;

  //main
  console.log('start')
  const song_data = await get_credits(album)
  console.log('end')

  res.json(song_data)
});


//main function 
const get_credits = async (album_name) => {
  //get album id from spotify
  const spotify_album_id = await get_album_id(album_name)

  //get all tracks from album
  const spotify_tracks = await get_tracks(spotify_album_id)

  //comvert all track titles to genius ids
  const genius_track_ids = await get_genius_track_ids(spotify_tracks)

  //get data for each song
  const song_data = await get_song_data(genius_track_ids)

  console.log(song_data)

  return song_data
}

//Spotify Requests
const get_token = async () => {
  const client_id = 'ef2c3c44efe34ac49fd8d204c7432b25';
  const client_secret = '7e731a4e91fb417a826f84b2491fd4a6';
  const auth_token = btoa(client_id + ':' + client_secret)

  try {
    //make post request to SPOTIFY API for access token, sending relavent info
    const token_url = 'https://accounts.spotify.com/api/token';

    const data = { 'grant_type': 'client_credentials' }
    const headers = {
      'Authorization': `Basic ${auth_token}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }

    const response = await axios.post(token_url, data, {
      headers: headers
    })

    return response.data.access_token;

  } catch (error) {
    //on fail, log the error in console
    console.log(error);
  }
}

const get_album_id = async (album_name) => {
  var album_id;
  const access_token = await get_token();

  const api_url = 'https://api.spotify.com/v1/search'

  const params = {
    q: album_name,
    type: 'album',
    market: 'US',
    limit: '1'
  }

  try {
    const response = await axios.get(api_url, {
      headers: {
        'Authorization': `Bearer ${access_token}`
      },
      params: params
    });
    album_id = response['data']['albums']['items'][0]['id']

  } catch (error) {
    console.log(error);
  }

  return album_id
}

const get_tracks = async (album_id) => {
  const access_token = await get_token();
  var tracks = [];

  const api_url = `https://api.spotify.com/v1/albums/${album_id}/tracks`

  try {
    const response = await axios.get(api_url, {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });

    const song_data = response.data.items
    song_data.forEach(song => {
      const search_song = song.name + ' ' + song.artists[0].name
      tracks.push(search_song)
    });

  } catch (error) {
    console.log(error);
  }

  return tracks
}

//Genius requests
const get_genius_track_ids = async (spotify_tracks) => {
  var genius_track_ids = []

  for (let index = 0; index < spotify_tracks.length; index++) {
    const track = spotify_tracks[index]
    const id = await get_genius_track_id(track)
    genius_track_ids.push(id)
  }

  return genius_track_ids
}

const get_genius_track_id = async (track) => {
  var config = {
    method: 'get',
    url: 'https://api.genius.com/search',
    headers: {
      'Authorization': 'Bearer gpL1EArH114jeZE2SmTU6jBbR-Q_liU23H1SyTvmPh_HQh1ZabtRqoz938evoypK'
    },
    params: {
      'q': track
    }
  };

  //TODO: match with artist wrap in try/catch
  const response = await axios(config)
  const id = response.data.response.hits[0].result.id

  return id
}

const get_song_data = async (genius_ids) => {
  var songs = []

  const base_url = 'https://api.genius.com/songs/'

  for (let index = 0; index < genius_ids.length; index++) {
    const song_info = {}
    const genius_id = genius_ids[index]
    const url = base_url + genius_id

    //make request
    console.log(url)

    var config = {
      method: 'get',
      url: url,
      headers: {
        'Authorization': 'Bearer gpL1EArH114jeZE2SmTU6jBbR-Q_liU23H1SyTvmPh_HQh1ZabtRqoz938evoypK'
      }
    };
    const response = await axios(config)

    const all_song_data = response.data.response.song

    //setting data to object
    song_info.title = all_song_data.title
    song_info.album = all_song_data.album.name ? all_song_data.album.name : '<single>'
    song_info.release_date = all_song_data.album.name ? all_song_data.release_date : 'unidentified'

    var producers = []
    all_song_data.producer_artists.forEach(producer => {
      producers.push(producer.name)  
    });
    song_info.producers = producers


    var features = []
    all_song_data.featured_artists.forEach(feature => {
      features.push(feature.name)  
    });
    song_info.feautured_artists = features

    var writers = []
    all_song_data.writer_artists.forEach(writer => {
      writers.push(writer.name)  
    });
    song_info.writers = writers
      
    songs.push(song_info)
  }

  return songs
}


app.listen(PORT, () => {
  console.log(`node running on ${PORT}`)
})