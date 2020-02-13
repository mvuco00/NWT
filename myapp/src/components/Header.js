import React from "react";
import logo from "../assets/process.png";
import Link from "react-router-dom/Link";
//import Tweets from "./components/Tweets";
import { BrowserRouter, Switch, Route } from "react-router-dom";

class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="header">
        <Link to="/">
          <img className="logo" src={logo} alt="logo" />
        </Link>
        <div>
          <Link to="/login">
            <button className="prijavise">Prijavi se</button>
          </Link>

          <Link to="signup">
            <button className="registrirajse">Registriraj se</button>
          </Link>
        </div>
      </div>
    );
  }
}

export default Header;
