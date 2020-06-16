
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
}

module.exports = {
    createUser,
    getByEmail
};