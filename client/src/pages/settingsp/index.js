import React, { Component } from 'react';
import './main.css';

import { connect } from 'react-redux';
import { gql } from 'apollo-boost';

import client from  '../../apollo';
import LoadIcon from '../__forall__/load.icon';
import Slider from '../__forall__/slider'; 
import ActivityField from '../__forall__/activity.field';

class TxtField extends Component {
    render() {
        return(
            <div className="rn-settings-insert">
                <span className="rn-settings-insert-title">{ this.props.title }</span>
                <input
                    className="rn-settings-txtfield definp"
                    placeholder={ this.props._placeholder }
                    type={ this.props._type }
                    required={ this.props._required }
                    defaultValue={ this.props._defaultValue }
                    disabled={ this.props._disabled }
                />
            </div>
        );
    }
}

// login, password, email, mainActivity, weight, height, age
class Hero extends Component {
    constructor(props) {
        super(props);

        this.state = {
            apiLoaded: false,
            submittingSettings: false,
            settings: {
                age: 0,
                weight: 0,
                height: 0,
                caloriesPerDay: 0,
                login: "",
                password: "",
                email: "",
                mainActivity: ""
            }
        }
    }

    componentDidMount() {
        this.props.notifyLoaded();
        this.loadAPI();
    }

    loadAPI = () => {
        const castError = a => this.props.castAlert({ text: a });

        this.setState(() => ({
            apiLoaded: false
        }));

        client.query({
            query: gql`
                query {
                    user {
                        id,
                        age,
                        weight,
                        height,
                        login,
                        email,
                        mainActivity,
                        caloriesPerDay
                    }
                } 
            `
        }).then(({ data: { user: a } }) => {
            if(!a) return castError("Internal server error");

            this.setState(() => ({
                apiLoaded: true,
                settings: {
                    age: a.age || 0,
                    weight: a.weight || 0,
                    height: a.height || 0,
                    caloriesPerDay: a.caloriesPerDay || 0,
                    login: a.login || "",
                    email: a.email || "",
                    mainActivity: a.mainActivity || ""
                }
            }));
        }).catch((e) => {
            console.error(e);
            castError("Connection interrupted");
        });;
    }

    setSettingsVal = (field, val) => this.setState(({ settings: a }) => ({
        settings: {
            ...a,
            [field]: val 
        }
    }));

    submitSettings = () => {
        if(this.state.submittingSettings) return;

        this.setState(() => ({
            submittingSettings: true
        }));
        
        const castError = a => this.props.castAlert({ text: a });

        const { age, weight, height, login, email, mainActivity, caloriesPerDay } = this.state.settings;
        
        client.mutate({
            mutation: gql`
                mutation(
                    $age: Int!
                    $weight: Int!
                    $height: Int!
                    $login: String!
                    $email: String!
                    $mainActivity: String!
                    $caloriesPerDay: Int!
                ) {
                    settingAccount(
                      age: $age
                      weight: $weight
                      height: $height
                      login: $login
                      email: $email
                      mainActivity: $mainActivity
                      caloriesPerDay: $caloriesPerDay
                    ) {
                      id
                    }
                }
            `,
            variables: {
                age, weight,
                height, login,
                email, mainActivity,
                caloriesPerDay
            }
        }).then(({ data: { settingAccount: a } }) => {
            if(!a) return castError("Internal server error");

            this.setState(() => ({
                submittingSettings: false
            }));
        }).catch((e) => {
            console.error(e);
            castError("Connection interrupted");
        });
    }

    render() {
        if(this.state.apiLoaded) {
            return(
                <form className="rn rn_nav rn-settings" onSubmit={ e => { e.preventDefault(); this.submitSettings() } }>
                    <h1 className="rn-settings-title">Your settings</h1>
                    <div className="rn-settings-row">
                        <div className="rn-settings-container">
                            <Slider
                                value={ this.state.settings.height }
                                maxValue={ 500 }
                                title="Height (centimeters)"
                                _onChange={ value => this.setSettingsVal("height", value) }
                                _disabled={ this.state.submittingSettings }
                            />
                            <TxtField
                                title="Login"
                                _type="text"
                                _placeholder="E.g. roboto_32"
                                _required={ true }
                                _defaultValue={ this.state.settings.login }
                                _disabled={ this.state.submittingSettings }
                            />
                            <TxtField
                                title="Password"
                                _type="password"
                                _placeholder="E.g. ************"
                                _required={ false }
                                _defaultValue={ this.state.settings.password }
                                _disabled={ this.state.submittingSettings }
                            />
                        </div>
                        <div className="rn-settings-container">
                            <Slider
                                value={ this.state.settings.weight }
                                maxValue={ 500 }
                                title="Weight (kg)"
                                _onChange={ value => this.setSettingsVal("weight", value) }
                                _disabled={ this.state.submittingSettings }
                            />
                            <Slider
                                value={ this.state.settings.age }
                                maxValue={ 200 }
                                title="Age"
                                _onChange={ value => this.setSettingsVal("age", value) }
                                _disabled={ this.state.submittingSettings }
                            />
                            <Slider
                                value={ this.state.settings.caloriesPerDay }
                                maxValue={ 20000 }
                                title="Calories per day"
                                _onChange={ value => this.setSettingsVal("caloriesPerDay", value) }
                                _disabled={ this.state.submittingSettings }
                            />
                            <TxtField
                                title="Email"
                                _type="email"
                                _placeholder="E.g. starcars@mymail.net"
                                _required={ false }
                                _defaultValue={ this.state.settings.email }
                                _disabled={ this.state.submittingSettings }
                            />
                        </div>
                        <ActivityField
                            currentActivity={ this.state.settings.mainActivity }
                            selectActivity={ label => this.setSettingsVal("mainActivity", label) }
                        />
                    </div>
                    <button type="submit" className={ `definp rn-settings-submit${ (!this.state.submittingSettings) ? "" : " submitting" }` }>
                        {
                            (!this.state.submittingSettings) ? (
                                <span>Submit</span>
                            ) : (
                                <LoadIcon />
                            )
                        }
                    </button>
                </form>
            );
        } else {
            return(
                <div className="rn rn_nav rn-settings">
                    <LoadIcon />
                </div>
            );
        }
    }
}

const mapStateToProps = () => ({});

const mapActionsToProps = {
    notifyLoaded: () => ({ type: "NOTIFY_NEW_PAGE", payload: "SETTINGS_PAGE" }),
    castAlert: payload => ({ type: "CAST_GLOBAL_ERROR", payload })
}

export default connect(
    mapStateToProps,
    mapActionsToProps
)(Hero);