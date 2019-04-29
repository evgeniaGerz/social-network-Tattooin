import React from "react";
import ProfilePic from "./profilepic";

export default function(props) {
    return (
        <div>
            {/* ...props */}
            <ProfilePic
                users_pic={props.users_pic}
                first={props.first}
                last={props.last}
                clickHandler={props.clickHandler}
            />
            {props.first} {props.last}
            {/* bio editor */}
        </div>
    );
}
