class Task {
    constructor(response) {
        var xmlObject = response["SOAP-ENV:Envelope"]["SOAP-ENV:Body"]["ns1:mc_issue_getResponse"].return;
        this.viewState = xmlObject.view_state.name["#text"];
        this.projectName = xmlObject.project.name["#text"];
        //editable
        this.category = xmlObject.category["#text"];
        this.priority = xmlObject.priority.name["#text"];
        //editable
        this.severity = xmlObject.severity.name["#text"];
        //editable
        this.status = xmlObject.status.name["#text"];
        this.reporter = xmlObject.reporter.name["#text"];
        this.summary = xmlObject.summary["#text"];
        this.reproducibility = xmlObject.reproducibility.name["#text"];
        this.description = xmlObject.description["#text"];
        this.dateSubmitted = xmlObject.date_submitted["#text"];
        //editable
        this.assignee = xmlObject.handler.name["#text"];
        this.resolution = xmlObject.resolution.name["#text"];
        this.comments = [];
        if (xmlObject.notes !== undefined) {}
            for(var i = 0; i < xmlObject.notes.item.length; i++) {
                this.comments[i] = new Comment(xmlObject.notes.item[i]);
            }
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