import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './main.css';

class ActivityFieldItem extends Component {
    render() {
        return(
            <div
                className={ `gle-activityfield-grid-item${ (!this.props.active) ? "" : " active" }` }
                onClick={ () => this.props.onChoose(this.props.label) }>
                <div className="gle-activityfield-grid-item-icon">
                    <div>
                        { this.props.icon }
                    </div>
                </div>
                <span className="gle-activityfield-grid-item-title">{ this.props.title }</span>
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
                title: "Running",
                label: "RUNNING_LABEL"
            },
            {
                icon: <i className="fas fa-walking" />,
                title: "Walking",
                label: "WALKING_LABEL"
            },
            {
                icon: <i className="fas fa-skiing" />,
                title: "Skiing",
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
                title: "Fishing",
                label: "FISHING_LABEL"
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
            <div className="rn-settings-insert gle-activityfield_container">
                <span className="rn-settings-insert-title">Main Activity</span>
                <div className="gle-activityfield">
                    <div className="gle-activityfield-grid">
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
                    <div className="gle-activityfield-display">
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

ActivityField.propTypes = {
    currentActivity: PropTypes.string.isRequired,
    selectActivity: PropTypes.func.isRequired
}

export default ActivityField;