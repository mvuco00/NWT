import React from "react";

import axios from "axios";
/**/
class Tweets extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    posts: null
  };

  componentDidMount() {
    axios
      .get("/posts")
      .then(res => {
        console.log(res.data);
        this.setState({ posts: res.data });
      })
      .catch(err => console.log(err));
  }

  render() {
    let recentPosts = this.state.posts ? (
      this.state.posts.map(post => (
        <div className="tweet" key={post.postId}>
          <div className="username">{post.username}</div>
          <div className="body">{post.body}</div>
        </div>
      ))
    ) : (
      <p>Loading...</p>
    );
    return <div className="tweets">{recentPosts}</div>;
  }
}

export default Tweets;
