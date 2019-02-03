import React, { Component } from 'react';
import './main.css';

import { connect } from 'react-redux';
import { gql } from 'apollo-boost';

import client from '../../apollo';

import moonIcon from './images/moon.png';
import LoadIcon from '../__forall__/load.icon';
import HistoryItem from './HistoryItem';
import FlipMove from 'react-flip-move';

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
        else if(field === 'h2' && val < 0 && this.state.h1 < 2) val = 9;
        else if(field === 'h2' && val < 0 && this.state.h1 === 2) val = 3;
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
    render() {
        return(
            <div className="rn-sleep-add-sleeprate">
                {
                    Array(5).fill(null).map((_, index) => (
                        <SleepRateStar
                             key={ index }
                             active={ this.props.sleepRate >= index + 1 }
                             _onClick={ () => this.props._onSubmit(index + 1) }
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
            startTime: { hours: "00", minutes: "00" },
            endTime: { hours: "00", minutes: "00" },
            rate: 1
        }
    }

    submit = () => {
        const { startTime, endTime, rate } = this.state,
              a = new Date();

        if(
            startTime.hours === "00" &&
            startTime.minutes === "00" &&
            endTime.hours === "00" &&
            endTime.minutes === "00"
        ) return;

        let b = 0,
            c = 0;

        b = (new Date(
            a.getDate() + '.' +
            (a.getMonth() + 1) + '.' +
            a.getFullYear() + ' ' +
            startTime.hours + ':' + startTime.minutes
        )).toLocaleString();


        c = (new Date(
            a.getDate() + '.' +
            (a.getMonth() + 1) + '.' +
            a.getFullYear() + ' ' +
            endTime.hours + ':' + endTime.minutes
        )).toLocaleString();

        this.props._onSubmit(b, c, rate);
    }

    render() {
        return(
            <section className="rn-sleep-add" onScroll={ this.props._onScroll }>
                {/* icon */}
                <img className="rn-sleep-add-icon" alt="moon icon" src={ moonIcon } />
                {/* title */}
                <h2 className="rn-sleep-add-title">Let's record your sleep</h2>
                {/* start time small title */}
                <span className="rn-sleep-add-optiondesc">
                    When did you go to bed?
                </span>
                {/* start timer */}
                <Timer
                    _onSubmit={ startTime => this.setState({ startTime }) }
                />
                {/* end time small title */}
                <span className="rn-sleep-add-optiondesc">
                    When did you wake up?
                </span>
                {/* end timer */}
                <Timer
                    _onSubmit={ endTime => this.setState({ endTime }) }
                />
                {/* stars rating small title */}
                <span className="rn-sleep-add-optiondesc">
                    Rate your sleep
                </span>
                {/* stars rating */}
                <SleepRate
                    sleepRate={ this.state.rate }
                    _onSubmit={ rate => this.setState({ rate }) }
                />
                {/* submit button */}
                <button className="rn-sleep-add-submit definp" onClick={ this.submit } disabled={ this.props.recorded === false }>
                    {
                        (this.props.recorded === null) ? (
                            <>
                                <span>Record</span>
                                <span role="img" aria-label="Bed">🛏</span>
                            </>
                        ) : (this.props.recorded === true) ? (
                            <>
                                <span>Recorded</span>
                                <span role="img" aria-label="Sleep with a human">🛌</span>
                            </>
                        ) : ( // false : recording
                            <>
                                <span>Recording</span>
                                <span role="img" aria-label="Sleep">😴</span>
                            </>
                        )
                    }
                </button>
            </section>
        );
    }
}

class History extends Component {
    render() {
        return(
            <div className={ `rn-sleep-history${ (!this.props.active) ? "" : " active" }` }>
                <button className="definp rn-sleep-history-times" onClick={ this.props.onClose }>
                    <i className="fas fa-plus" />
                </button>
                <FlipMove
                    className="rn-sleep-history-list"
                    enterAnimation="elevator"
                    leaveAnimation="elevator">
                    {
                        (this.props.history) ? (
                            this.props.history.map(({ id, time, rating, sleepMinutes }) => (
                                <HistoryItem
                                    key={ id }
                                    time={ time }
                                    rating={ rating }
                                    sleepMinutes={ sleepMinutes }
                                    onDelete={ () => this.props.onDeleteItem(id) }
                                />
                            ))
                        ) : ( // even on err
                            <LoadIcon />
                        )
                    }
                </FlipMove>
            </div>
        );
    }
}

class Hero extends Component {
    constructor(props) {
        super(props);

        this.state = {
            lightTheme: true,
            addScrolled: false,
            historyOpened: false,
            sleepHistory: null,
            sleepRecorded: null
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

    recordSleep = (startTime, endTime, rating) => {
        const castError = () => this.props.castAlert({
            text: "Something went wrong"
        });

        this.setState(() => ({
            sleepRecorded: false
        }));

        client.mutate({
            mutation: gql`
                mutation($startTime: String!, $endTime: String!, $rating: Int!) {
                    recordSleep(startTime: $startTime, endTime: $endTime, rating: $rating) {
                        id,
                        time,
                        rating,
                        sleepMinutes
                    }
                }
            `,
            variables: {
                startTime,
                endTime,
                rating
            }
        }).then(({ data: { recordSleep: a } }) => {
            this.setState(() => ({
                sleepRecorded: true
            }));

            if(!a) return castError();

            if(this.state.sleepHistory) {
                this.setState(({ sleepHistory: b }) => ({
                    sleepHistory: [
                        a,
                        ...b
                    ]
                }));
            }
        }).catch((e) => {
            console.error(e);
            castError();
        });
    }

    openHistory = () => {
        const castError = () => this.props.castAlert({
            text: "Something went wrong"
        });

        this.setState(({ sleepHistory: a }) => ({
            sleepHistory: a || false,
            historyOpened: true,
            sleepRecorded: null
        }));

        client.query({
            query: gql`
                query {
                    user {
                        id,
                        sleeps {
                            id,
                            time,
                            rating,
                            sleepMinutes
                        }
                    }
                }
            `
        }).then(({ data: { user: a } }) => {
            if(!a) return castError();

            this.setState(() => ({
                sleepHistory: a.sleeps
            }));
        }).catch((e) => {
            console.error(e);
            castError();
        });
    }

    deleteHistoryItem = id => {
        if(!this.state.sleepHistory) return;

        {
            const a = Array.from(this.state.sleepHistory);
            a.splice(a.findIndex(io => io.id === id), 1);
            this.setState(() => ({
                sleepHistory: a
            }));
        }

        const castError = () => this.props.castAlert({
            text: "Something went wrong"
        });

        client.mutate({
            mutation: gql`
                mutation($targetID: ID!) {
                    deleteSleep(targetID: $targetID)
                }
            `,
            variables: {
                targetID: id
            }
        }).then(({ data: { deleteSleep: b } }) => {
            if(!b) return castError();
        }).catch((e) => {
            console.error(e);
            castError();
        });
    }

    render() {
        return(
            <div className={ `rn rn_nav rn-sleep${ (this.state.lightTheme) ? "" : " dark" }` }>
                <Add
                    _onScroll={({ target: { scrollTop } }) => {
                        this.setState(() => ({
                            addScrolled: scrollTop > 0
                        }));
                    }}
                    _onSubmit={ this.recordSleep }
                    recorded={ this.state.sleepRecorded }
                />
                <History
                    active={ this.state.historyOpened }
                    onClose={ () => this.setState({ historyOpened: false }) }
                    history={ this.state.sleepHistory }
                    onDeleteItem={ this.deleteHistoryItem }
                />
                {/* absolute bottom slide button >> div :: history (header: mid time, body: history) */}
                <button
                    className={ `rn-sleep-history_shortcut definp${ (!this.state.addScrolled && !this.state.historyOpened) ? "" : " hidden" }` }
                    onClick={ this.openHistory }>
                    <i className="fas fa-history" />
                </button>
            </div>
        );
    }
}

const mapStateToProps = () => ({});

const mapActionsToProps = {
    notifyLoaded: () => ({ type: "NOTIFY_NEW_PAGE", payload: "SLEEP_PAGE" }),
    castAlert: payload => ({ type: "CAST_GLOBAL_ERROR", payload })
}

export default connect(
    mapStateToProps,
    mapActionsToProps
)(Hero);