// ---------------- REQUIRES ----------------
const express = require("express");
const app = express();
const compression = require("compression");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const db = require("./db");
const { hashPassword, checkPassword } = require("./src/bcrypt");

// ---------------- SERVER SIDE SOCKET CONFIGURATIONS ----------------
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });

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
// SOCKET COOKIE - start
const cookieSessionMiddleware = cookieSession({
    maxAge: 1000 * 60 * 60 * 24 * 14,
    secret: "I'm always angry"
});

app.use(cookieSessionMiddleware);

io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});
// SOCKET COOKIE - end

/*
app.use(
    cookieSession({
        maxAge: 1000 * 60 * 60 * 24 * 14,
        secret: "I'm always angry"
    })
);
*/
app.use(require("body-parser").json());

app.use(csurf()); // has to be after cookieSession and body-parser, adds a method retuns a token

app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

// ---------------- ROUTES ----------------

// ---------------- REGISTER PAGE ----------------
app.get("/welcome", (req, res) => {
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
                console.log("results: ", results);
                req.session.user = {
                    id: results.rows[0].id,
                    first: req.body.first,
                    last: req.body.last,
                    email: req.body.email,
                    password: hash
                };
                res.json({ success: true });
                res.redirect("/");
            })
            .catch(err => {
                console.log("error in addUser: ", err);
            });
    });
});

// ---------------- LOGIN PAGE ----------------

app.post("/login", (req, res) => {
    console.log("req.session: ", req.session);
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

// ---------------- PROFILE PAGE ----------------

app.get("/user", (req, res) => {
    db.getUserProfile(req.session.user.id).then(data => {
        res.json({
            id: data.rows[0].id,
            first: data.rows[0].first,
            last: data.rows[0].last,
            users_pic: data.rows[0].users_pic,
            bio: data.rows[0].bio
        });
    });
});

// ---------------- OTHER PROFILES ----------------

app.get("/user/:id/anything", (req, res) => {
    if (req.params.id == req.session.user.id) {
        res.json({
            redirect: true
        });
    } else {
        //console.log("req.params.id: ", req.params.id);
        db.getUserProfile(req.params.id)
            .then(data => {
                res.json(data.rows[0]);
            })
            .catch(err => {
                console.log("error in getUserProfile: ", err);
            });
    }
});

// ---------------- UPLOAD PROFILE PICTURE ----------------

app.post("/uploadPic", uploader.single("file"), s3.upload, function(req, res) {
    const url = config.s3Url + req.file.filename;
    if (req.file) {
        db.updateUserPic(req.session.user.id, url)
            .then(data => {
                res.json(data);
            })
            .catch(err => {
                console.log("errror in updateUserPic: ", err);
            });
    } else {
        res.json({ success: false });
    }
});

// ---------------- EDIT BIO IN PROFILE ----------------
app.post("/editBio", (req, res) => {
    db.updateBio(req.session.user.id, req.body.bio)
        .then(data => {
            res.json(data.rows[0]);
        })
        .catch(err => {
            console.log("error in updateBio: ", err);
        });
});

// ---------------- CHECK THE FRIENDSHIP STATUS ----------------
app.get("/friendstatus/check/:id", (req, res) => {
    //console.log("req.session.user.id: ", req.session.user.id);
    //console.log("req.params.id: ", req.params.id);
    db.getFriendStatus(req.session.user.id, req.params.id)
        .then(results => {
            console.log("results of getFriendStatus: ", results);
            res.json(results.rows[0]);
        })
        .catch(err => {
            console.log("error in getFriendStatus: ", err);
        });
});

// ---------------- SEND A FRIEND REQUEST ----------------
app.post("/friendstatus/send/:id", (req, res) => {
    db.sendFriendRequest(req.session.user.id, req.params.id).then(results => {
        console.log("results of sendFriendRequest: ", results);
        res.json(results);
    });
});

// ---------------- DELETE A FRIEND REQUEST ----------------
app.post("/friendstatus/delete/:id", (req, res) => {
    console.log("start the route");
    db.deleteFriendship(req.session.user.id, req.params.id)
        .then(results => {
            console.log("results of deleteFriendship: ", results);
            res.json(results);
        })
        .catch(err => {
            console.log("catch here", err);
        });
});

// ---------------- ACCEPT A FRIEND REQUEST ----------------
app.post("/friendstatus/accept/:id", (req, res) => {
    db.acceptFriendship(req.session.user.id, req.params.id).then(results => {
        console.log("results of acceptFriendship: ", results);
        res.json(results);
    });
});

// ---------------- LIST of FRIENDS ----------------
app.get("/friends/something", (req, res) => {
    db.getFriendList(req.session.user.id, req.params.id).then(friends => {
        res.json(friends.rows);
    });
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
});

// ---------------- this route has to be after all other routes ----------------
app.get("*", function(req, res) {
    if (!req.session.user) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

/*
server.listen(8080, function() {
    console.log("I'm listening.");
});
*/

// Port for Heroku
server.listen(process.env.PORT || 8080, function() {
    console.log("I'm listening");
});

// ---------------- SOCKET ----------------
//let onlineUser = [];
let chatMessages = [];

io.on("connection", socket => {
    console.log("socket.request.session: ", socket.request.session);
    console.log("connected socket with id: ", socket.id);

    socket.emit("chatMessages", chatMessages);

    socket.on("newChatMessage", data => {
        console.log("data in newChatMessage", data);
        //console.log("req.session.user", req.session.user);
        let userId = socket.request.session.user.id;

        db.insertNewMessage(userId, data).then(({ results }) => {
            console.log("results: ", results);
            //let message = results.rows[0].id;
            //let time = results.rows[0].created_at;

            db.getAllMessages().then(data => {
                console.log("data in getAllMessages: ", data);
                let newChatMessageObj = {
                    first: socket.request.session.user.first,
                    last: socket.request.session.user.last,
                    users_pic: user.users_pic,
                    message: data,
                    id: userId
                };
                io.socket.emit("newChatMessage", newChatMessageObj);
            });
        });
    });
});

/* ---------------- SOCKET ----------------
io.on("connection", socket => {
    console.log("connected socket with id: ", socket.id);

    socket.emit("welcome", {
        message: "nice to meet you"
    });

    socket.on("disconnect", function() {
        console.log("disconnected socket with id: ", socket.id);
    });

    /*
    socket.on("newChatMessage", data => {
        // insert the user id and chat message  - if using DB method
        // if using array method - push chat message into array
        // as a result we'' have to query db to get info
        // about the user who posted the message (their first, last, profile pic etc) - just simple SELECT by id
        // NEXT STEP: get user's first, last, profile pic  and chat message into Redux
        // we need create an object that will store the user's first, last etc.
        // And this object needs to look like the other object in the chat array in Redux
        let myNewChat = {
            first: results.rows[0].first,
            last: results.rows[0].last,
            id: socket.request.session.user.id,
            timestamp: result.rows[0].timestamp,
            chat: data
        };
        // send another socket message to the Frontend
        socket.broadcast("chatMessageForRedux", myNewChat);
    });

});
*/
