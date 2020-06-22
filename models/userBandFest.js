// Query que escribe los grupos que quiere el usuario ver de un festival usando los id de Usuarios-Festivales (userFest) y Bandas-Festivales(bandFest)
const userFestBand = ({
    userFest,
    bandFest
}) => {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO `heroku_66e653247fde55b`.`bands_users` (`usuarios_festivales_idusuarios_festivales`, `festivales_bandas_idfestivales_bandas`) VALUES (?, ?)', [userFest, bandFest], (err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    })
};

module.exports = {
    userFestBand
}