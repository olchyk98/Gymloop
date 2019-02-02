import React, { Component } from 'react';
import './main.css';

import { connect } from 'react-redux';
import { gql } from 'apollo-boost';
import { AreaChart } from 'react-easy-chart';

import client from '../../apollo';
import links from '../../links';
import placeholderGIF from '../__forall__/placeholder.gif';

const Placeholder = ({ _style }) => (
    <div style={ _style } className="rn-home-placeholdermm">
        <img src={ placeholderGIF } alt="placeholder" />
    </div>
);

class Hero extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activityGraph_ww: null,
            routingLink: "",
            userData: false
        }
    }

    componentDidMount() {
        this.props.notifyLoaded();
        this.loadData();
    }

    loadData = () => {
        const onError = {
            text: "Something is wrong",
            buttons: []
        }

        client.query({
            query: gql`
                query {
                    user {
                        id,
                        mainActivity,
                        appActivityMonthGraph,
                        monthCalories,
                        weight,
                        avgSleepTime,
                        connectionsInt
                    }
                }
            `
        }).then(({ data: { user: a } }) => {
            if(!a) {
                this.props.castAlert(onError);
                return console.error("Looks like it's an auth problem.");
            }

            // Activity
            a.mainActivity = (
                {
                    "RUN_ACTIVITY": "Run"
                }[a.mainActivity] || "?"
            );

            // Actions Graph
            a.actionsMonthGraph = a.appActivityMonthGraph.map((io, ia) => ({
                x: ia * 10,
                y: io
            }));

            // Weight
            a.weight = a.weight || "?";

            // Submit
            this.setState(() => ({
                userData: a
            }));
        }).catch(err => {
            console.error(err);
            this.props.castAlert(onError);
        });
    }

    getMonthDate = () => { // OUTPUT: February 2019
        const a = new Date(),
              b = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ][a.getMonth()],
              c = a.getFullYear();

        return b + " " + c;
    }

    render() {
        return(
            <div className="rn rn_nav rn-home">
                <div className="rn-home-row">
                    <div className="rn-home-block rn-home-mainact">
                        <div className="rn-home-mainact-title">
                            <span>Your main activity is</span>
                            <button className="definp">
                                <i className="fas fa-cog" />
                            </button>
                        </div>
                        {
                            (this.state.userData !== false) ? (
                                <h2 className="rn-home-mainact-activity">{ this.state.userData.mainActivity }</h2>
                            ) : (
                                <Placeholder />
                            )
                        }
                        {
                            (!this.state.userData || this.state.userData.mainActivity !== "?") ? (
                                <div className="rn-home-mainact-connections">
                                    <div className="rn-home-mainact-connections-icon">
                                        <i className="fas fa-running" />
                                    </div>
                                    <span className="rn-home-mainact-connections-text">
                                        {
                                            (this.state.userData !== false) ? (
                                                <strong>0</strong>
                                            ) : (
                                                <Placeholder
                                                    _style={{
                                                        height: "25px",
                                                        width: "25px"
                                                    }}
                                                />
                                            )
                                        }
                                        connections have the same main activity
                                    </span>
                                </div>
                            ) : null
                        }
                    </div>
                    <div className="rn-home-block rn-home-activitygraph" ref={ref => {
                        if(!ref) return;

                        if(!this.state.activityGraph_ww) {
                            this.setState(() => ({
                                activityGraph_ww: (
                                    ref.getBoundingClientRect().width -
                                    parseInt(getComputedStyle(ref).padding) * 2
                                )
                            }));
                        }
                    }}>
                        <div className="rn-home-activitygraph-header">
                            <span className="rn-home-activitygraph-header-title">Month activity</span>
                            <span className="rn-home-activitygraph-header-month">{ this.getMonthDate() }</span>
                        </div>
                        {
                            (this.state.userData !== false) ? (
                                <AreaChart
                                    // dataPoints
                                    areaColors={ ['blue'] }
                                    interpolate="cardinal"
                                    width={ this.state.activityGraph_ww || 0 }
                                    height={ 100 }
                                    data={[ this.state.userData.actionsMonthGraph ]}
                                />
                            ) : (
                                <Placeholder
                                    _style={{
                                        height: "100px",
                                        width: "100%"
                                    }}
                                />
                            )
                        }
                    </div>
                </div>
                <div className="rn-home-row">
                    <div className="rn-home-block rn-home-calories orange">
                        <span className="rn-home-block-title">Destroyed calories this month</span>
                        <div className="rn-home-block-info">
                            <div className="rn-home-block-info-icon">
                                <i className="fas fa-fire" />
                            </div>
                            {
                                (this.state.userData !== false) ? (
                                    <span className="rn-home-block-info-value">{ this.state.userData.monthCalories }</span>
                                ) : (
                                    <Placeholder
                                        _style={{
                                            height: "50px",
                                            width: "55px"
                                        }}
                                    />
                                )
                            }
                            <span className="rn-home-block-info-metr">cal</span>
                        </div>
                    </div>
                    <div className="rn-home-block rn-home-weight red">
                        <div className="rn-home-block-title rn-home-weight-title">
                            <span>Your current weight</span>
                            <button className="definp">
                                <i className="fas fa-cog" />
                            </button>
                        </div>
                        <div className="rn-home-block-info">
                            <div className="rn-home-block-info-icon">
                                <i className="fas fa-weight-hanging" />
                            </div>
                            {
                                (this.state.userData !== false) ? (
                                    <span className="rn-home-block-info-value">{ this.state.userData.weight }</span>
                                ) : (
                                    <Placeholder
                                        _style={{
                                            height: "55px",
                                            width: "55px"
                                        }}
                                    />
                                )
                            }
                            <span className="rn-home-block-info-metr">kg</span>
                        </div>
                    </div>
                    <div className="rn-home-block rn-home-sleep blue">
                        <span className="rn-home-block-title">Average sleep time</span>
                        <div className="rn-home-block-info">
                            <div className="rn-home-block-info-icon">
                                <i className="fas fa-bed" />
                            </div>
                            {
                                (this.state.userData !== false) ? (
                                    <span className="rn-home-block-info-value">{ this.state.userData.avgSleepTime }</span>
                                ) : (
                                    <Placeholder
                                        _style={{
                                            height: "55px",
                                            width: "55px"
                                        }}
                                    />
                                )
                            }
                            <span className="rn-home-block-info-metr">h</span>
                        </div>
                    </div>
                    <div className="rn-home-block rn-home-friendsactivity aqua">
                        <span className="rn-home-block-title">Your connections</span>
                        <div className="rn-home-block-info">
                            <div className="rn-home-block-info-icon">
                                <i className="fas fa-circle-notch" />
                            </div>
                            {
                                (this.state.userData !== false) ? (
                                    <span className="rn-home-block-info-value">{ this.state.userData.connectionsInt }</span>
                                ) : (
                                    <Placeholder
                                        _style={{
                                            height: "55px",
                                            width: "55px"
                                        }}
                                    />
                                )
                            }
                            <span className="rn-home-block-info-metr">urs</span>
                        </div>
                    </div>
                </div>
                <div className="rn-home-row">
                    {
                        [
                            {
                                icon: <i className="fas fa-utensils" />,
                                title: "Record meal",
                                routeButton: "Record",
                                action: () => {
                                    this.props.history.push(`${ links["FOOD_STATS_PAGE"].absolute }/record`);
                                }
                            },
                            {
                                icon: <i className="fas fa-dumbbell" />,
                                title: "Start training",
                                routeButton: "Start",
                                action: () => {
                                    // this.props.history.push(links["HOME_PAGE"].absolute);
                                }
                            },
                            {
                                icon: <i className="fas fa-socks" />,
                                title: "Record sleep time",
                                routeButton: "Record",
                                action: () => {
                                    // this.props.history.push(links["HOME_PAGE"].absolute);
                                }
                            }
                        ].map(({ icon, title, routeButton, action }, index) => (
                            <div
                                key={ index }
                                className="rn-home-block rn-home-navigation">
                                <div className="rn-home-navigation-icon">
                                    { icon }
                                </div>
                                <h3 className="rn-home-navigation-title">{ title }</h3>
                                <button className="rn-home-navigation-move definp" onClick={ action }>{ routeButton }</button>
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
    notifyLoaded: () => ({ type: "NOTIFY_NEW_PAGE", payload: "HOME_PAGE" }),
    castAlert: payload => ({ type: "CAST_GLOBAL_ERROR", payload })
}

export default connect(
    mapStateToProps,
    mapActionsToProps
)(Hero);