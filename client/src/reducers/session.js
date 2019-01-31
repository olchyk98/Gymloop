export default function(state = {}, { type, payload }) {
    let a = {...state}

    switch(type) {
        case 'NOTIFY_NEW_PAGE':
            a.currentPage = payload;
        break;
        case 'CAST_GLOBAL_ERROR':
            a.globalError = payload;
        break;
        case 'SET_WORK_OS':
            a.workOS = payload;
        break;
        default:break;
    }
    
    return a;
}