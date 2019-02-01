import React, { Component } from 'react';
import './main.css';

import { connect } from 'react-redux';

class Hero extends Component {
    constructor(props) {
        super(props);

        // NOTE: Can use only props, but out-animation with empty text looks very "shity".
        this.state = {
            text: "",
            buttons: "",
            active: false
        }
    }

    componentDidUpdate(a) {
        if(
            (!a.banner && this.props.banner) ||
            (
                this.props.banner &&
                a.banner.text !== this.props.banner.text
            )
        ) {
            let a = this.props.banner,
                b = {
                    active: !!a
                }

            if(a) {
                b = {
                    ...b,
                    text: a.text,
                    buttons: a.buttons
                }
            }

            this.setState(b);
        }
    }

    render() {
        return(
            <div className={ `gl-global_error${ (!this.state.active) ? "" : " active" }` }>
                <span className="gl-global_error-text">{ this.state.text }</span>
                {
                    (this.state.buttons || []).map(({ icon, action }, index) => (
                        <button key={ index } onClick={ action } className="gl-global_error-btn definp">
                            { icon }
                        </button>
                    ))
                }
                <button className="gl-global_error-btn definp" onClick={ this.props.close }>
                    <i className="fas fa-times" />
                </button>
            </div>
        );
    }
}

const mapStateToProps = ({ session }) => ({
    banner: session.globalError
});

const mapActionsToProps = {
    close: () => ({ type: "CAST_GLOBAL_ERROR", payload: null })
}

export default connect(
    mapStateToProps,
    mapActionsToProps
)(Hero);