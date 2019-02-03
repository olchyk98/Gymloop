import React, { Component } from 'react';

class HistoryItem extends Component {
    getDate = () => {
        return (new Date(+this.props.time)).getDate();
    }

    getMonth = () => {
        const a = new Date(+this.props.time);

        return [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'July',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ][a.getMonth()].toUpperCase();
    }

    getDuration = () => { // OUT_FORMAT: 8h 30m
        const a = +this.props.sleepMinutes;
        
        return `${ Math.floor(a / 60) }h ${ Math.floor(a % 60) }m`
    }

    getSmile = () => ({
        1: 'far fa-angry',
        2: 'far fa-smile',
        3: 'far fa-grin',
        4: 'far fa-smile-wink',
        5: 'far fa-smile-beam'
    }[+this.props.rating])

    render() {
        return(
            <div className="rn-sleep-history-list-item">
                <div className="rn-sleep-history-list-item-date">
                    <span className="rn-sleep-history-list-item-date-day">{ this.getMonth() }</span>
                    <span className="rn-sleep-history-list-item-date-number">{ this.getDate() }</span>
                </div>
                <div className="rn-sleep-history-list-item-time">
                    <span>{ this.getDuration() }</span>
                </div>
                <div className="rn-sleep-history-list-item-mood">
                    <div><i className={ this.getSmile() } /></div>
                </div>
                <button className="rn-sleep-history-list-item-delete definp" onClick={ this.props.onDelete }>
                    <i className="fas fa-trash" />
                </button>
            </div>
        );
    }
}

export default HistoryItem;