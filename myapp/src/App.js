import React from "react";
//import Header from "./components/Header";
//import Tweets from "./components/Tweets";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "./App.css";
//import { Router } from "express";
import home from "./pages/home";
import login from "./pages/login";
import signup from "./pages/signup";
import Header from "./components/Header";

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App">
        {/*za povezivanje stranica*/}

        <BrowserRouter>
          <div className="container">
            <Header />
            <Switch>
              <Route exact path="/" component={home} />
              <Route exact path="/login" component={login} />
              <Route exact path="/signup" component={signup} />
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
