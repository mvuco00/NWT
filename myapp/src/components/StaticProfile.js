import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import EditDetails from "../components/EditDetails";
//MUI
import MuiLink from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import LocationOn from "@material-ui/icons/LocationOn";
import LinkIcon from "@material-ui/icons/Link";
import pin from "../assets/marker.png";

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
        <div className="sec2-column">
          <div className="slikaibio2">
            <div className="velikaslika">
              <img src={imageUrl} alt="userImage" className="biguserimage2" />
            </div>

            <div className="profile-details2">
              <Link to={`/users/${username}`} className="username-prof">
                @{username}
              </Link>

              {bio && <div className="profile2-bio">{bio}</div>}

              {location && (
                <div className="profile-loc">
                  <img src={pin} />
                  <span>{location}</span>
                </div>
              )}
              {website && (
                <div>
                  <div className="profile-web">
                    <a href={website} target="_blank" rel="noopener noreferrer">
                      {" "}
                      {website}
                    </a>
                  </div>
                </div>
              )}
              <EditDetails />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

StaticProfile.propTypes = {
  profile: PropTypes.object.isRequired
};

export default StaticProfile;
