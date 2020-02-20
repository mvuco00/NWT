import React from "react";
import PropTypes from "prop-types";
//mui
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
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
      user: { authenticated }
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

    return (
      <div>
        <div className="tweet" key={postId}>
          <div className="username">
            <Link to={`/users/${username}`}>{username}</Link>
          </div>
          <div className="body">{body}</div>
          {likeButton}
          <span>{likeCount} Likes</span>
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
