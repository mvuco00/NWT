import React from "react";
//import Header from "./components/Header";
//import Tweets from "./components/Tweets";
import jwtDecode from "jwt-decode"; //za dekodiranje tokena
import { BrowserRouter, Switch, Route } from "react-router-dom";
import axios from "axios";
import "./App.css";
//REDUX
import { Provider } from "react-redux";
import store from "./redux/store";
import { SET_AUTHENTICATED } from "./redux/types";
import { logoutUser, getUserData } from "./redux/actions/userActions";

//import { Router } from "express";
import AuthRoute from "./util/AuthRoute";
import home from "./pages/home";
import login from "./pages/login";
import signup from "./pages/signup";
import Header from "./components/Header";
/**/

const token = localStorage.FBIdToken;
//gledamo je li token isteka
if (token) {
  const decodedToken = jwtDecode(token);
  console.log(decodedToken);
  if (decodedToken.exp * 1000 < Date.now()) {
    store.dispatch(logoutUser());
    window.location.href = "/login";
  } else {
    store.dispatch({ type: SET_AUTHENTICATED });
    axios.defaults.headers.common["Authorization"] = token;
    store.dispatch(getUserData());
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Provider store={store}>
        {/*sve unutar providera ima pristup storu*/}
        <div className="App">
          {/*za povezivanje stranica*/}

          <BrowserRouter>
            <div className="container">
              <Header />
              {console.log(token)}
              <Switch>
                <Route exact path="/" component={home} />
                <AuthRoute exact path="/login" component={login} />
                <AuthRoute exact path="/signup" component={signup} />
              </Switch>
            </div>
          </BrowserRouter>
        </div>
      </Provider>
    );
  }
}

export default App;
