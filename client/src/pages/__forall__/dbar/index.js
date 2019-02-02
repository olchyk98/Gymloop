import React, { Component } from 'react';
import './main.css';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { gql } from 'apollo-boost';

import client from '../../../apollo';
import links from '../../../links';
import { cookieControl } from '../../../utils';

class Hero extends Component {
    componentDidMount() {
        let cast = () => this.props.castAlert({
            text: "Authentication error",
            buttons: [
                {
                    icon: <i className="fas fa-door-closed" />,
                    action() {
                        cookieControl.delete("userid");
                        window.location.reload();
                    }
                }
            ],
            highOrdered: true
        });
        
        client.query({
            query: gql`
                query($targetID: ID!) {
                    user(targetID: $targetID) {
                        id
                    }
                }
            `,
            variables: {
                targetID: cookieControl.get("userid")
            }
        }).then(({ data: { user: a } }) => {
            if(!a) return cast();
        }).catch(cast);
    }

    render() {
        return(
            <div className="gl-nav">
                {
                    [
                        {
                            icon: <i className="fas fa-home" />,
                            mark: "HOME_PAGE",
                            name: "Home"
                        },
                        {
                            icon: <i className="fas fa-drumstick-bite" />,
                            mark: "FOOD_STATS_PAGE",
                            name: "Food"
                        },
                        {
                            icon: <i className="fas fa-bed"></i>,
                            mark: "SLEEP_PAGE",
                            name: "Sleep"
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

const mapActionsToProps = {
    castAlert: payload => ({ type: "CAST_GLOBAL_ERROR", payload })
}

export default connect(
    mapStateToProps,
    mapActionsToProps
)(Hero);