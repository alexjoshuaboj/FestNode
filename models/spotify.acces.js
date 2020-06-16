const axios = require('axios');

// GET que recibe las fotos de un artista según su id de spotify
const getBandImage = (idArtist, token) => {

    return axios.get(`https://api.spotify.com/v1/artists/${idArtist}`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });


};


module.exports = {
    getBandImage
}