import React from "react";

export default function ProfilePic({ users_pic, first, last, clickHandler }) {
    return (
        <div className="profilepic" onClick={clickHandler}>
            <img
                src={users_pic || "/img/default.png"}
                width="84"
                height="84"
                alt={first}
            />
        </div>
    );
}
