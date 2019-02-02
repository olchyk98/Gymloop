import React, { Component } from 'react';
import './main.css';

import { connect } from 'react-redux';

import moonIcon from './images/moon.png';

class TimerNumber extends Component {
    render() {
        return(
            <div className="rn-sleep-add-timer-number">
                <button
                    className="rn-sleep-add-timer-number-arrow up definp"
                    onClick={ () => this.props.onUpdate(this.props.value + 1) }>
                    <i className="fas fa-caret-up" />
                </button>
                <span className="rn-sleep-add-timer-number-mat">{ this.props.value }</span>
                <button
                    className="rn-sleep-add-timer-number-arrow down definp"
                    onClick={ () => this.props.onUpdate(this.props.value - 1) }>
                <i className="fas fa-caret-down" />
                </button>
            </div>
        );
    }
}

class Timer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            h1: 0,
            h2: 0,
            m1: 0,
            m2: 0
        }
    }

    updateVal = (val, field) => {
        if(
            (field === 'h1' && val > 2) ||
            (field === 'h2' && val > 9) ||
            (
                this.state.h1 === 2 &&
                field === 'h2' && val > 3
            ) ||
            (field === 'm1' && val > 5) ||
            (field === 'm2' && val > 9)
        ) val = 0;

        else if(field === 'h1' && val < 0) val = 2;
        else if(field === 'h2' && val < 0) val = 9;
        else if(field === 'm1' && val < 0) val = 5;
        else if(field === 'm2' && val < 0) val = 9;

        if(field === 'h1' && val === 2 && this.state.h2 > 3) {
            this.setState(() => ({
                h2: 0
            }));
        }

        this.setState(() => ({
            [field]: val
        }));
    }

    submit = () => {
        let { h1, h2, m1, m2 } = this.state;
        const a = a => a.toString();

        this.props._onSubmit({
            hours: a(h1) + a(h2),
            minutes: a(m1) + a(m2)
        });
    }

    render() {
        return(
            <div
                className="rn-sleep-add-timer"
                tabIndex="-1"
                onBlur={ this.submit }>
                    <TimerNumber
                        value={ this.state.h1 }
                        onUpdate={ val => this.updateVal(val, 'h1') }
                    />
                    <TimerNumber
                        value={ this.state.h2 }
                        onUpdate={ val => this.updateVal(val, 'h2') }
                    />
                    <span>:</span>
                    <TimerNumber
                        value={ this.state.m1 }
                        onUpdate={ val => this.updateVal(val, 'm1') }
                    />
                    <TimerNumber
                        value={ this.state.m2 }
                        onUpdate={ val => this.updateVal(val, 'm2') }
                    />
                </div>
        );
    }
}

class SleepRateStar extends Component {
    render() {
        // true: Star
        // false: Circle

        return(
            <button
                className={ `definp rn-sleep-add-sleeprate-item${ (!this.props.active) ? "" : " active" }` }
                onClick={ this.props._onClick }>
                <div className="icon"><i className="fas fa-star" /></div>
                <div className="empty" />
            </button>
        );
    }
}

class SleepRate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sleepRate: 1
        }
    }

    render() {
        return(
            <div className="rn-sleep-add-sleeprate">
                {
                    Array(5).fill(null).map((session, index) => (
                        <SleepRateStar
                             key={ index }
                             active={ this.state.sleepRate >= index + 1 }
                             _onClick={ () => this.setState({ sleepRate: index + 1 }) }
                         />
                    ))
                }
            </div>
        );
    }
}

class Add extends Component {
    constructor(props) {
        super(props);

        this.state = {
            time: { hours: "00", minutes: "00" }
        }
    }

    render() {
        return(
            <section className="rn-sleep-add">
                {/* icon */}
                <img className="rn-sleep-add-icon" alt="moon icon" src={ moonIcon } />
                {/* title */}
                <h2 className="rn-sleep-add-title">Ok. Let's record your sleep</h2>
                {/* start time small title */}
                <span className="rn-sleep-add-optiondesc">
                    When did you go to bed?
                </span>
                {/* start timer */}
                <Timer
                    _onSubmit={ time => this.setState({ time }) }
                />
                {/* end time small title */}
                <span className="rn-sleep-add-optiondesc">
                    When did you wake up?
                </span>
                {/* end timer */}
                <Timer
                    _onSubmit={ time => this.setState({ time }) }
                />
                {/* stars rating small title */}
                <span className="rn-sleep-add-optiondesc">
                    Rate your sleep
                </span>
                {/* stars rating */}
                <SleepRate />
                {/* submit button */}
                <button className="rn-sleep-add-submit definp">
                    <span>Record</span>
                    <span role="img" aria-label="Sleep">😴</span>
                </button>
            </section>
        );
    }
}

class Hero extends Component {
    constructor(props) {
        super(props);

        this.state = {
            lightTheme: true
        }
    }
    
    componentDidMount() {
        this.props.notifyLoaded();

        { // Set theme
            const a = (new Date()).getHours();

            this.setState(() => ({
                lightTheme: a > 7 && a < 18
            }));
        }
    }

    render() {
        return(
            <div className={ `rn rn_nav rn-sleep${ (this.state.lightTheme) ? "" : " dark" }` }>
                <Add />
                {/* absolute bottom slide button >> div :: history (header: mid time, body: history) */}
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