export default function(state = {}, { type, payload }) {
    let a = {...state}

    switch(type) {
        case 'NOTIFY_NEW_PAGE':
            a.currentPage = payload;
        break;
        default:break;
    }
    
    return a;
}