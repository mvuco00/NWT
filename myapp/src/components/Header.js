import React from "react";
import logo from "../assets/process.png";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import PropTypes from "prop-types";
//import Tweets from "./components/Tweets";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import MyButton from "../util/MyButton";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import KeyboardReturn from "@material-ui/icons/KeyboardReturn";

//icons
import AddIcon from "@material-ui/icons/Add";
import HomeIcon from "@material-ui/icons/Home";
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
    return (
      <div className="header">
        <Link to="/">
          <img className="logo" src={logo} alt="logo" />
        </Link>
        {authenticated ? (
          <div>
            <MyButton tip="Create a post">
              <AddIcon color="primary" />
            </MyButton>

            <Button color="inherit" onClick={this.handleLogout}>
              Odjavi se
            </Button>
          </div>
        ) : (
          <div>
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
  logoutUser: PropTypes.func.isRequired
};
const mapActionsToProps = { logoutUser };

const mapStateToProps = state => ({
  user: state.user,
  authenticated: state.user.authenticated
});

export default connect(mapStateToProps, mapActionsToProps)(Header);
