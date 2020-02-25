import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import EditDetails from "../components/EditDetails";
//MUI
import Button from "@material-ui/core/Button";
import MuiLink from "@material-ui/core/Link";

import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import pin from "../assets/marker.png";
import userphoto from "../assets/pencil.png";

//redux
import { connect } from "react-redux";
import { logoutUser, uploadImage } from "../redux/actions/userActions";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleLogout = () => {
    this.props.logoutUser();
  };

  handleImageChange = event => {
    const image = event.target.files[0];
    const formData = new FormData();
    formData.append("image", image, image.name);
    this.props.uploadImage(formData);
  };
  handleEditPicture = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput.click();
  };

  render() {
    const {
      user: {
        credentials: { username, createdAt, bio, website, location, imageUrl },
        loading,
        authenticated
      }
    } = this.props;

    let profileMarkUp = !loading ? (
      authenticated ? (
        <div className="sec-column">
          <div className="profile-details">
            <MuiLink
              component={Link}
              to={`/users/${username}`}
              color="primary"
              variant="h5"
            >
              <h4 className="profile-username">@{username}</h4>
            </MuiLink>
            <div className="slikaibio">
              <img src={imageUrl} alt="userImage" className="biguserimage" />
              <input
                type="file"
                id="imageInput"
                hidden="hidden"
                onChange={this.handleImageChange}
              />
            </div>
            <div className="editphotoicon">
              <img src={userphoto} onClick={this.handleEditPicture} />
            </div>

            <div className="bioiostalo">
              {bio && <div variant="body2">{bio}</div>}

              {location && (
                <div className="profile-loc">
                  <img src={pin} />
                  <span>{location}</span>
                </div>
              )}
              {website && (
                <div className="profile-web">
                  <a href={website} target="_blank" rel="noopener noreferrer">
                    {" "}
                    {website}
                  </a>
                </div>
              )}
              <EditDetails />
            </div>
          </div>
        </div>
      ) : (
        <div className="naslovnica-right">
          <h1 className="main-title">
            Saznaj što se trenutno događa u svijetu
          </h1>
          <h3 className="snd-title">
            Pridruži se PostIt aplikaciji već danas{" "}
          </h3>
          <div className="profile-button">
            <button className="profile-login-btn">
              <Link to="/login">PRIJAVI SE</Link>
            </button>
            <button className="profile-signup-btn">
              <Link to="/signup">REGISTRIRAJ SE</Link>
            </button>
          </div>
        </div>
      )
    ) : (
      <p>loading</p>
    );

    return profileMarkUp;
  }
}

const mapStateToProps = state => ({
  user: state.user
});

const mapActionsToProps = { logoutUser, uploadImage };

Profile.propTypes = {
  user: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapActionsToProps)(Profile);
