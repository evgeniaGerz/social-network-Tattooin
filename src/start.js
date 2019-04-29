import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./welcome";
import App from "./app";

let elem;

if (location.pathname == "/welcome") {
    //user is not logged in
    elem = <Welcome />;
} else {
    //user is logged in
    elem = <App />;
    //elem = <img className="logo" src="/img/logo.png" />;
}

//
ReactDOM.render(elem, document.querySelector("main"));
