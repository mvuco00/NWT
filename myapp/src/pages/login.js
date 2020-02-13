import React from "react";
import axios from "axios";

class LogIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
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
    const userData = {
      email: this.state.email,
      password: this.state.password
    };

    axios
      .post("/login", userData)
      .then(res => {
        console.log(res.data);
        this.setState({
          loading: false
        });
        this.props.history.push("/");
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
        <h1>Log in</h1>
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
            {console.log(this.state.errors)}
            <div style={{ fontSize: 15, color: "red" }}>
              {this.state.errors.email ||
              this.state.errors.error === "auth/user-not-found"
                ? "Wrong email"
                : ""}
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
            <div style={{ fontSize: 15, color: "red" }}>
              {this.state.errors.general || this.state.errors.password}
            </div>
            <button className="prijavise-login">Prijavi se</button>
          </form>
        </div>
      </div>
    );
  }
}

export default LogIn;