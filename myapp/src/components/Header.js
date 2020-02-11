import React from "react";
import logo from "../assets/process.png";

class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="header">
        <img className="logo" src={logo} alt="fireSpot" />
        Home
      </div>
    );
  }
}

export default Header;
