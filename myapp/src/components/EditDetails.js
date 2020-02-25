import React from "react";
import PropTypes from "prop-types";

//MUI
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
//REDUX
import { connect } from "react-redux";
import { editUserDetails } from "../redux/actions/userActions";

class EditDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bio: "",
      website: "",
      location: "",
      open: false
    };
  }
  mapUserDetailsToState = credentials => {
    this.setState({
      bio: credentials.bio ? credentials.bio : "",
      website: credentials.website ? credentials.website : "",
      location: credentials.location ? credentials.location : ""
    });
  };

  handleOpen = () => {
    this.setState({ open: true });
    this.mapUserDetailsToState(this.props.credentials);
  };
  handleClose = () => {
    this.setState({ open: false });
  };

  componentDidMount() {
    const { credentials } = this.props;
    this.mapUserDetailsToState(credentials);
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleSubmit = () => {
    const userDetails = {
      bio: this.state.bio,
      website: this.state.website,
      location: this.state.location
    };
    this.props.editUserDetails(userDetails);
    this.handleClose();
  };

  render() {
    return (
      <div className="urediprofil2">
        <button onClick={this.handleOpen} className="urediprofil">
          uredi profil
        </button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Uredite vaše podatke</DialogTitle>
          <DialogContent>
            <form>
              <TextField
                name="bio"
                type="text"
                label="Bio"
                multiline
                rows="2"
                placeholder="Kratki bio"
                className="editbio"
                value={this.state.bio}
                onChange={this.handleChange}
                fullWidth
              />

              <TextField
                name="website"
                type="text"
                label="Website"
                placeholder="Vaša stranica"
                className="editpage"
                value={this.state.website}
                onChange={this.handleChange}
                fullWidth
              />

              <TextField
                name="location"
                type="text"
                label="location"
                placeholder="Vaša lokacija"
                className="editlocation"
                value={this.state.location}
                onChange={this.handleChange}
                fullWidth
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="secondary">
              ODUSTANI
            </Button>
            <Button onClick={this.handleSubmit} color="primary">
              SPREMI
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

EditDetails.propTypes = {
  editUserDetails: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  credentials: state.user.credentials
});

export default connect(mapStateToProps, { editUserDetails })(EditDetails);
