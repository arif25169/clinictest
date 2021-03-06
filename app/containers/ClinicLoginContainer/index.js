/**
 *
 * ClinicLoginContainer
 *
 */

import ClinicDashboardNavbar from 'components/ClinicDashboardNavbar/index';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import ClinicLoginForm from 'components/ClinicLoginForm/index';
import injectReducer from 'utils/injectReducer';
import axios from 'axios';
import Snackbar from 'components/Snackbar/index';
import Button from '@material-ui/core/Button';
import { setProgressBar } from '../HandleProgressBar/actions';
import { setUserDetails } from './actions';
import makeSelectClinicLoginContainer from './selectors';
import reducer from './reducer';

/* eslint-disable react/prefer-stateless-function */
export class ClinicLoginContainer extends React.Component {
  state = {
    username: '',
    password: '',
    openError: false,
  };

  handleInputChange = param => event => {
    this.setState({ [param]: event.target.value });
  };

  handleRegisterNow = () => {
    this.props.history.push('/register/clinic');
  };

  handleLogin = () => {
    this.props.onChangeLoadingStatus(true);
    axios
      .post('/login/clinic', {
        username: this.state.username,
        password: this.state.password,
        usertype: 'clinic',
      })
      .then(r => {
        if (r.data.error) {
          this.props.onChangeLoadingStatus(false);
          this.setState({
            errorMessage: r.data.error,
            openError: true,
          });
        } else {
          this.props.setUser(r.data.response);
          this.props.history.push('/clinic/dashboard');
        }
      });
  };

  keyPress = e => {
    if (e.keyCode === 13) {
      this.handleLogin();
    }
  };

  handleErrorClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ openError: false });
  };

  render() {
    const dashMessage = 'Clinic Login';
    const autoHideDur = 10000; // 10 seconds
    return (
      <div>
        <ClinicDashboardNavbar message={dashMessage} />
        <ClinicLoginForm
          onLogin={() => this.handleLogin}
          handleInputChange={data => this.handleInputChange(data)}
          handleRegisterNow={this.handleRegisterNow}
          onKeyPressFunc={this.keyPress}
        />
        <Snackbar
          variant="error"
          message={`Error: ${this.state.errorMessage}`}
          open={this.state.openError}
          handleClose={this.handleErrorClose}
          autoHideDuration={autoHideDur}
        />
      </div>
    );
  }
}

ClinicLoginContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  onChangeLoadingStatus: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  clinicLoginContainer: makeSelectClinicLoginContainer(),
});

function mapDispatchToProps(dispatch) {
  return {
    onChangeLoadingStatus: isOpen => {
      dispatch(setProgressBar(isOpen));
    },
    setUser: user => {
      dispatch(setUserDetails(user));
    },
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'clinicLoginContainer', reducer });

export default compose(
  withReducer,
  withConnect,
)(ClinicLoginContainer);
