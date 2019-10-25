class JiraTicket {
    constructor(taskId, summary, description, assignee, label, dueDate) {
        this.fields = {};
        this.fields.project = {};
        this.fields.project.key = "DMS";
        this.fields.parent = {};
        this.fields.parent.key = "DMS-8793";
        this.fields.summary = summary;
        this.fields.description = description;
        this.fields.issuetype = {};
        this.fields.issuetype.id = "10501";
        this.fields.labels = [label];
        // this.fields.dueDate = dueDate;
        this.fields.customfield_10904 = taskId;
        this.fields.customfield_11700 = {"name": assignee};
    }
}