import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        console.log("props in uploader: ", props);
        super(props);
        this.state = {
            users_pic: ""
        };
        this.formPic;
        this.uploadPic = this.uploadPic.bind(this);
    }

    uploadPic(e) {
        e.preventDefault();
        //console.log("e.target.form[0].files[0]: ", e.target.form[0].files[0]);
        //var file = e.target.form[0].files[0];

        var formData = new FormData();
        formData.append("file", this.formPic);
        //console.log("formData: ", formData);
        axios
            .post("/uploadPic", formData)
            .then(data => {
                console.log("data in post /uploadPic: ", data);
                console.log("this.state.users_pic", this.state.users_pic);
                console.log("data.users_pic: ");
                this.props.setImage(data.users_pic);
                this.setState({
                    users_pic: this.formPic
                });
            })
            .catch(err => {
                console.log("Error in axios.post('/uploadPic): ", err);
            });
    }
    render() {
        return (
            <div className="uploader">
                <img src="/img/icon-user.png" width="100" height="auto" />
                <div
                    className="hideUploader-container"
                    onClick={this.props.hideUploader}
                />
                <form>
                    <h2>Want to change your profile image?</h2>
                    <input
                        onChange={e => {
                            this.formPic = e.target.files[0];
                        }}
                        type="file"
                        name="file"
                        placeholder="file"
                    />
                    <button onClick={this.uploadPic}>Upload pic</button>
                </form>
            </div>
        );
    }
}
