const fs = require('fs');
//Escribe el token de spotify
const createFile = (data) => {
    return fs.writeFileSync('spotifyToken.txt', data);
};
//Lee el token de Spotify
const readToken = () => {
    return fs.readFileSync('spotifyToken.txt', 'utf8');
}






module.exports = {
    createFile,
    readToken
}