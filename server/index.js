const PORT = 8000

const axios = require('axios')
const express = require('express')
const cors = require('cors')
var bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json());
app.use(cors())

app.get('/get_credits', async (req, res) => {



  /*
  var config = {
    method: 'get',
    url: 'https://api.genius.com/search',
    headers: {
      'Authorization': 'Bearer gpL1EArH114jeZE2SmTU6jBbR-Q_liU23H1SyTvmPh_HQh1ZabtRqoz938evoypK'
    },
    params: {
      'q': 'woodlawn amine'
    }
  };

  const response = await axios(config)

  res.json(response.data.response.hits[0])
  */
})

app.post('/send_album', async (req, res) => {
  const album = await req.body;

  console.log(album)

  res.json(req.body);
});

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
      const search_song = song.name + ' - ' + song.artists[0].name
      tracks.push(search_song)
    });

  } catch (error) {
    console.log(error);
  }

  return tracks
}


app.get('/', async (req, res) => {
  /*
  var config = {
    method: 'get',
    url: 'https://api.genius.com/search',
    headers: {
      'Authorization': 'Bearer gpL1EArH114jeZE2SmTU6jBbR-Q_liU23H1SyTvmPh_HQh1ZabtRqoz938evoypK'
    },
    params: {
      'q': 'woodlawn amine'
    }
  };

  const response = await axios(config)

  res.json(response.data.response.hits[0])
  */
})

app.listen(PORT, () => {
  console.log(`node running on ${PORT}`)
})