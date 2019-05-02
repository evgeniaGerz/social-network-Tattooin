// ---------------- REQUIRES ----------------
const express = require("express");
const app = express();
const compression = require("compression");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const db = require("./db");
const { hashPassword, checkPassword } = require("./src/bcrypt");

// ---------------- REQUIRES FOR IMAGES UPLOAD ----------------
var multer = require("multer");
var uidSafe = require("uid-safe");
var path = require("path");
const s3 = require("./s3");
const config = require("./config");

var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

// ---------------- UTILITIES ----------------
app.use(express.static(__dirname + "/public")); // for all static files
app.use(compression());

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.use(
    cookieSession({
        maxAge: 1000 * 60 * 60 * 24 * 14,
        secret: "I'm always angry"
    })
);
app.use(require("body-parser").json());

app.use(csurf()); // has to be after cookieSession and body-parser, adds a method retuns a token

app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

// ---------------- ROUTES ----------------

// ---------------- REGISTER PAGE ---------
app.get("/welcome", (req, res) => {
    console.log("req.session: ", req.session);
    if (req.session.user) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.post("/register", (req, res) => {
    hashPassword(req.body.password).then(hash => {
        db.addUser(req.body.first, req.body.last, req.body.email, hash)
            .then(results => {
                req.session.user = {
                    id: results.rows[0].id,
                    first: req.body.first,
                    last: req.body.last,
                    email: req.body.email,
                    password: hash
                };
                res.json({ success: true }); // or success: true
                res.redirect("/");
            })
            .catch(err => {
                console.log("error in addUser: ", err);
            });
    });
});

// ---------------- LOGIN PAGE ---------

app.post("/login", (req, res) => {
    console.log("req.session.user: ", req.session.user);
    db.getUser(req.body.email).then(data => {
        if (data.length != 0) {
            checkPassword(req.body.password, data.rows[0].password).then(
                matches => {
                    req.session.user = {
                        id: data.rows[0].id,
                        first: data.rows[0].first,
                        last: data.rows[0].last,
                        email: data.rows[0].email
                    };
                    //console.log("req.session: ", req.session);
                    res.json(data.rows);
                }
            );
        }
    });
});

// ---------------- PROFILE PAGE ---------

app.get("/user", (req, res) => {
    db.getUserProfile(req.session.user.id).then(data => {
        console.log("data in getUserProfile: ", data);
        res.json({
            id: data.rows[0].id,
            first: data.rows[0].first,
            last: data.rows[0].last,
            users_pic: data.rows[0].users_pic,
            bio: data.rows[0].bio
        });
    });
});

// ---------------- OTHER PROFILES ---------

app.get("/user/:id/anything", function(req, res) {
    // the route should be named different
    if (req.params.id == req.session.user.id) {
        res.json({
            redirect: true
        });
    }
});

// ---------------- UPLOAD PROFILE PICTURE ---------

app.post("/uploadPic", uploader.single("file"), s3.upload, function(req, res) {
    const url = config.s3Url + req.file.filename;
    console.log("req.file: ", req.file);
    console.log("req.body: ", req.body);

    if (req.file) {
        db.updateUserPic(req.session.user.id, url)
            .then(data => {
                console.log("data in updateUserPic: ", data);
                res.json(data);
            })
            .catch(err => {
                console.log("errror in updateUserPic: ", err);
            });
    } else {
        res.json({ success: false });
    }
});

// ---------------- EDIT BIO IN PROFILE ---------
app.post("/editBio", (req, res) => {
    db.updateBio(req.session.user.id, req.body.bio)
        .then(data => {
            console.log("data in updateBio: ", data); // empty array rows[]
            res.json(data.rows[0]);
        })
        .catch(err => {
            console.log("error in updateBio: ", err);
        });
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
});

// ----- this route has to be after all other routes -----
app.get("*", function(req, res) {
    if (!req.session.user) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.listen(8080, function() {
    console.log("I'm listening.");
});
