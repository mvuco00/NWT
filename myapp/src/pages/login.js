import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
//redux
import { connect } from "react-redux";
import { loginUser } from "../redux/actions/userActions";

class LogIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
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

    const userData = {
      email: this.state.email,
      password: this.state.password
    };
    this.props.loginUser(userData, this.props.history);
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  render() {
    const {
      UI: { loading }
    } = this.props;
    const { errors } = this.state;
    return (
      <div>
        <div className="logintitle">
          <div>Prijavite se na Post-It</div>
        </div>

        <div>
          <form className="loginform" onSubmit={this.handleOnSubmit}>
            <input
              id="email"
              name="email"
              type="email"
              className="email-login"
              placeholder="email"
              value={this.state.email}
              onChange={this.handleChange}
            />

            <div className="error-popup">
              {this.state.errors.email ||
                (this.state.errors.error === "auth/user-not-found"
                  ? "Wrong email"
                  : "")}
            </div>
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

            <button className="prijavise-login">Prijavi se</button>
          </form>
          <div className="mogucnost-registracije">
            <small>
              Ako nemate račun <Link to="/signup"> registrirajte se</Link>
            </small>
          </div>
        </div>
      </div>
    );
  }
}

LogIn.propTypes = {
  loginUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  UI: state.UI
});

//koje akcije koristimo
const mapActionsToProps = {
  loginUser
};

export default connect(mapStateToProps, mapActionsToProps)(LogIn);
