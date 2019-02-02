import React, { Component } from 'react';

import { connect } from 'react-redux';

class Hero extends Component {
    componentDidMount() {
        this.props.notifyLoaded();
    }

    render() {
        return(
            <div className="rn rn_nav rn-sleep">
                {/* icon */}
                {/* title */}
                {/* start time small title */}
                {/* start timer */}
                {/* end time small title */}
                {/* end timer */}
                {/* stars rating small title */}
                {/* stars rating */}
                {/* absolute slide button >> div :: history (header: mid time, body: history) */}
            </div>
        );
    }
}

const mapStateToProps = () => ({});

const mapActionsToProps = {
    notifyLoaded: () => ({ type: "NOTIFY_NEW_PAGE", payload: "SLEEP_PAGE" })
}

export default connect(
    mapStateToProps,
    mapActionsToProps
)(Hero);