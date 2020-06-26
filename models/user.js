
const createUser = ({
    name,
    surname,
    email,
    password,
    phone_number,
    username,
}) => {
    return new Promise((resolve, reject) => {
        db.query('insert into usuarios (name, surname, email, password, phone_number, username) value (?, ?, ?, ?, ?, ?)', [name, surname, email, password, phone_number, username], (err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    })
};

const getByEmail = (pEmail) => {
    return new Promise((resolve, reject) => {
        db.query('select * from usuarios where email = ?', [pEmail], (err, rows) => {
            if (err) reject(err);
            if (rows.length !== 1) resolve(null);
            resolve(rows[0]);
        })
    })
};

const updateToken = (id, token) => {
    return new Promise((resolve, reject) => {
        db.query('update usuarios set token = ? where id = ?', [token, id], (err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    })
};

const checkValidatorToken = () => {
    return new Promise((resolve, reject) => {
        db.query('select usuarios.token from usuarios', (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        })
    })
};

const updatePhoto = (id, url) => {
    return new Promise((resolve, reject) => {
        db.query('update usuarios set imagen = ? where id = ?', [url, id], (err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    })
};
const getUser = (id) => {
    return new Promise((resolve, reject) => {
        db.query('select name, surname, email, phone_number, username, imagen from heroku_66e653247fde55b.usuarios where id = ?', [id], (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        })
    })
};

const updateUser = ({
    name,
    surname,
    phone_number,
    email,
    username
}, id) => {
    return new Promise((resolve, reject) => {
        db.query('update usuarios set name = ?, surname = ?, email = ?, phone_number = ?, username = ? where id = ?', [name, surname, email, phone_number, username, id], (err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    })
};

const registerWithSpotify = ({ name, email, password, username, token }) => {
    return new Promise((resolve, reject) => {
        db.query('insert into usuarios (name, email, password, username, token) value (?, ?, ?, ?, ?)', [name, email, password, username, token], (err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    })
};

const checkTokenSpotify = (emailSpotify) => {
    return new Promise((resolve, reject) => {
        db.query('select name from heroku_66e653247fde55b.usuarios where email = ?', [emailSpotify], (err, rows) => {
            if (err) reject(err);
            if (rows.length !== 1) resolve(null);
            resolve(rows);
        })
    })
};

module.exports = {
    createUser,
    getByEmail,
    updateToken,
    checkValidatorToken,
    updatePhoto,
    getUser,
    updateUser,
    registerWithSpotify,
    checkTokenSpotify
};
