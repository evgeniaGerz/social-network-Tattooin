import React from "react";

function Error(props) {
    if (props.error) {
        return <p className="error">{error}</p>;
    } else {
        return null;
    }
}

export default Error;
