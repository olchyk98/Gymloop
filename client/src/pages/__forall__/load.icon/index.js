import React, { Component } from 'react';
import './main.css';

class Hero extends Component {
    render() {
        return(
            <div style={ this.props.style } className="gl-loadicon">
                <div />
            </div>
        );
    }
}

export default Hero;