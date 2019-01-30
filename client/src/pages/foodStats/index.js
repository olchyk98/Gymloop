import React, { Component } from 'react';
import './main.css';

import { connect } from 'react-redux';

class Header extends Component {
    render() {
        return(
            <header className="rn-foodstats-header">
                {/* icon */}
                {/* food */}
                {/* progress */}
                {/* curr/next */}
                {/* record button */}
                {/* days slider explorer */}
            </header>
        );
    }
}

class MealsListItem extends Component {
    render() {
        return(
            <div className="rn-foodstats-meallist-item_container">
                <div className="rn-foodstats-meallist-item">
                    <span className="rn-foodstats-meallist-item-title">Pizza Pasta</span>
                    <div className="rn-foodstats-meallist-item-info">
                        <span>13:21 AM</span>
                        <span>•</span>
                        <span>231 calories</span>
                    </div>
                </div>
            </div>
        );
    }
}

class MealsList extends Component {
    render() {
        return(
            <section className="rn-foodstats-meallist">
                <MealsListItem />
            </section>
        );
    }
}

class Hero extends Component {
    componentDidMount() {
        this.props.notifyLoaded();
    }

    render() {
        return(
            <div className="rn rn_nav rn-foodstats">
                <Header />
                <MealsList />
            </div>
        );
    }
}

const mapStateToProps = () => ({});

const mapActionsToProps = {
    notifyLoaded: () => ({ type: "NOTIFY_NEW_PAGE", payload: "FOOD_STATS_PAGE" })
}

export default connect(
    mapStateToProps,
    mapActionsToProps
)(Hero);