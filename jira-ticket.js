class JiraTicket {
    constructor(taskId, summary, description, assignee, issueType, priority, settlementMethod) {
        this.fields = {};
        this.fields.project = {};
        this.fields.project.key = "TFMS";
        this.fields.summary = summary;
        this.fields.description = description;
        this.fields.issuetype = {};
        this.fields.parent = {};
        this.fields.parent.key = "";
        this.fields.issuetype.id = "10501"; //Bug - subtask
        this.fields.customfield_10904 = taskId; //nr_zgloszenia
        this.fields.customfield_10104 = Number.parseFloat(taskId); //MantisNumber
        this.fields.customfield_10105 = "https://mantis.atechno.pl/tfms/view.php?id=" + Number.parseFloat(taskId); //MantisURL
        // TFMS Issue Kind
        var issueTypeId = null;
        if (issueType === "Błąd" && settlementMethod === "Gwarancja") {
            issueTypeId = "11008"; //BŁĄD_GWARANCYJNY
        }
        else if (issueType === "Błąd") {
            issueTypeId = "11101"; //BŁĄD_UTRZYMANIE
        } else if (issueType === "Modyfikacja") {
            issueTypeId = "11009"; //MODYFIKACJA
        } else if (issueType === "Konsultacja") {
            issueTypeId = "11010"; //KONSULTACJA
        } else if (issueType === "Wsparcie") {
            issueTypeId = "11012"; //WSPARCIE
        } else if (issueType === "Nowa Funkcjonalność") {
            issueTypeId = "11100";
        }
        if (issueTypeId !== null) {
            this.fields.customfield_12903 = {}; // TFMS Issue Kind
            this.fields.customfield_12903.id = issueTypeId;
        }
        //Priority
        var priorityId = null;
        if (priority === "Krytyczny") {
            priorityId = "1"; //Blocker
        } else if (priority === "Poważny") {
            priorityId = "2"; //Critical
        } else if (priority === "Usterka") {
            priorityId = "3"; //Major
        } else if (priority === "Drobny") {
            priorityId = "4"; //Minor
        }
        if (priorityId != null) {
            this.fields.priority = {};
            this.fields.priority.id = priorityId;
        }

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
