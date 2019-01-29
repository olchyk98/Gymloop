import React, { Component } from 'react';
import './main.css';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import links from '../../../links';

class Hero extends Component {
    render() {
        return(
            <div className="gl-nav">
                {
                    [
                        {
                            icon: <i className="fas fa-home" />,
                            mark: "HOME_PAGE",
                            name: "Home"
                        }
                    ].map(({ icon, mark, name }, index) => (
                        <Link
                            to={ links[mark].absolute }
                            className={ `definp gl-nav-btn${ (mark !== this.props.currentPage) ? "" : " active" }` }
                            key={ index }>
                            { icon }
                            <span>{ name }</span>
                        </Link>
                    ))
                }
            </div>
        );
    }
}

const mapStateToProps = ({ session: { currentPage } }) => ({
    currentPage
});

export default connect(
    mapStateToProps
)(Hero);