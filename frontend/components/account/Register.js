// Import frameworks
import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';

// Import material-ui
import { Button, TextField, IconButton, Typography, InputAdornment } from '@material-ui/core';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';
import TopNav from '../nav/TopNav';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#00BCD4',
      contrastText: '#00BCD4'
    },
    secondary: {
      main: '#00BCD4',
      contrastText: '#FFFFFF'
    }
  },
  typography: {
    useNextVariants: true,
  },
});


/**
 * Component to render the form for a user registering
 */
class Register extends Component {
    // Constructor method
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      error: '',
      showPassword: false,
      redirect: false,
    };

    // Bindings so 'this' refers to component
    this.redirect = this.redirect.bind(this);
    this.handleChangeFirstName = this.handleChangeFirstName.bind(this);
    this.handleChangeLastName = this.handleChangeLastName.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleConfirmPassword = this.handleConfirmPassword.bind(this);
    this.handleRegisterSubmit = this.handleRegisterSubmit.bind(this);
    this.handleClickShowPassword = this.handleClickShowPassword.bind(this);
  }

  // When register button clicked, will attempt to register on backend (account.js)
  handleRegisterSubmit(event) {
    // Prevent the default form action
    event.preventDefault();
    // Pull variables from state
    const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword
    } = this.state;

    // Check that required form fields are filled in.
    if (!firstName || !lastName || !email || !password || !confirmPassword
        || firstName === '' || lastName === '' || email === ''
        || password === '' || confirmPassword === '') {
      this.setState({
        error: 'Please fill out all form fields',
      });
      return;
    }

    // Before, we post check to see that both passwords match.
    if (confirmPassword !== password) {
      this.setState({
        error: 'Please make sure the passwords match',
      });
      return;
    }

    /**
     * Call to backend route to register the user
     */
     // Otherwise if the passwords match and all the necessary fields are filled out,
     // make a call to the backend to register the user.
     axios.post('/api/user/register', {
       firstName,
       lastName,
       email,
       password,
     })
       .then(response => {
         // If the user did not successfully register
         if (!response.data.success) {
           this.setState({
             error: response.data.error,
           });
           // If the user did successfully register
         } else {
           // Update AppContainer state
           this.props.updateAuthState(true, false);

           this.setState({
             error: null,
             redirect: true,
           });
         }
       })
     // If there was some unhandled error to this point
       .catch(err => {
         this.setState({
           error: err.message,
         });
       });
  }

  /**
     * The following methods dynamically update state for each input field
     * when a user begins typing.
     */

    handleChangeFirstName(event) {
      this.setState({
        firstName: event.target.value,
      });
    }

    handleChangeLastName(event) {
      this.setState({
        lastName: event.target.value,
      });
    }

    handleChangeEmail(event) {
      this.setState({
        email: event.target.value,
      });
    }

    handleClickShowPassword(event) {
      this.setState({
        showPassword: !this.state.showPassword
      });
    }

    handleChangePassword(event) {
      this.setState({
        password: event.target.value,
      });
    }


    handleConfirmPassword(event) {
      this.setState({
        confirmPassword: event.target.value,
      });
    }


    // Redirect appropriately
    redirect() {
      if (this.state.redirect) {
        return <Redirect to="/authenticate"/>;
      }
    }

  /**
   * Renders actual Register component
   */
  render() {
    // If user is logged in or if user successfully logs in, redirects to home
    return (
      <div
          className="container centerContent"
          style={{ minHeight: "100vh", padding: "0"}}
      >
      {this.redirect()}

        <TopNav
          title="Register"
          leftLink="/login"
        />

        <br/><br/><br/>

        <MuiThemeProvider theme={theme}>
          <TextField
            required
            id="first name"
            label="First Name"
            type="text"
            margin="normal"
            variant="outlined"
            style={{ width: "80%", margin: "0 auto" }}
            onChange={ this.handleChangeFirstName }/>
          <br/>
          <br/>
          <TextField
            required
            id="last name"
            label="Last Name"
            margin="normal"
            variant="outlined"
            style={{ width: "80%", margin: "0 auto" }}
            type="text"
            onChange= { this.handleChangeLastName }/>
          <br/>
          <br/>
          <TextField
            required
            id="email"
            label="Your email"
            margin="normal"
            variant="outlined"
            type="email"
            style={{ width: "80%", margin: "0 auto" }}
            onChange= { this.handleChangeEmail }/>
          <br/>
          <br/>
          <TextField
            id="adornment-password"
            type={this.state.showPassword ? "text" : "password"}
            value={this.state.password}
            required
            label="Password"
            margin="normal"
            variant="outlined"
            onChange= { this.handleChangePassword }
            style={{ width: "80%", margin: "0 auto" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Toggle password visibility"
                    onClick={this.handleClickShowPassword}
                  >
                    {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <br/>
          <br/>
          <TextField
            required
            id="verify password"
            label="Verify Password"
            type="password"
            margin="normal"
            variant="outlined"
            style={{ width: "80%", margin: "0 auto" }}
            onChange= { this.handleConfirmPassword }/>
          <br/>
          <br/>

          <div
            style={{'color': "#fc5d5c'", 'fontSize': "14px"}}
            visibility={this.state.error === '' ? "hidden" : "visible"}>
            {this.state.error}
            <br/>
          </div>

          <br/>

          <Button
            size="large"
            style={{ width: "80%", margin: "0 auto" }}
            color="secondary"
            variant="contained"
            onClick={ this.handleRegisterSubmit }
          >
            Register
          </Button>

          <br/><br/>

        </MuiThemeProvider>
      </div>
    );
  }
}

// Prop validations
Register.propTypes = {
  userId: PropTypes.string,
  updateAuthState: PropTypes.func
};

const mapStateToProps = ({ authState }) => {
  return {
    userId: authState.userId,
  };
};

export default connect(mapStateToProps)(Register);
