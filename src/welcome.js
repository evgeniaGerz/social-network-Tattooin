import React from "react";
import ReactDOM from "react-dom";
import Registration from "./registration";
import Login from "./login";
import { HashRouter, Route } from "react-router-dom";

export default function Welcome(props) {
    return (
        <div>
            <h1>TattooIn</h1>
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route exact path="/login" component={Login} />
                </div>
            </HashRouter>
        </div>
    );
}
