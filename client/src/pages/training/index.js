import React, { Component, Fragment } from 'react';
import './main.css';

import { connect } from 'react-redux';

import Slider from '../__forall__/slider';
import ActivityField from '../__forall__/activity.field';

const image = "https://yt3.ggpht.com/a-/AAuE7mBI2D0yaaqOGm13D9XuVRv2zFmej83jOrt9cg=s48-mo-c-c0xffffffff-rj-k-no";

class PeopleFieldItem extends Component {
    render() {
        return(
            <div className="rn-training-peoplefield-search-users-item">
                <div className="rn-training-peoplefield-search-users-item-avatar">
                    <img src={ image } alt="user avatar" />
                </div>
                <span className="rn-training-peoplefield-search-users-item-name">Oles Odynets</span>
            </div>
        );
    }
}

class PeopleField extends Component {
    constructor(props) {
        super(props);

        this.state = {
            opened: false
        }
    }

    render() {
        return(
            <Fragment>
                <div className={ `rn-training-peoplefield_outbg${ (!this.state.opened) ? "" : " active" }` }
                    onClick={ () => this.setState({ opened: false }) }
                />
                <div className="rn-training-peoplefield">
                    <span className="rn-training-peoplefield-countd" onClick={ () => this.setState({ opened: true }) }>0 people invited</span>
                    <div className={ `rn-training-peoplefield-search${ (!this.state.opened) ? "" : " opened" }` }>
                        <input className="rn-training-peoplefield-search-mat definp"
                            type="search"
                            placeholder="Search people..."
                        />
                        <span className="rn-training-peoplefield-search-ustit">Search results</span>
                        <div className="rn-training-peoplefield-search-users">
                            <PeopleFieldItem />
                            <PeopleFieldItem />
                            <PeopleFieldItem />
                            <PeopleFieldItem />
                            <PeopleFieldItem />
                            <PeopleFieldItem />
                            <PeopleFieldItem />
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

class Hero extends Component {
    constructor(props) {
        super(props);

        this.state = {
            calories: 0,
            minutes: 0,
            action: "",
            people: [],
            creatingItem: false
        }
    }

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
                    <h2 className="rn-training-create-title">New training</h2>
                    <div className="rn-training-create-container">
                        <Slider
                            value={ this.state.calories }
                            maxValue={ 24000 }
                            title="Burned calories"
                            _onChange={ value => this.setState({ calories: value }) }
                            _disabled={ this.state.creatingItem }
                        />
                        <Slider
                            value={ this.state.minutes }
                            maxValue={ 720 }
                            title="Minutes"
                            _onChange={ value => this.setState({ minutes: value }) }
                            _disabled={ this.state.creatingItem }
                        />
                        <ActivityField
                            currentActivity={ this.state.action }
                            selectActivity={ label => this.setState({ action: label }) }
                        />
                        <PeopleField

                        />
                    </div>
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