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
    let q = `SELECT id, first, last, users_pic, bio FROM users WHERE id = $1`;
    return db.query(q, [id]);
};

exports.updateUserPic = function updateUserPic(id, users_pic) {
    let q = `UPDATE users SET users_pic = $2 WHERE id = $1`;
    let params = [id, users_pic];
    return db.query(q, params);
};

exports.updateBio = function updateBio(id, bio) {
    let q = `UPDATE users SET bio = $2 WHERE id = $1`;
    let params = [id, bio];
    return db.query(q, params);
};

/////////// Queries for the friendship table ///////////

exports.sendFriendRequest = function sendFriendRequest(id, other_id) {
    let q = `INSERT INTO friendship (sender_id, recipient_id)
    VALUES ($1, $2) RETURNING *`;
    let params = [id, other_id];
    return db.query(q, params);
};

exports.getFriendStatus = function getFriendStatus(sender_id, recipient_id) {
    let q = `SELECT * from friendship
    WHERE ((sender_id = $1 AND recipient_id = $2)
    OR (sender_id = $2 AND recipient_id = $1))`;
    let params = [sender_id, recipient_id];
    return db.query(q, params);
};

exports.acceptFriendship = function acceptFriendship(sender_id, recipient_id) {
    let q = `UPDATE friendship SET accepted = true
    WHERE ((sender_id = $1 AND recipient_id = $2)
    OR (sender_id = $2 AND recipient_id = $1))
    RETURNING accepted`;
    let params = [sender_id, recipient_id];
    return db.query(q, params);
};

exports.deleteFriendship = function deleteFriendship(sender_id, recipient_id) {
    let q = `DELETE FROM friendship
    WHERE ((sender_id = $1 AND recipient_id = $2)
    OR (sender_id = $2 AND recipient_id = $1))`;
    let params = [sender_id, recipient_id];
    return db.query(q, params);
};

// may be I will rename it
exports.getFriendList = function getFriendList(id) {
    let q = `SELECT users.id, first, last, users_pic, accepted
        FROM friendship JOIN users
        ON (accepted = false AND recipient_id = $1 AND sender_id = users.id)
        OR (accepted = true AND recipient_id = $1 AND sender_id = users.id)
        OR (accepted = true AND sender_id = $1 AND recipient_id = users.id)`;
    return db.query(q, [id]);
};
