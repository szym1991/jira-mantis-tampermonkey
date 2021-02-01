function initializeJiraCreator(jiraIssueApi, jiraUsername, jiraPassword) {
    initializeJiraCreator(null, jiraIssueApi, jiraUsername, jiraPassword);
}

function initializeJiraCreator(parentJira, jiraIssueApi, jiraUsername, jiraPassword) {
    var jiraData = getData();
    if (parentJira !== null && jiraData.fields.parent != null) {
        jiraData.fields.parent.key = parentJira;
    }
    var parent = document.getElementsByClassName("btn-group pull-left")[0];
    var iDiv = document.createElement('div');
    iDiv.className = "btn btn-primary btn-white btn-round btn-sm";
    iDiv.innerHTML = "Utwórz JIRA";
    parent.appendChild(iDiv);
    iDiv.addEventListener("click", function() {
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
                } else {
                    console.log(response.responseText);
                }
            }
        });
    });


    var iSpan = document.createElement('div');
    iSpan.className = "label hidden-xs label-default";
    iSpan.innerHTML = "SLA: " + jiraData.dueDateToString();
    parent.appendChild(iSpan);
}

function getData() {
    var taskId = document.getElementsByClassName("bug-id")[1].innerText;
    var assignee = document.getElementsByClassName("bug-assigned-to")[1].innerText.trim();
    var projectId = document.getElementsByClassName("bug-project")[1].innerText.split(" ");
    var summary = document.getElementsByClassName("bug-summary")[1].innerText.split(" ");
    summary.shift();
    var jiraSummary = "";
    var tag = projectId.pop();
    var asChanges = false;
    if (tag === "changes") {
        jiraSummary = "[CR] " + summary.join(" ");
        asChanges = true;
    } else {
        jiraSummary = "[" + tag + "] " + summary.join(" ");
    }
    var description = document.getElementsByClassName("bug-description")[1].innerText;
    var severity = document.getElementsByClassName("bug-severity")[1].innerText;
    var category = document.getElementsByClassName("bug-category")[1].innerText.split(" ").pop();

    var createdTime = new Date(document.getElementsByClassName("bug-date-submitted")[1].innerText);

    var ddc = new DueDateCalculator(8, 18);
    var dueDate = ddc.calculateDueDate(createdTime, category, severity);

    var label = "SERWIS_GWARANCYJNY";
    if (category.toUpperCase() === "KONSULTACJE") {
        label = "UTRZYMANIE";
    }
    return new JiraTicket(taskId, jiraSummary, description, assignee, label, dueDate, asChanges);
}