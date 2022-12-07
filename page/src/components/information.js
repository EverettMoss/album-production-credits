import axios from 'axios'

//Spotify Requests
export const get_token = async () => {
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

export const get_album_id = async (album_name) => {
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

export const get_tracks = async (album_id) => {
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

export const get_genius_song_ids2 = async () => {
    var all_spotify_tracks = [] //param
    var count = 0
    var genius_song_ids = []

    all_spotify_tracks.push('helment steve lacy')

    const BASE_URL = 'https://api.genius.com/search'
    const CLIENT_ACCESS_TOKEN = 'gpL1EArH114jeZE2SmTU6jBbR-Q_liU23H1SyTvmPh_HQh1ZabtRqoz938evoypK'
    const token = `Bearer ${CLIENT_ACCESS_TOKEN}`

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

    console.log(response.data.response.hits[0])




    /*
    all_spotify_tracks.forEach(async track => {
        // static - steve lacy
        const params = {
            'q': track
        }

        const response = await axios.get(BASE_URL, {
            headers: {
                'Authorization': token
            },
            params: params
        })
        console.log(response.data)

        /*
        genius_song_id = get_song_id(song_search_info, artist.strip())
        genius_song_ids.append(genius_song_id)
        count += 1
        print("SONG #", count, "/", len(track_names))

        const search_song = song.name + ' - ' + song.artists[0].name
        tracks.push(search_song)
        */
};

/*
*/
