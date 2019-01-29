import React, { Component } from 'react';
import './main.css';

import { connect } from 'react-redux';
import { AreaChart } from 'react-easy-chart';

class Hero extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activityGraph_ww: null,
            routingLink: ""
        }
    }

    componentDidMount() {
        this.props.notifyLoaded();
    }

    render() {
        return(
            <div className="rn rn_nav rn-home">
                <div className="rn-home-row">
                    <div className="rn-home-block rn-home-mainact">
                        <span className="rn-home-mainact-title">
                            Your main activity is
                        </span>
                        <h2 className="rn-home-mainact-activity">Run</h2>
                        <div className="rn-home-mainact-connections">
                            <div className="rn-home-mainact-connections-icon">
                                <i className="fas fa-running" />
                            </div>
                            <span className="rn-home-mainact-connections-text">
                                <strong>0</strong> connections have the same task activity
                            </span>
                        </div>
                    </div>
                    <div className="rn-home-block rn-home-activitygraph" ref={ref => {
                        if(!this.state.activityGraph_ww) {
                            this.setState(() => ({
                                activityGraph_ww: ref.getBoundingClientRect().width
                            }));
                        }
                    }}>
                        <div className="rn-home-activitygraph-header">
                            <span className="rn-home-activitygraph-header-title">Month activity</span>
                            <span className="rn-home-activitygraph-header-month">February 2019</span>
                        </div>
                        <AreaChart // get width and height by parent bounding rect sizes
                            // dataPoints
                            areaColors={ ['blue'] }
                            interpolate="cardinal"
                            width={ this.state.activityGraph_ww || 0 }
                            height={ 100 }
                            data={[
                                [
                                    { x: 10, y: 25 },
                                    { x: 20, y: 10 },
                                    { x: 30, y: 25 },
                                    { x: 40, y: 10 },
                                    { x: 50, y: 12 },
                                    { x: 60, y: 25 },
                                    { x: 70, y: 245 },
                                    { x: 80, y: 25 },
                                    { x: 90, y: 25 },
                                    { x: 100, y: 25 },
                                    { x: 110, y: 25 },
                                    { x: 120, y: 25 },
                                    { x: 130, y: 25 },
                                    { x: 140, y: 25 },
                                    { x: 150, y: 25 },
                                    { x: 160, y: 25 },
                                    { x: 170, y: 25 },
                                ]
                            ]}
                        />
                    </div>
                </div>
                <div className="rn-home-row">
                    <div className="rn-home-block rn-home-calories orange">
                        <span className="rn-home-block-title">Calories in this month</span>
                        <div className="rn-home-block-info">
                            <div className="rn-home-block-info-icon">
                                <i className="fas fa-fire" />
                            </div>
                            <span className="rn-home-block-info-value">311</span>
                            <span className="rn-home-block-info-metr">cal</span>
                        </div>
                    </div>
                    <div className="rn-home-block rn-home-weight red">
                        <span className="rn-home-block-title">Your current weight</span>
                        <div className="rn-home-block-info">
                            <div className="rn-home-block-info-icon">
                                <i className="fas fa-weight-hanging" />
                            </div>
                            <span className="rn-home-block-info-value">95</span>
                            <span className="rn-home-block-info-metr">kg</span>
                        </div>
                    </div>
                    <div className="rn-home-block rn-home-sleep blue">
                        <span className="rn-home-block-title">Average sleep time</span>
                        <div className="rn-home-block-info">
                            <div className="rn-home-block-info-icon">
                                <i className="fas fa-bed" />
                            </div>
                            <span className="rn-home-block-info-value">9</span>
                            <span className="rn-home-block-info-metr">h</span>
                        </div>
                    </div>
                    <div className="rn-home-block rn-home-friendsactivity aqua">
                        <span className="rn-home-block-title">New connections in this month</span>
                        <div className="rn-home-block-info">
                            <div className="rn-home-block-info-icon">
                                <i className="fas fa-circle-notch" />
                            </div>
                            <span className="rn-home-block-info-value">15</span>
                            <span className="rn-home-block-info-metr">urs</span>
                        </div>
                    </div>
                </div>
                <div className="rn-home-row">
                    {
                        [
                            {
                                label: "FOOD",
                                icon: <i className="fas fa-utensils" />,
                                title: "Record meal",
                                routeButton: "Record"
                            },
                            {
                                label: "TRAINING",
                                icon: <i className="fas fa-dumbbell" />,
                                title: "Start training",
                                routeButton: "Start"
                            },
                            {
                                label: "SLEEP",
                                icon: <i className="fas fa-socks" />,
                                title: "Record sleep time",
                                routeButton: "Record"
                            }
                        ].map(({ label, icon, title, routeButton }, index) => (
                            <div
                                key={ index }
                                className={ `rn-home-block rn-home-navigation${ (label === this.state.routingLink) }` }>
                                <div className="rn-home-navigation-icon">
                                    { icon }
                                </div>
                                <h3 className="rn-home-navigation-title">{ title }</h3>
                                <button className="rn-home-navigation-move definp">{ routeButton }</button>
                            </div>
                        ))
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = () => ({});

const mapActionsToProps = {
    notifyLoaded: () => ({ type: "NOTIFY_NEW_PAGE", payload: "HOME_PAGE" })
}

export default connect(
    mapStateToProps,
    mapActionsToProps
)(Hero);