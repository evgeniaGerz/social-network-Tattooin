import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./welcome";

// <HelloWorld /> is a component
ReactDOM.render(<Welcome />, document.querySelector("main"));

// component <HelloWorld /> is invoked here
function HelloWorld() {
    return <div>Hello, World!</div>;
}

let elem;

if (location.pathname == "/welcome") {
    //user is logged in
    elem = <Welcome />;
} else {
    //user is not logged in
    elem = <img src="logo.gif" />;
}
