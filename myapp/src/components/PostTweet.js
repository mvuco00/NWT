import React, { Fragment } from "react";
import PropTypes from "prop-types";
//MUI
import MyButton from "../util/MyButton";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
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
      this.setState({ body: "" });
      this.handleClose();
    }
  }

  handleOpen = () => {
    this.setState({ open: true });
  };
  handleClose = () => {
    this.setState({ open: false, errors: {} });
  };
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
    const { errors } = this.state;
    const {
      UI: { loading }
    } = this.props;

    return (
      /*
      <Fragment>


        <MyButton onClick={this.handleOpen} tip="Post It">
          <AddIcon />
        </MyButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <MyButton
            tip="close"
            onClick={this.handleClose}
            tipClassName="closebth"
          >
            <CloseIcon />
          </MyButton>
          <DialogTitle>Objavite novi Post</DialogTitle>
          <DialogContent>
            <form onSubmit={this.handleSumbit}>
              <TextField
                name="body"
                type="text"
                label="POSTIT!"
                multiline
                rows="2"
                placeholder="Post it!"
                error={errors.body ? true : false}
                helperText={errors.body}
                className="post-it-body"
                onChange={this.handleChange}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className="positisubmit"
                onClick={this.handleSubmit}
              >
                {" "}
                SUBMIT
                {loading && (
                  <CircularProgress size={30} className="circular-progress" />
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </Fragment>
      */
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
          SUBMIT
          {loading && (
            <CircularProgress size={30} className="circular-progress" />
          )}
        </button>
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
