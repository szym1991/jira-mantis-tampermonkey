function initializeJiraCreator(jiraIssueApi, jiraUsername, jiraPassword) {
    var parent = document.getElementsByClassName("btn-group pull-left")[0];
    var iDiv = document.createElement('div');
    iDiv.className = "btn btn-primary btn-white btn-round btn-sm";
    iDiv.innerHTML = "Create JIRA";
    parent.appendChild(iDiv);
    iDiv.addEventListener("click", function() {
        var jiraData = getData();

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
                    var jiraTicket = JSON.parse(response.responseText).key;
                    document.getElementById("bugnote_text").value = jiraTicket;
                    document.getElementById("bugnoteadd").submit();
                }
            }
        });
    });
}

function getData() {
    var taskId = document.getElementsByClassName("bug-id")[1].innerText;
    var assignee = document.getElementsByClassName("bug-assigned-to")[1].innerText;
    var projectId = document.getElementsByClassName("bug-project")[1].innerText.split(" ");
    var summary = document.getElementsByClassName("bug-summary")[1].innerText.split(" ");
    summary.shift();
    var jiraSummary = "[" + projectId.pop() + "] " + summary.join(" ");
    var description = document.getElementsByClassName("bug-description")[1].innerText;

    return new JiraTicket(taskId, jiraSummary, description, assignee);
}

class JiraTicket {
    constructor(taskId, summary, description, assignee) {
        this.fields = {};
        this.fields.project = {};
        this.fields.project.key = "DMS";
        this.fields.parent = {};
        this.fields.parent.key = "DMS-6255";
        this.fields.summary = summary;
        this.fields.description = description;
        this.fields.issuetype = {};
        this.fields.issuetype.id = "10501";
        this.fields.customfield_10904 = taskId;
        this.fields.customfield_11700 = {"name": assignee};
    }
}