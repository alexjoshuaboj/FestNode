const axios = require('axios');

//POST que recibe el token de Spotify
/* const spotifyAccessToken = () => {
    return axios({
        url: "https://accounts.spotify.com/api/token",
        method: "post",
        params: {
            grant_type: "client_credentials"
        },
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        auth: {
            username: process.env.SPOTIFY_CLIENT,
            password: process.env.SPOTIFY_SECRET
        }
    });
}; */
// GET que recibe las fotos de un artista según su id de spotify
const getBandImage = (idArtist, token) => {

    return axios.get(`https://api.spotify.com/v1/artists/${idArtist}`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });


};


module.exports = {
    spotifyAccessToken,
    getBandImage
}