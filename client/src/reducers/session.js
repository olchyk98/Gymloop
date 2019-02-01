export default function(state = {}, { type, payload }) {
    let a = {...state}

    switch(type) {
        case 'NOTIFY_NEW_PAGE':
            a.currentPage = payload;
        break;
        case 'CAST_GLOBAL_ERROR':
            // {...}-d
            // highOrdered: ?Boolean,
            // text: |(String | Number)!|,
            // buttons: |Array[
            //     {
            //         icon: |FontAwesome rendered DOM element|,
            //         action: Function!
            //     }
            // ]|

            if(!payload) { // close modal
                a.globalError = null;
                break;
            }

            if(a.globalError && !payload.highOrdered) break;
        
            if(!payload.buttons)
                payload.buttons = [];

            if(typeof payload.highOrdered !== "boolean")
                payload.highOrdered = false;

            a.globalError = payload;
        break;
        case 'SET_WORK_OS':
            a.workOS = payload;
        break;
        default:break;
    }
    
    return a;
}