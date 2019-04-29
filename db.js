var spicedPg = require("spiced-pg");
var db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres://postgres:postgres@localhost:5432/tabasco-network"
);

// REGISTER A NEW USER
exports.addUser = function addUser(
    first,
    last,
    email,
    password,
    users_pic,
    bio
) {
    let q = `INSERT INTO users (first, last, email, password, users_pic, bio) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
    let params = [first, last, email, password, users_pic, bio];
    return db.query(q, params);
};

// IN LOGIN FORM - find a user by email
exports.getUser = function getUser(email) {
    let q = "SELECT * FROM users WHERE email = $1";
    return db.query(q, [email]);
};

exports.getUserProfile = function getUserProfile(id) {
    let q = `SELECT id, first, last, users_pic FROM users WHERE id = $1`;
    return db.query(q, [id]);
};

exports.updateUserPic = function updateUserPic(id, users_pic) {
    let q = `UPDATE users SET users_pic = $2 WHERE id = $1`;
    let params = [id, users_pic];
    return db.query(q, params);
};
