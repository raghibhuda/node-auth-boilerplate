
import moment from 'moment';

let timeChecker = (anyTime) => {
    let now = moment(new Date());
    let endTime = moment(anyTime);
    let timeDelay = now.diff(endTime,'minutes');
    return timeDelay;
}

module.exports = timeChecker;