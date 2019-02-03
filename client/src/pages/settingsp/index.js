import React, { Component } from 'react';
import './main.css';

import { connect } from 'react-redux';

class TxtField extends Component {
    render() {
        return(
            <div className="rn-settings-insert">
                <span className="rn-settings-insert-title">Name</span>
                <input
                    className="rn-settings-txtfield definp"
                    placeholder="E.g. Oles Odynets"
                    type="text"
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

    moveSlider = ({ clientX }) => {
        if(!this.state.changing) return;

        const a = this.sliderRef.getBoundingClientRect(),
              b = this.cursorRef.getBoundingClientRect().width,
              c = (
                clientX - a.left -
                this.cursorRef.getBoundingClientRect().width / 2
            );

        if(c < 0 || clientX + b / 2 > a.left + a.width) return;

        const d = 100 / ((a.width - b) / c);
        
        const maxAge = 200;

        const e = Math.round(maxAge / 100 * d);

        this.setState(() => ({
            clientX: c
        }), () => this.props._onChange(e));
    }

    render() {
        return(
            <div
                className="rn-settings-insert"
                onMouseUp={ () => this.setState({ changing: false }) }
                onMouseMove={ this.moveSlider }>
                <span className="rn-settings-insert-title">Age</span>
                <div
                    ref={ ref => this.sliderRef = ref }
                    className="rn-settings-cslider"                    
                    tabIndex="-1">
                    <div
                        style={{
                            left: this.state.clientX + "px"
                        }}
                        onMouseDown={ () => this.setState({ changing: true }) }
                        ref={ ref => this.cursorRef = ref }>
                        <span>{ this.props.value }</span>
                    </div>
                </div>
            </div>
        );
    }
}

// login, password, email, mainActivity, weight, height
class Hero extends Component {
    constructor(props) {
        super(props);

        this.state = {
            settings: {
                age: 0
            }
        }
    }

    componentDidMount() {
        this.props.notifyLoaded();
    }

    setSettingsVal = (field, val) => this.setState(({ settings: a }) => ({
        settings: {
            ...a,
            [field]: val 
        }
    }));

    render() {
        return(
            <div className="rn rn_nav rn-settings">
                <h1 className="rn-settings-title">Your settings</h1>
                {/* <TxtField /> */}
                <Slider
                    value={ this.state.settings.age }
                    _onChange={ value => this.setSettingsVal("age", value) }
                />
            </div>
        );
    }
}

const mapStateToProps = () => ({});

const mapActionsToProps = {
    notifyLoaded: () => ({ type: "NOTIFY_NEW_PAGE", payload: "SETTINGS_PAGE" }),
}

export default connect(
    mapStateToProps,
    mapActionsToProps
)(Hero);