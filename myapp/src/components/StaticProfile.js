import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import EditDetails from "../components/EditDetails";
//MUI
import MuiLink from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import LocationOn from "@material-ui/icons/LocationOn";
import LinkIcon from "@material-ui/icons/Link";
import Tooltip from "@material-ui/core/Tooltip";
import KeyboardReturn from "@material-ui/icons/KeyboardReturn";

import IconButton from "@material-ui/core/IconButton";

class StaticProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const {
      profile: { username, createdAt, imageUrl, bio, website, location }
    } = this.props;
    return (
      <div>
        <div className="sec-column">
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
        </div>
      </div>
    );
  }
}

StaticProfile.propTypes = {
  profile: PropTypes.object.isRequired
};

export default StaticProfile;
