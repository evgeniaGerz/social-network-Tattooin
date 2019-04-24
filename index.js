// ---------------- REQUIRES ----------------
const express = require("express");
const app = express();
const compression = require("compression");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const db = require("./db");
const { hashPassword, checkPassword } = require("./bcrypt");

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

app.use(csurf()); // has to be after cookieSession and body-parser, adds a method retuns a token

// ---------------- ROUTES ----------------

// ---------------- REGISTER PAGE ---------
app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.post("/register", (req, res) => {
    console.log("req.body: ", req.body);
    hashPassword(req.body.password).then(hash => {
        db.addUser(req.body.first, req.body.last, req.body.email, hash)
            .then(results => {
                // should i use cookie here???
                req.session.user = {
                    id: results.rows[0].id,
                    first: req.body.first,
                    last: req.body.last,
                    email: req.body.email,
                    password: hash
                };
                console.log("req.session.user: ", req.session.user);
                // or should I use res.json???
                res.json(results.rows);
                // and this???
                res.redirect("/welcome");
            })
            .catch(err => {
                console.log("error in addUser: ", err);
            });
    });
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/welcome");
});

// ----- this route has to be after all other routes -----
app.get("*", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.listen(8080, function() {
    console.log("I'm listening.");
});
