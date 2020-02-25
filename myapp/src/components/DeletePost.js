import React from "react";
import PropTypes from "prop-types";
import MyButton from "../util/MyButton";

//MUI
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";

import DeleteOutline from "@material-ui/icons/DeleteOutline";

import { connect } from "react-redux";
import { deletePost } from "../redux/actions/dataActions";
import { DialogActions } from "@material-ui/core";

class DeletePost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }
  handleOpen = () => {
    this.setState({ open: true });
  };
  handleClose = () => {
    this.setState({ open: false });
  };
  deletePost = () => {
    this.props.deletePost(this.props.postId);
    this.setState({ open: false });
  };
  render() {
    return (
      <div>
        <MyButton
          tip="delete"
          onClick={this.handleOpen}
          btnClassName="deletepost-btn"
        >
          <DeleteOutline color="secondary" />
        </MyButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            Jeste li sigurni da želite izbrisati objavu?
          </DialogTitle>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              ODUSTANI
            </Button>
            <Button onClick={this.deletePost} color="secondary">
              IZBRIŠI
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

DeletePost.propTypes = {
  deletePost: PropTypes.func.isRequired,
  postId: PropTypes.string.isRequired
};

export default connect(null, { deletePost })(DeletePost);
