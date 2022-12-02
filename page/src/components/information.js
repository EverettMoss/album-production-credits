import axios from 'axios'
const qs = require('qs');
//require('dotenv').config()

//const client_id = process.env.SPOTIFY_API_ID; // Your client id
//const client_secret = process.env.SPOTIFY_CLIENT_SECRET; // Your secret
//const auth_token = Buffer.from(`${client_id}:${client_secret}`, 'utf-8').toString('base64');


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

export const get_albums = async (album_name) => {
    var album_id;
    const access_token = await get_token();

    const api_url = 'https://api.spotify.com/v1/search'

    //https://api.spotify.com/v1/search?type=album&market=US&limit=1
    const headers = {
        headers: { 'Authorization': `Bearer ${access_token}` }
    }

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
        console.log(album_id)
    } catch (error) {
        console.log(error);
    }

    return album_id
}
