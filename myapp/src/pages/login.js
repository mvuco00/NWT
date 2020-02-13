import React from "react";

class LogIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        <h1>Log in</h1>
        <div>
          <form className="loginform">
            <input type="email" className="email-login" placeholder="email" />
            <input
              type="password"
              className="password-login"
              placeholder="password"
            />
          </form>
        </div>
      </div>
    );
  }
}

export default LogIn;
