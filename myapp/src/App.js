import React from "react";

import Header from "./components/Header";
import Tweets from "./components/Tweets";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App">
        <Header />
        <Tweets />

        {}
      </div>
    );
  }
}

export default App;
