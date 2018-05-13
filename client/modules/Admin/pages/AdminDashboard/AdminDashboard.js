/*
 * NOTE:
 * Maybe there should be a wrapper around this page <-- No, this is itself a wrapper for GameList.
 * We want to be able to generalize it for multiple types of lists (owned, unclaimed, all)
 * We also want to show / hide button that creates games.
*/

import React, { PropTypes, Component } from 'react';
import { DisplayText } from "@shopify/polaris";
import { connect } from 'react-redux';
import { Link } from 'react-router';

class AdminDashboard extends Component {

  componentWillMount() {
    // This is for stopping unauthorized access of this page
    // if (!this.props.user || this.props.user.type !== 'admin') {
    //   this.context.router.push('/');
    // }
  }

  render() {
    return (
      <div>
        <div>My coupons</div>
        <div>My subscriptions</div>
      </div>
    );
  }
}

// Actions required to provide data for this component to render in sever side.
AdminDashboard.need = [];

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
  };
}

AdminDashboard.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

AdminDashboard.contextTypes = {
  router: React.PropTypes.object,
};

export default connect(mapStateToProps)(AdminDashboard);
