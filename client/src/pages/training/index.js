import React, { Component, Fragment } from 'react';
import './main.css';

import { connect } from 'react-redux';
import { gql } from 'apollo-boost';

import client from '../../apollo';
import api from '../../api';
import LoadIcon from '../__forall__/load.icon';
import Slider from '../__forall__/slider';
import ActivityField from '../__forall__/activity.field';

const inviteSuggLimit = 15;

class PeopleFieldItem extends Component {
    render() {
        return(
            <div className={ `rn-training-peoplefield-search-users-item${ (!this.props.selected) ? "" : " selected" }` } onClick={ this.props._onClick }>
                <div className="rn-training-peoplefield-search-users-item-avatar">
                    <img src={ api.storage + this.props.image } alt="user avatar" />
                </div>
                <span className="rn-training-peoplefield-search-users-item-name">{ this.props.name }</span>
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
                    <span className="rn-training-peoplefield-countd" onClick={() => {
                        this.setState({ opened: true });
                        this.props.onOpen();
                    }}>{ this.props.invitedPeople } people invited</span>
                    <div className={ `rn-training-peoplefield-search${ (!this.state.opened) ? "" : " opened" }` }>
                        <input className="rn-training-peoplefield-search-mat definp"
                            type="search"
                            placeholder="Search people..."
                        />
                        <span className="rn-training-peoplefield-search-ustit">Search results</span>
                        <div className="rn-training-peoplefield-search-users">
                            {
                                (!this.props.suggestions) ? (
                                    <LoadIcon />
                                ) : (
                                    this.props.users.map(({ id, avatar, name }) => (
                                        <PeopleFieldItem
                                            key={ id }
                                            avatar={ avatar }
                                            name={ name }
                                            _onClick={ () => this.props.onTogglePeople(id) }
                                        />
                                    ))
                                )
                            }
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
            creatingItem: false,
            peopleSuggestions: null
        }
    }

    componentDidMount() {
        this.props.notifyLoaded();
    }

    loadPeopleSugg = (name = null) => {
        const castError = () => this.props.castAlert({
            text: "Something went wrong"
        });

        let offsetID = this.state.people.slice(-1);
        offsetID = (offsetID && offsetID[0]) || null;

        client.query({
            query: gql`
                query($offsetID: ID, $name: String, $limit: Int) {
                    getTrainingPeopleSuggestions(offsetID: $offsetID, name: $name, limit: $limit) {
                        id,
                        avatar,
                        login
                    }
                }
            `,
            variables: {
                offsetID,
                name,
                limit: inviteSuggLimit
            }
        }).then(({ data: { getTrainingPeopleSuggestions: a } }) => {
            if(!a) return castError();
            
            this.setState(() => ({
                peopleSuggestions: a
            }));
        }).catch((e) => {
            console.error(e);
            castError();
        });
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
                            onOpen={() => {
                                if(!this.state.peopleSuggestions) {
                                    this.setState(() => ({
                                        peopleSuggestions: true
                                    }));
                                    this.loadPeopleSugg();
                                }
                            }}
                            invitedPeople={ this.state.people.length }
                            onTogglePeople={(id) => {
                                let a = Array.from(this.state.people);
                                if(!a.includes(id)) a.push(id);
                                else a.splice(a.findIndex(io => io === id), 1);
                                this.setState(() => ({
                                    people: a
                                }));
                            }}
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