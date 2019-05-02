import React from "react";
import axios from "./axios";

export default class OtherProfile extends React.Component {
    componentDidMount() {
        const id = this.props.match.params.id;
        axios.get("/user/" + id).then(({ data }) => {
            if (data.redirect) {
                this.props.history.push("/");
            }
        });
    }
}

// compare the req.session.id and change the url with history.push()
