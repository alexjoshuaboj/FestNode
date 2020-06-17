const router = require('express').Router();
const Festival = require('../models/fest.model');
const Spotify = require('../models/spotify.acces');
const Utils = require('../models/utils');
const userFestBand = require('../models/userBandFest');

//Ruta GET que devuelve todos los festivales
router.get('/', async (req, res) => {
    try {
        console.log('Rqe de fest: ', req)
        const festivales = await Festival.getAll();
        res.json(festivales);
    } catch (err) {
        res.json({
            error: err.message
        })
    }

});

//Ruta POST que relaciona festival con usuario introduciendo un json con los parametros idUser y idFestivales
router.post('/newfest', async (req, res) => {
    try {
        const result = await Festival.selectFest(req.body);
        if (result['affectedRows'] === 1) {
            res.json({
                success: "Festival agregado"
            })
        } else {
            res.json({
                error: 'Error al agregar festival'
            })
        }
    } catch (err) {
        res.json({
            error: err
        })
    }
});

//Ruta GET que devuelve las bandas de un festival introduciendo el id del festival en la ruta
router.get('/:idFest/bands', async (req, res) => {
    //Tiene que seleccionar minimo 
    try {
        const bandsfest = await Festival.getBandsFest(req.params.idFest);
        res.json(bandsfest);
    } catch (err) {
        res.json({
            error: err.message
        });
    };
});

router.get('/imgSpotify/:idArtist', async (req, res) => {
    try {
        console.log(Utils.readToken());
        const urlIma = await Spotify.getBandImage(req.params.idArtist, Utils.readToken());
        console.log(urlIma);
        res.send(urlIma.data.images);
    } catch (err) {
        res.json({
            error: err.message
        });
    };
});

//Rura GET que devuelve los grupos junto a los horarios que un usuario ha seleccionado para ver en un festival introduciendo idUser e idFest
router.get('/getHours', async (req, res) => {
    try {
        const bandsHours = await Festival.getHours(req.body);
        res.json(bandsHours);
    } catch (err) {
        res.json({
            error: err.message
        })
    }
})


//Ruta GET que devuelve un json de las fotos de un artista de Spotify introduciendo su id en la ruta
router.get('/imgSpotify/:idArtist', async (req, res) => {
    try {
        console.log(Utils.readToken());
        const urlIma = await Spotify.getBandImage(req.params.idArtist, Utils.readToken());
        console.log(urlIma);
        res.send(urlIma.data.images);
    } catch (err) {
        res.json({
            error: err.message
        })
    }
})

//Ruta GET que devuelve el token de spotify
router.get('/spotify/getToken', (req, res) => {

    Spotify.spotifyAccessToken()
        .then(function (response) {
            Utils.createFile(response.data.access_token);
            res.send('Save token', );
        }).catch(function (error) {
            res.send(error);
        });

});







module.exports = router;