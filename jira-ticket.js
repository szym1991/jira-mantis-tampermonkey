class JiraTicket {
    constructor(taskId, summary, description, assignee, label, dueDate) {
        this.fields = {};
        this.fields.project = {};
        this.fields.project.key = "DMS";
        this.fields.parent = {};
        this.fields.parent.key = "DMS-11454";
        this.fields.summary = summary;
        this.fields.description = description;
        this.fields.issuetype = {};
        this.fields.issuetype.id = "10501";
        this.fields.labels = [label];
        this.fields.customfield_12300 = this.dueDateToJiraString(dueDate);
        this.fields.customfield_10904 = taskId;
        this.fields.customfield_11700 = {"name": assignee};
    }

    withLeadingZeros(value) {
        return this.withLeadingZerosWithLength(value, 2);
    }

    withLeadingZerosWithLength(value, length) {
        return ('0' + value).slice(-length);
    }

    dueDateToString() {
        var date = new Date(this.fields.customfield_12300);
        return this.withLeadingZeros(date.getDate()) + "-" + this.withLeadingZeros(date.getMonth()+1) + "-" +
            date.getFullYear() + " " + this.withLeadingZeros(date.getHours()) + ":" + this.withLeadingZeros(date.getMinutes());
    }

    // http://usefulangle.com/post/30/javascript-get-date-time-with-offset-hours-minutes
    dueDateToJiraString(date) {
        var currentDate = this.withLeadingZeros(date.getDate());
        var currentMonth = this.withLeadingZeros(date.getMonth() + 1);
        var currentYear = date.getFullYear();
        var currentHrs = this.withLeadingZeros(date.getHours());
        var currentMins = this.withLeadingZeros(date.getMinutes());
        var currentSecs = this.withLeadingZeros(date.getSeconds());
        var currentMsecs = this.withLeadingZerosWithLength(date.getMilliseconds(), 3);
        var currentDatetime;

        // Current datetime
        // String such as 2016-07-16T19:20:30
        currentDatetime = currentYear + '-' + currentMonth + '-' + currentDate + 'T' +
            currentHrs + ':' + currentMins + ':' + currentSecs + '.' + currentMsecs;

        var timezoneOffsetMin = date.getTimezoneOffset();
        var offsetHrs = this.withLeadingZeros(parseInt(Math.abs(timezoneOffsetMin / 60)));
        var offsetMin = this.withLeadingZeros(Math.abs(timezoneOffsetMin % 60));
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

    getUpdateTicket() {
        var updateTicket = {};
        updateTicket.update = {};
        updateTicket.update.customfield_12300 = [{"set": this.fields.customfield_12300}];
        return updateTicket;
    }
}