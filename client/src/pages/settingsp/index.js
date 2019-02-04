import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './main.css';

import { connect } from 'react-redux';
import { gql } from 'apollo-boost';

import client from  '../../apollo';
import LoadIcon from '../__forall__/load.icon';

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

class Slider extends Component {
    constructor(props) {
        super(props);

        this.state = {
            clientX: 0,
            changing: false
        }

        this.sliderRef = React.createRef();
        this.cursorRef = React.createRef();
    }

    moveSlider = (_) => { // { clientX }
        if(!this.state.changing || this.props._disabled) return;

        const clientX = _.clientX || _.changedTouches[0].pageX; // Mouse or touch

        const a = this.sliderRef.getBoundingClientRect(),
              b = this.cursorRef.getBoundingClientRect().width,
              c = (
                clientX - a.left -
                this.cursorRef.getBoundingClientRect().width / 2
            );

        if(c < 0 || clientX + b / 2 > a.left + a.width) return;

        const d = 100 / ((a.width - b) / c);

        const e = Math.round(this.props.maxValue / 100 * d);

        this.setState(() => ({
            clientX: c
        }), () => this.props._onChange(e));
    }

    render() {
        return(
            <div
                className="rn-settings-insert"
                onMouseUp={ () => this.setState({ changing: false }) }
                onTouchEnd={ () => this.setState({ changing: false }) }
                onMouseMove={ this.moveSlider }
                onTouchMove={ this.moveSlider }>
                <span className="rn-settings-insert-title">{ this.props.title }</span>
                <div
                    ref={ ref => this.sliderRef = ref }
                    className="rn-settings-cslider"                    
                    tabIndex="-1">
                    <div
                        style={{
                            left: this.state.clientX + "px"
                        }}
                        onMouseDown={ () => this.setState({ changing: true }) }
                        onTouchStart={ () => this.setState({ changing: true }) }
                        ref={ ref => this.cursorRef = ref }>
                        <span>{ this.props.value }</span>
                    </div>
                </div>
            </div>
        );
    }
}

Slider.propTypes = {
    maxValue: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    _onChange: PropTypes.func.isRequired
}

class ActivityFieldItem extends Component {
    render() {
        return(
            <div
                className={ `rn-settings-activityfield-grid-item${ (!this.props.active) ? "" : " active" }` }
                onClick={ () => this.props.onChoose(this.props.label) }>
                <div className="rn-settings-activityfield-grid-item-icon">
                    <div>
                        { this.props.icon }
                    </div>
                </div>
                <span className="rn-settings-activityfield-grid-item-title">{ this.props.title }</span>
            </div>
        );
    }
}

class ActivityField extends Component {
    constructor(props) {
        super(props);

        this.defArc = [
            {
                icon: <i className="fas fa-running" />,
                title: "running",
                label: "RUNNING_LABEL"
            },
            {
                icon: <i className="fas fa-walking" />,
                title: "walking",
                label: "WALKING_LABEL"
            },
            {
                icon: <i className="fas fa-skiing" />,
                title: "skiing",
                label: "SKIING_LABEL"
            },
            {
                icon: <i className="fas fa-swimmer" />,
                title: "swimming",
                label: "SWIMMING_LABEL"
            },
            {
                icon: <i className="fas fa-skiing-nordic" />,
                title: "Nordic Skiing",
                label: "NORDIC_SKIING"
            },
            {
                icon: <i className="fas fa-table-tennis" />,
                title: "Tennis",
                label: "TENNIS_LABEL"
            },
            {
                icon: <i className="fas fa-fish" />,
                title: "Fish",
                label: "FISH_LABEL"
            },
            {
                icon: <i className="fas fa-dumbbell" />,
                title: "Gym",
                label: "GYM_LABEL"
            }
        ];
    }

    render() {
        return(
            <div className="rn-settings-insert rn-settings-activityfield_container">
                <span className="rn-settings-insert-title">Main Activity</span>
                <div className="rn-settings-activityfield">
                    <div className="rn-settings-activityfield-grid">
                        {
                            this.defArc.map(({ icon, title, label }, index) => (
                                <ActivityFieldItem
                                    key={ index }
                                    icon={ icon }
                                    title={ title }
                                    label={ label }
                                    active={ this.props.currentActivity === label }
                                    onChoose={ this.props.selectActivity }
                                />       
                            ))
                        }
                    </div>
                    <div className="rn-settings-activityfield-display">
                        {
                            (this.props.currentActivity) ? (
                                    <span>{ this.defArc.find(io => io.label === this.props.currentActivity).title }</span>
                            ) : null
                        }
                    </div>
                </div>
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
                        mainActivity
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
                    login: a.login || "",
                    email: a.email || "",
                    mainActivity: a.mainActivity || ""
                }
            }));
        }).catch((e) => {
            console.error(e);
            castError("Connection interrupted")
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

        const { age, weight, height, login, email, mainActivity } = this.state.settings;
        
        client.mutate({
            mutation: gql`
                mutation($age: Int!, $weight: Int!, $height: Int!, $login: String!, $email: String!, $mainActivity: String!) {
                    settingAccount(age: $age, weight: $weight, height: $height, login: $login, email: $email, mainActivity: $mainActivity) {
                        id
                    }
                }
            `,
            variables: {
                age, weight,
                height, login,
                email, mainActivity
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
                    {/* <Slider
                        value={ this.state.settings.age }
                        _onChange={ value => this.setSettingsVal("age", value) }
                    /> */}
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