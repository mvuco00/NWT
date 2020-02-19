import React from "react";
import Tweets from "../components/Tweets";
import Profile from "../components/Profile";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        <h1>Home</h1>
        <div className="grid">
          <div>
            <Tweets />
          </div>
          <div>
            <Profile />
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
