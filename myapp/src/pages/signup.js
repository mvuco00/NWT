import React from "react";

import PropTypes from "prop-types";
import { Link } from "react-router-dom";
//REDUX
import { connect } from "react-redux";
import { signupUser } from "../redux/actions/userActions";

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      confirmPassword: "",
      username: "",

      errors: {}
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({ errors: nextProps.UI.errors });
    }
  }

  handleOnSubmit = event => {
    console.log("login");
    event.preventDefault();
    this.setState({
      loading: true
    });
    const newUserData = {
      email: this.state.email,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword,
      username: this.state.username
    };
    this.props.signupUser(newUserData, this.props.history);
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  render() {
    const { errors } = this.state;
    return (
      <div>
        <div className="logintitle">Registriraj se</div>

        <div>
          <form className="signinform" onSubmit={this.handleOnSubmit}>
            <input
              id="email"
              name="email"
              type="email"
              className="email-login"
              placeholder="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
            {console.log(this.state.errors)}
            <div className="error-popup">{this.state.errors.email}</div>
            <input
              id="password"
              name="password"
              type="password"
              className="password-login"
              placeholder="password"
              value={this.state.password}
              onChange={this.handleChange}
            />
            <div className="error-popup">
              {this.state.errors.general || this.state.errors.password}
            </div>
            {/*CONFIRM PASSWORD*/}
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className="confirmPassword-login"
              placeholder="confirm password"
              value={this.state.confirmPassword}
              onChange={this.handleChange}
            />
            <div className="error-popup">
              {this.state.errors.confirmPassword}
            </div>
            <input
              id="username"
              name="username"
              type="text"
              className="username-login"
              placeholder="username"
              value={this.state.username}
              onChange={this.handleChange}
            />
            {console.log(this.state.errors.username)}
            <div className="error-popup">{this.state.errors.username}</div>

            <button className="prijavise-login">Registriraj se</button>
          </form>
          <div className="mogucnost-registracije">
            <small>
              Već imate račun? <Link to="/login"> prijavite se</Link>
            </small>
          </div>
        </div>
      </div>
    );
  }
}

SignUp.propTypes = {
  signupUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  UI: state.UI
});

export default connect(mapStateToProps, { signupUser })(SignUp);
