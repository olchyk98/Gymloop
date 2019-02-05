import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './main.css';

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

    componentDidMount() {

        this.setState(() => ({
            clientX: (
                this.sliderRef.getBoundingClientRect().width / 100 *
                (this.props.value / this.props.maxValue * 100) -
                this.cursorRef.getBoundingClientRect().width / 2
            )
        }))
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
                style={ this.props.style || {} }
                className="rn-settings-insert"
                onMouseUp={ () => this.setState({ changing: false }) }
                onTouchEnd={ () => this.setState({ changing: false }) }
                onMouseMove={ this.moveSlider }
                onTouchMove={ this.moveSlider }>
                <span className="rn-settings-insert-title">{ this.props.title }</span>
                <div
                    ref={ ref => this.sliderRef = ref }
                    className="gle-cslider"                    
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

export default Slider;