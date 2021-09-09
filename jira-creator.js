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
                    document.getElementById("bugnote_text").value = "Numer wewnętrzny zgłoszenia ATP: " + jiraTicket;
                    document.getElementById("bugnoteadd").submit();
                } else {
                    console.log(response.responseText);
                }
            }
        });
    });
}

function getData() {
    var taskId = document.getElementsByClassName("bug-id")[1].innerText;
    var assignee = document.getElementsByClassName("bug-assigned-to")[1].children[0].title;
    var projectId = document.getElementsByClassName("bug-project")[1].innerText.split(" ");
    var summary = document.getElementsByClassName("bug-summary")[1].innerText.split(" ");
    summary.shift();
    var jiraSummary = "";
    var asChanges = false;
    var issueType = findCustomFieldValue("th", "Typ zgłoszenia");
    var settlementMethod = findCustomFieldValue("th", "Sposób rozliczenia");
    if (issueType === "Nowa Funkcjonalność") {
        jiraSummary = "[CR] " + summary.join(" ");
        asChanges = true;
    } else {
        jiraSummary = summary.join(" ");
    }
    var description = document.getElementsByClassName("bug-description")[1].innerText;
    var priority = document.getElementsByClassName("bug-severity")[1].innerText;
//    var category = document.getElementsByClassName("bug-category")[1].innerText.split(" ").pop();

    return new JiraTicket(taskId, jiraSummary, description, assignee, asChanges, issueType, priority, settlementMethod);
}

function findCustomFieldValue(tagName, innerText) {
    var aTags = document.getElementsByTagName(tagName);
    var found;

    for (var i = 0; i < aTags.length; i++) {
        if (aTags[i].textContent == innerText) {
            found = aTags[i];
            break;
        }
    }
    if (found !== undefined && found.nextElementSibling !== undefined) {
        return found.nextElementSibling.innerText;
    }
    return null;
}
