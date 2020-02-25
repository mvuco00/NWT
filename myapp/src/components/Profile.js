import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import EditDetails from "../components/EditDetails";
//MUI
import Button from "@material-ui/core/Button";
import MuiLink from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import LocationOn from "@material-ui/icons/LocationOn";
import LinkIcon from "@material-ui/icons/Link";
import Tooltip from "@material-ui/core/Tooltip";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import KeyboardReturn from "@material-ui/icons/KeyboardReturn";

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
            <div className="slikaibio">
              <img src={imageUrl} alt="userImage" className="biguserimage" />
              <input
                type="file"
                id="imageInput"
                hidden="hidden"
                onChange={this.handleImageChange}
              />
              <IconButton onClick={this.handleEditPicture}>
                <EditIcon color="primary" />
              </IconButton>
              <MuiLink
                component={Link}
                to={`/users/${username}`}
                color="primary"
                variant="h5"
              >
                @{username}
              </MuiLink>
            </div>

            <hr />
            {bio && <Typography variant="body2">{bio}</Typography>}
            <hr />
            {location && (
              <Fragment>
                <LocationOn color="primary" />
                <span>{location}</span>
                <hr />
              </Fragment>
            )}
            {website && (
              <Fragment>
                <LinkIcon color="primary" />
                <a href={website} target="_blank" rel="noopener noreferrer">
                  {" "}
                  {website}
                  <hr />
                </a>
              </Fragment>
            )}
          </div>

          <EditDetails />
        </div>
      ) : (
        <div>
          <Typography variant="body2" align="center">
            No profile found, please LOG IN
          </Typography>
          <div className="profile-button">
            <Button
              variant="contained"
              color="secondary"
              component={Link}
              to="/login"
            >
              LOG IN
            </Button>
            <Button
              variant="contained"
              color="secondary"
              component={Link}
              to="/signup"
            >
              SIGN UP
            </Button>
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
