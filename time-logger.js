function initializeJiraTimeLogger(jiraIssueApi, jiraUsername, jiraPassword) {
    var nav = document.getElementsByClassName("aui-nav aui-nav-breadcrumbs")[0];
    var element = nav.children[nav.childElementCount - 1];
    var ticketKey = element ? element.children[0].innerText : undefined;

    createLogTimeInput("log-work-custom-form", jiraIssueApi, jiraUsername, jiraPassword, ticketKey);
    createLogTimeSummary("log-time-summary-custom")
    setTimeToLog();
}

function setTimeToLog() {
    var customLogTime = document.getElementById("customlogtime");
    if (customLogTime) {
        customLogTime.value = getCurrentTimeToLog();
    }
    refreshLogTimeSummary("log-time-summary-custom");
}

function createLogTimeSummary(id) {
    if (document.getElementById(id) !== null) {
        return;
    }
    var parent = document.getElementsByClassName("aui-nav")[0];
    if (parent === null) {
        return;
    }
    var iLi = document.createElement('li');
    iLi.className = "toolbar-item";
    var iAElement = document.createElement('a');
    iAElement.id = id;
    iAElement.className = "aui-nav-link";
    iAElement.innerHTML = getLogTimeSummary();
    iLi.appendChild(iAElement);
    parent.appendChild(iLi);
}

function refreshLogTimeSummary(id) {
    var summary = document.getElementById(id);
    if (summary === null) {
        return;
    }
    summary.innerHTML = getLogTimeSummary();
}
function getLogTimeSummary() {
    return "Zalogowano dzisiaj: " + getLoggedTime();
}

function createLogTimeInput(id, jiraApi, jiraUsername, jiraPassword, ticketKey) {
    if (document.getElementById(id) !== null) {
        return;
    }
    var parent = document.getElementById("opsbar-jira.issue.tools");
    if (parent === null) {
        return;
    }
    var iLi = document.createElement('li');
    iLi.className = "toolbar-item";
    var formElement = document.createElement('form');
    formElement.id = id;
    formElement.className = "ajs-dirty-warning-exempt aui";
    formElement.action = "#";
    var iInputElement = document.createElement('input');
    iInputElement.className = "textfield text short-field";
    iInputElement.id = "customlogtime";
    iInputElement.name = "customlogtime";
    iInputElement.maxlength = "10";
    iInputElement.type = "text";

    var buttonElement = document.createElement('a');
    buttonElement.className = "aui-button submit"
    buttonElement.innerHTML = "<span class=\"aui-icon aui-icon-small aui-iconfont-success\">Save</span>"
    formElement.appendChild(iInputElement);
    formElement.appendChild(buttonElement);
    iLi.appendChild(formElement);
    parent.appendChild(iLi);

    buttonElement.addEventListener("click", function() {

    var jiraIssueApi = jiraApi + "/" + ticketKey + "/worklog";
        var jiraData = {};
        jiraData.started = dateToJiraString(new Date());
        var secondsToLog = getSecondsToLog(document.getElementById("customlogtime").value);
        if (secondsToLog === 0) {
            alert("Nie sparsowałem...");
            return;
        }
        jiraData.timeSpentSeconds = secondsToLog;
        GM_xmlhttpRequest({
            method: "POST",
            url: jiraIssueApi,
            headers: {
                "Content-Type": "Application/json"
            },
            data: JSON.stringify(jiraData),
            username: jiraUsername,
            password: jiraPassword,
            onload: function(response) {
                if (response.status === 201) {
                    var timeInSeconds = JSON.parse(response.responseText).timeSpentSeconds;
                    addTimeToLocalStorage(timeInSeconds);
                    setTimeToLog();
                } else {
                    console.log(response);
                }
            }
        });
    });
}


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

function getSecondsToLog(inputVal) {
    var split = inputVal.split(" ");
    var hours = 0;
    var minutes = 0;
    var arrayLength = split.length;
    for (var i = 0; i < arrayLength; i++) {
    		var val = split[i];
        var intVal = parseInt(val.substring(0, val.length - 1));
        if (!isNaN(intVal)) {
        	if (val.endsWith("h")) {
          	hours += intVal;
          } else if (val.endsWith("m")) {
          	minutes += intVal;
          }
        }
    }
    return ((hours * 60) + minutes) * 60;
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