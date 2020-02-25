import React, { Fragment } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Link } from "react-router-dom";
import Tweet from "../components/Tweet";
import { connect } from "react-redux";
import { getUserData } from "../redux/actions/dataActions";
import StaticProfile from "../components/StaticProfile";

class user extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: null
    };
  }
  componentDidMount() {
    const username = this.props.match.params.username;

    this.props.getUserData(username);
    axios
      .get(`/user/${username}`)
      .then(res => {
        this.setState({
          profile: res.data.user
        });
      })
      .catch(err => console.log(err));
  }

  render() {
    const { posts, loading } = this.props.data;

    const postMarkup = loading ? (
      <p>Loading...</p>
    ) : posts === null ? (
      <p>Ovaj korisnik nema objava</p>
    ) : (
      posts.map(post => <Tweet key={post.postId} post={post} />)
    );

    return (
      <div>
        {this.state.profile === null ? (
          <p>Loading profile...</p>
        ) : (
          <StaticProfile profile={this.state.profile} />
        )}
        <div className="grid2">
          <div>{postMarkup}</div>
          <div></div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  data: state.data
});

user.propTypes = {
  getUserData: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};

export default connect(mapStateToProps, { getUserData })(user);
