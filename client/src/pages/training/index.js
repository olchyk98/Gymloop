import React, { Component } from 'react';
import './main.css';

import { connect } from 'react-redux';

class Hero extends Component {
    componentDidMount() {
        this.props.notifyLoaded();
    }

    render() {
        return(
            <div className="rn rn_nav rn-training">
                <div className="rn-training-info">
                    <h2 className="rn-training-info-title">Training section</h2>
                    <p className="rn-training-info-desc">Here you can record your training.</p>
                    <p className="rn-training-info-desc">Or just view your trainings history</p>
                    <button className="rn-training-info-historybtn definp">View history</button>
                </div>
                <div className="rn-training-create">

                </div>
            </div>
        );
    }
}

const mapStateToProps = () => ({});

const mapActionsToProps = {
    notifyLoaded: () => ({ type: "NOTIFY_NEW_PAGE", payload: "TRAINING_PAGE" }),
    castAlert: payload => ({ type: "CAST_GLOBAL_ERROR", payload })
}

export default connect(
    mapStateToProps,
    mapActionsToProps
)(Hero);