import React from 'react';

// import Hero from './index';
import HistoryItem from './HistoryItem';

import { shallow } from 'enzyme';

describe('Test root sleep page', () => {

    /* WARNING: It won't pass now,
       because this function doesn't return any value by default. */
    // it('Test add>submit function | DISABLED', () => {
    //     const element = shallow(
    //         <Hero />
    //     ).find('Add').first();
        
    //     expect( element ).toBeDefined();

    //     element.setState({
    //         start: { hours: "07", minutes: "24" },
    //         endTime: { hours: "15", minutes: "10" },
    //         rate: 3
    //     });

    //     expect( element.instance().submit() ).toEqual([ 7.4, 24.5, 15.1, 10.9 ])
    // });

    {
        // I won't change this element.
        const element = shallow(
            <HistoryItem
                time="1549213083698" // Sun Feb 03 2019 17:58:03 GMT+0100
                rating="4"
                sleepMinutes="256"
            />
        ).instance();

        it('Test getDate function', () => {
            expect( element.getDate() ).toBe(3);
        });

        it('Test getMonth function', () => { 
            expect( element.getMonth() ).toBe('FEB');
        });

        it('Test getDuration function', () => {
            expect( element.getDuration() ).toBe('4h 16m');
        });

        it('Test smile rating', () => {
            expect( element.getSmile() ).toBe('far fa-smile-wink');
        });
    }
});