//Query que recibe todos los festis
const getAll = () => {
    return new Promise((resolve, reject) => {
        db.query('select * from festivales', (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        })
    })
};

//Query que relaciona festivales con usuarios
const selectFest = ({
    idUser,
    idFestivales
}) => {
    return new Promise((resolve, reject) => {
        db.query('insert into usuarios_festivales(usuarios_id, festivales_id) value (?, ?)', [idUser, idFestivales], (err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    })
};

//Query que devuelve las bandas de un festival
const getBandsFest = (fest) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT bandas.id, bandas.nombre, bandas.spotify_id, bandas.img, festivales_bandas.idfestivales_bandas from festivales_bandas, bandas where festivales_bandas.bandas_id = bandas.id and festivales_bandas.festivales_id = ?', [fest], (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        })
    })
};
// Query que devuelve las bandas y horarios de un usuario y un festival
const getHours = (
    idUser,
    idFest
) => {
    return new Promise((resolve, reject) => {
        db.query('select bandas.nombre, festivales_bandas.inicio, festivales_bandas.fin from bandas, festivales_bandas where  bandas.id = festivales_bandas.bandas_id and festivales_bandas.idfestivales_bandas in (select bands_users.festivales_bandas_idfestivales_bandas from bands_users, usuarios_festivales where usuarios_festivales.usuarios_id = ? and usuarios_festivales.festivales_id = ? and bands_users.usuarios_festivales_idusuarios_festivales = usuarios_festivales.idusuarios_festivales)', [idUser, idFest], (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        })
    })
};

const getUserFestivals = (idUser) => {
    return new Promise((resolve, reject) => {
        db.query('select festivales.id, festivales.nombre, festivales.img from festivales, usuarios, usuarios_festivales where usuarios_festivales.festivales_id = festivales.id and usuarios.id = usuarios_festivales.usuarios_id and usuarios_id = ?', [idUser], (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        })
    })
};

const getAllArtist = () => {
    return new Promise((resolve, reject) => {
        db.query('select * from bandas', (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        })
    })
};

const AddArtist = ({
    nombre,
    spotify_id,
    img
}) => {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO bandas (nombre, spotify_id, img) VALUES (?, ?, ?)', [nombre, spotify_id, img], (err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    })
};
const addArtistFestival = ({
    idFest,
    idArtist,
    inicio,
    fin
}) => {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO festivales_bandas (bandas_id, festivales_id, inicio, fin) VALUES (?, ?, ?, ?)', [idArtist, idFest, inicio, fin], (err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    })
}



module.exports = {
    getAll,
    selectFest,
    getBandsFest,
    getHours,
    getUserFestivals,
    getAllArtist,
    AddArtist,
    addArtistFestival
}