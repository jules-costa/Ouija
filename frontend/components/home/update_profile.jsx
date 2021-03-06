import React from 'react';
import { withRouter } from 'react-router-dom';

import Dropzone from 'react-dropzone';
import request from 'superagent';

const CLOUDINARY_UPLOAD_PRESET = 'tio3bhpb';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/jules-costa/image/upload';

class UpdateProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.userProfile.id,
      username: this.props.userProfile.username,
      biography: this.props.userProfile.biography,
      image_url: this.props.userProfile.image_url
    };
    this.handleUpdate = this.handleUpdate.bind(this);
    this.update = this.update.bind(this);
  }

  componentDidMount() {
    this.textInput.focus();
  }

  onImageDrop(files) {
    this.handleImageUpload(files[0]);
  }

  handleImageUpload(file) {
    let upload = request.post(CLOUDINARY_UPLOAD_URL)
      .field('upload_preset', CLOUDINARY_UPLOAD_PRESET)
      .field('file', file);

    upload.end((err, response) => {
      if (err) {
        console.error(err);
      }
      if (response.body.secure_url !== '') {
        this.setState({
          image_url: response.body.secure_url
        });
      }
    });
  }

  handleUpdate(e) {
    e.preventDefault();
    this.props.updateProfile(this.state).then(user => this.props.history.push(`/users/${this.props.userProfile.id}`));
  }

  update(field) {
    return (e) => this.setState({ [field] : e.target.value });
  }

  renderErrors() {
    return(
      <ul>
        {this.props.errors.map((error, i) => (
          <li key={`error=${i}`}>
            *** { error } ***
          </li>
        ))}
      </ul>
    );
  }

  render() {
    const { username, image_url, biography, disciples, gurus } = this.props.userProfile;
      return (
        <section className="user-detail-container">
          <form className="update-profile-form">
            <h4 className="story-errors">{this.renderErrors()}</h4>
            <section className="user-details">
              <div className="name-bio">
                <input type="text"
                  ref={ (input) => {this.textInput = input; }}
                  className="title user-username"
                  placeholder={this.props.userProfile.username}
                  value={this.state.username}
                  onChange={this.update('username')} />
                <textarea type= "text"
                  className="description user-biography"
                  placeholder="Enter a short bio"
                  value={this.state.biography}
                  onChange={this.update('biography')} />
              </div>
              <img className="user-logo-medium" value={this.state.image_url} src={this.state.image_url}></img>
                <Dropzone
                  className="drop-box"
                  multiple={false}
                  accept="image/*"
                  onDrop={this.onImageDrop.bind(this)}>
                  <i className="fa fa-plus" aria-hidden="true"></i>
                </Dropzone>
            </section>
            <div className="profile-buttons">
              <button className="follow-unfollow" onClick={this.handleUpdate}>Update</button>
            </div>
          </form>
        </section>
    );
  }
}

export default withRouter(UpdateProfile);
