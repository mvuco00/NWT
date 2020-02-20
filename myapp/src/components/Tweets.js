import React from "react";
import Tweet from "./Tweet";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getPosts } from "../redux/actions/dataActions";
import { likePost, unlikePost } from "../redux/actions/dataActions";

/**/
class Tweets extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getPosts();
  }

  render() {
    const { posts, loading, post } = this.props.data;

    let recentPosts = !loading ? (
      posts.map(post1 => (
        <Tweet post={post1} />
        /*
         <div className="tweet" key={post.postId}>
          <div className="username">{post.username}</div>
          <div className="body">{post.body}</div>
        </div>
        */
      ))
    ) : (
      <p>Loading...</p>
    );
    return <div className="tweets">{recentPosts}</div>;
  }
}
Tweets.propTypes = {
  getPosts: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  data: state.data,
  user: state.user
});

const mapActionsToProps = {
  getPosts
};

export default connect(mapStateToProps, mapActionsToProps)(Tweets);
