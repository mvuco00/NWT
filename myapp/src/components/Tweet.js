import React from "react";
import PropTypes from "prop-types";
import DeletePost from "./DeletePost";
import CardMedia from "@material-ui/core/CardMedia";
//mui

import { Link } from "react-router-dom";
import MyButton from "../util/MyButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";

//REDUX
import { connect } from "react-redux";
import { likePost, unlikePost } from "../redux/actions/dataActions";
//icons

class Tweet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  likedPost = () => {
    if (
      this.props.user.likes &&
      this.props.user.likes.find(like => like.postId === this.props.post.postId)
    ) {
      return true;
    } else return false;
  };
  likePost = () => {
    this.props.likePost(this.props.post.postId);
  };
  unlikePost = () => {
    this.props.unlikePost(this.props.post.postId);
  };
  render() {
    const {
      post: { body, createdAt, userImage, username, postId, likeCount },
      user: {
        authenticated,
        credentials: { username: username2 }
      }
    } = this.props;

    const likeButton = !authenticated ? (
      <MyButton tip="Like">
        <Link to="/login">
          <FavoriteBorder color="primary" />
        </Link>
      </MyButton>
    ) : this.likedPost() ? (
      <MyButton tip="unlike" onClick={this.unlikePost}>
        <FavoriteIcon color="primary" />
      </MyButton>
    ) : (
      <MyButton tip="like" onClick={this.likePost}>
        <FavoriteBorder color="primary" />
      </MyButton>
    );

    const deleteButton =
      authenticated && username === username2 ? (
        <DeletePost postId={postId} />
      ) : null;
    return (
      <div>
        <div className="postit" key={postId}>
          <div className="bodynphoto">
            <img src={userImage} alt="userimage" className="userimage" />
            <div className="usernamenbody">
              <div className="username-post">
                <Link to={`/users/${username}`}>{`@${username}`}</Link>
              </div>

              <div className="postit-body">{body}</div>
            </div>
          </div>

          <div className="likedelete">
            {deleteButton}
            <div>
              {likeButton} {likeCount}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
Tweet.propTypes = {
  likePost: PropTypes.func.isRequired,
  unlikePost: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

const mapActionsToProps = {
  likePost,
  unlikePost
};

export default connect(mapStateToProps, mapActionsToProps)(Tweet);
