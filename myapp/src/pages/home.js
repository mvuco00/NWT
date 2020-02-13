import React from "react";
import Tweets from "../components/Tweets";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        <h1>Home</h1>
        <Tweets />
      </div>
    );
  }
}

export default Home;
