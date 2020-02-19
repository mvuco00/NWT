import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import EditDetails from "../components/EditDetails";
//MUI
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import MuiLink from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import LocationOn from "@material-ui/icons/LocationOn";
import LinkIcon from "@material-ui/icons/Link";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import KeyboardReturn from "@material-ui/icons/KeyboardReturn";

//redux
import { connect } from "react-redux";
import { logoutUser } from "../redux/actions/userActions";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleLogout = () => {
    this.props.logoutUser();
  };

  render() {
    const {
      user: {
        credentials: { username, createdAt, bio, website, location },
        loading,
        authenticated
      }
    } = this.props;

    let profileMarkUp = !loading ? (
      authenticated ? (
        <Paper className="paper">
          <div className="profile-details">
            <MuiLink
              component={Link}
              to={`/users/${username}`}
              color="primary"
              variant="h5"
            >
              @{username}
            </MuiLink>
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
          <Tooltip title="Logout" placement="top">
            <IconButton onClick={this.handleLogout}>
              <KeyboardReturn color="primary" />
            </IconButton>
          </Tooltip>
          <EditDetails />
        </Paper>
      ) : (
        <div>
          <Paper className="nismo-auth">
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
          </Paper>
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

const mapActionsToProps = { logoutUser };

Profile.propTypes = {
  user: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapActionsToProps)(Profile);
