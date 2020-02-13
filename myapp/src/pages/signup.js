import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      confirmPassword: "",
      username: "",
      loading: false, //jer zelimo da se pojavi obavijest dok se ne logiramo
      errors: {}
    };
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

    axios
      .post("/signup", newUserData)
      .then(res => {
        console.log(res.data);
        localStorage.setItem("FBIdToken", `Bearer ${res.data.token}`);
        this.setState({
          loading: false
        });
        this.props.history.push("/"); //vrati nas na pocetnu str
      })
      .catch(err => {
        this.setState({
          errors: err.response.data,
          loading: false
        });
      });
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  render() {
    const { errors, loading } = this.state;
    return (
      <div>
        <h1>Registriraj se</h1>
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
              type="username"
              className="username-login"
              placeholder="username"
              value={this.state.username}
              onChange={this.handleChange}
            />

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

export default SignUp;
