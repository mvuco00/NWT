import React from "react";
import logo from "../assets/process.png";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import PropTypes from "prop-types";
//import Tweets from "./components/Tweets";
import { BrowserRouter, Switch, Route } from "react-router-dom";

//icons

import { logoutUser } from "../redux/actions/userActions";

class Header extends React.Component {
  constructor(props) {
    super(props);
  }
  handleLogout = () => {
    this.props.logoutUser();
  };

  render() {
    const { authenticated } = this.props;
    const {
      user: {
        credentials: { username }
      }
    } = this.props;
    return (
      <div className="header">
        <Link to="/">
          <img className="logo" src={logo} alt="logo" />
        </Link>
        {authenticated ? (
          <div>
            <Button color="inherit" component={Link} to={`/users/${username}`}>
              TVOJ PROFIL
            </Button>
            <Button color="inherit" onClick={this.handleLogout}>
              Odjavi se
            </Button>
          </div>
        ) : (
          <div className="btns-main">
            <Button color="inherit" component={Link} to="/login">
              Prijavi se
            </Button>
            <Button color="inherit" component={Link} to="/signup">
              Registriraj se
            </Button>
          </div>
        )}

        {/*
          
          */}
      </div>
    );
  }
}

Header.propTypes = {
  user: PropTypes.object.isRequired,
  authenticated: PropTypes.bool.isRequired,
  logoutUser: PropTypes.func.isRequired,
  credentials: PropTypes.object.isRequired
};
const mapActionsToProps = { logoutUser };

const mapStateToProps = state => ({
  user: state.user,
  authenticated: state.user.authenticated
});

export default connect(mapStateToProps, mapActionsToProps)(Header);
