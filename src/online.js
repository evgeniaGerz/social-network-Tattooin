import React from "react";
import { connect } from "react-redux";
import { socket } from "./socket";

class Online extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {}
}
const mapStateToProps = state => {
    return {};
};

export default connect(mapStateToProps)(Online);
