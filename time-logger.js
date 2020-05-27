function addTimeToLocalStorage(seconds) {
    var key = getTimeSpentKey();
    var currentTimeSpent = parseInt(GM_getValue(key));
    if (isNaN(currentTimeSpent)) {
        currentTimeSpent = 0;
    }
    GM_setValue(key, currentTimeSpent + seconds);
    GM_setValue(getLastLoggedTimeKey(), new Date());
}

function getLoggedTime() {
    return parseSecondsOfCurrentTime();
}

function getTimeSpentKey() {
    return "timeSpent-" + getToday();
}

function getLastLoggedTimeKey() {
    return "lastLog-" + getToday();
}

function getCurrentTimeToLog() {
    var lastLog = GM_getValue(getLastLoggedTimeKey());
    if (lastLog === undefined) {
        return "";
    }
    const diffTime = Math.abs(new Date() - new Date(lastLog));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    var hours = Math.floor(diffMinutes/60);
    var minutes = diffMinutes % 60;
    if (hours > 0) {
        return hours + "h " + minutes + "m";
    }
    return minutes + "m";
}

function parseSecondsOfCurrentTime() {
    var key = getTimeSpentKey();
    var date = new Date(null);
    var currentTimeSpent = parseInt(GM_getValue(key));
    if (isNaN(currentTimeSpent)) {
        currentTimeSpent = 0;
    }
    date.setSeconds(currentTimeSpent);
    return date.toISOString().substr(11, 8);
}

function getToday() {
    return new Date().toLocaleDateString();
}

function withLeadingZeros(value) {
    return withLeadingZerosWithLength(value, 2);
}

function  withLeadingZerosWithLength(value, length) {
    return ('0' + value).slice(-length);
}

function dueDateToString() {
    var date = new Date();
    return withLeadingZeros(date.getDate()) + "-" + withLeadingZeros(date.getMonth()+1) + "-" +
        date.getFullYear() + " " + withLeadingZeros(date.getHours()) + ":" + withLeadingZeros(date.getMinutes());
}

// http://usefulangle.com/post/30/javascript-get-date-time-with-offset-hours-minutes
function dateToJiraString(date) {
    var currentDate = withLeadingZeros(date.getDate());
    var currentMonth = withLeadingZeros(date.getMonth() + 1);
    var currentYear = date.getFullYear();
    var currentHrs = withLeadingZeros(date.getHours());
    var currentMins = withLeadingZeros(date.getMinutes());
    var currentSecs = withLeadingZeros(date.getSeconds());
    var currentMsecs = withLeadingZerosWithLength(date.getMilliseconds(), 3);
    var currentDatetime;

    // Current datetime
    // String such as 2016-07-16T19:20:30
    currentDatetime = currentYear + '-' + currentMonth + '-' + currentDate + 'T' +
        currentHrs + ':' + currentMins + ':' + currentSecs + '.' + currentMsecs;

    var timezoneOffsetMin = date.getTimezoneOffset();
    var offsetHrs = withLeadingZeros(parseInt(Math.abs(timezoneOffsetMin / 60)));
    var offsetMin = withLeadingZeros(Math.abs(timezoneOffsetMin % 60));
    var timezoneStandard;

    // Add an opposite sign to the offset
    // If offset is 0, it means timezone is UTC
    if (timezoneOffsetMin < 0) {
        timezoneStandard = '+' + offsetHrs + offsetMin;
    } else if (timezoneOffsetMin > 0) {
        timezoneStandard = '-' + offsetHrs + offsetMin;
    } else if (timezoneOffsetMin == 0) {
        timezoneStandard = 'Z';
    }

    return currentDatetime + timezoneStandard;
}