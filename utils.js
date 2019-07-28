class Task {
    constructor(response) {
        var xmlObject = response["SOAP-ENV:Envelope"]["SOAP-ENV:Body"]["ns1:mc_issue_getResponse"].return;
        this.projectName = xmlObject.project.name["#text"];
        this.category = xmlObject.category["#text"];
        this.severity = xmlObject.severity.name["#text"];
        this.status = xmlObject.status.name["#text"];
        this.reporter = xmlObject.reporter.name["#text"];
        this.summary = xmlObject.summary["#text"];
        this.description = xmlObject.description["#text"];
        this.dateSubmitted = xmlObject.date_submitted["#text"];
        this.assignee = xmlObject.handler.name["#text"];
        this.comments = [];
        for(var i = 0; i < xmlObject.notes.item.length; i++) {
            this.comments[i] = new Comment(xmlObject.notes.item[i]);
        }
    }
}

class Comment {
    constructor(xmlComment) {
        this.author = xmlComment.reporter.name["#text"];
        this.text = xmlComment.text["#text"];
        this.dateSubmitted = xmlComment.date_submitted["#text"];
    }
}

class EditTask {
    constructor(taskId) {
        this.taskId = taskId;
        this.category = null;
        this.severity = null;
        this.status = null;
        this.assignee = null;
    }
}