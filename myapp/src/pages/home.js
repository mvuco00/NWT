import React from "react";
import Tweets from "../components/Tweets";
import Profile from "../components/Profile";
import AddIcon from "@material-ui/icons/Add";
import MyButton from "../util/MyButton";
import PostTweet from "../components/PostTweet";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        <div className="grid">
          <div>
            <h1 className="naslov">Naslovnica</h1>
            <PostTweet />
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
