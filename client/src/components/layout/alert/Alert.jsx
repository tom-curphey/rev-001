import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class Alert extends Component {
  state = {
    message: '',
    type: '',
    id: '',
    showAlert: false
  };

  componentDidMount = () => {
    const { alert } = this.props;
    console.log('alert', alert);

    if (alert.length > 0) {
      this.setState({
        message: alert[0].msg,
        type: alert[0].alertType,
        id: alert[0].id,
        showAlert: true
      });
    } else {
      this.setState({ showAlert: false });
    }
  };

  componentDidUpdate = prevProps => {
    const { alert } = this.props;
    console.log('alert', alert);
    if (prevProps.alert !== alert) {
      if (alert.length > 0) {
        this.setState({
          message: alert[0].msg,
          type: alert[0].alertType,
          id: alert[0].id,
          showAlert: true
        });
      } else {
        this.setState({ showAlert: false });
      }
    }
  };

  render() {
    const { showAlert, message, type } = this.state;

    let extraClasses = '';
    if (showAlert) {
      extraClasses = 'alertStart';
    }

    return (
      <div className={`alertBox ${extraClasses}`}>
        <div className={`alert alert-${type}`}>{message}</div>
      </div>
    );
  }
}

Alert.propTypes = {
  alert: PropTypes.array.isRequired
};

const mapState = state => ({
  alert: state.alert
});

export default connect(mapState)(Alert);

// import React from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';

// const Alert = ({ alerts }) => {
//   let showAlert;
//   if (alerts !== null && alerts.length > 0) {
//     showAlert = alerts.map(alert => (
//       <div
//         key={alert.id}
//         className={`alert alert-${alert.alertType}`}
//       >
//         {alert.msg}
//       </div>
//     ));
//   }

//   return <div className="alertBox">{showAlert}</div>;
// };

// Alert.propTypes = {
//   alerts: PropTypes.array.isRequired
// };

// const mapState = state => ({
//   alerts: state.alert
// });

// export default connect(mapState)(Alert);
