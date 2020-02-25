import React, { Fragment } from "react";
import PropTypes from "prop-types";
//MUI

import TextField from "@material-ui/core/TextField";

import CircularProgress from "@material-ui/core/CircularProgress";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
//REDUX
import { connect } from "react-redux";
import { postTweet } from "../redux/actions/dataActions";

class PostTweet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      body: "",
      errors: {}
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({
        errors: nextProps.UI.errors
      });
    }
    if (!nextProps.UI.errors && !nextProps.UI.loading) {
      this.setState({ body: "", errors: {} });
    }
  }
  /*
  handleOpen = () => {
    this.setState({ open: true });
  };
  handleClose = () => {
    this.setState({ open: false, errors: {} });
  };
  */
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleSubmit = event => {
    event.preventDefault();
    this.props.postTweet({ body: this.state.body });
    console.log(event);
    this.setState({ body: "", errors: {} });
  };

  render() {
    const { errors, authenticated } = this.state;
    const {
      UI: { loading }
    } = this.props;

    return (
      <div className="postitcomp">
        <TextField
          name="body"
          type="text"
          label="Napišite nešto!"
          variant="outlined"
          value={this.state.body}
          multiline
          rows="2"
          placeholder="Napišite nešto!"
          error={errors.body ? true : false}
          helperText={errors.body}
          className="post-it-body"
          onChange={this.handleChange}
        />
        <button
          type="submit"
          className="positisubmit"
          onClick={this.handleSubmit}
        >
          {" "}
          POŠALJI
        </button>
        {loading && (
          <CircularProgress size={15} className="circular-progress" />
        )}
      </div>
    );
  }
}

PostTweet.propTypes = {
  postTweet: PropTypes.func.isRequired,
  UI: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  UI: state.UI
});

export default connect(mapStateToProps, { postTweet })(PostTweet);
