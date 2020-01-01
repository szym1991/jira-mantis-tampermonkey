function initializeServiceNowCreator(jiraIssueApi, jiraUsername, jiraPassword) {
    var jiraData = getData();
    var parent = document.getElementsByClassName("navbar_ui_actions")[0];
    var iDiv = document.createElement('div');
    iDiv.className = "form_action_button header  action_context btn btn-default";
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
                        document.getElementById("activity-stream-textarea").value = jiraTicket;
                        document.getElementsByClassName("btn btn-default pull-right activity-submit")[0].click();
                    } else {
                        console.log(response);
                    }
                }
            });
        });

}

function parseDate(date) {
    var split = date.split(" ");
    var date1 = split[0];
    var date2 = split[1];

    var dateElements = date1.split("/");
    var hoursElements = date2.split(":");

    var day = dateElements[0];
    var month = dateElements[1];
    var year = dateElements[2];
    var hour = hoursElements[0];
    var minute = hoursElements[1];
    var second = hoursElements[2];

    return new Date(year, month - 1, day, hour, minute, second);
}

function convertPersonName(serviceNowName) {
    var mapping = new Map();
    mapping.set("Agnieszka Kruczyńska", "akruczynska");
    mapping.set("Agnieszka Wojtas", "awojtas");
    mapping.set("Bogusław Rutkowski", "brutkowski");
    mapping.set("Elżbieta Janakowska", "ejanakowska");
    mapping.set("Grzegorz Stępniewski", "gstepniewski");
    mapping.set("Krzysztof Dudziak", "kdudziak");
    mapping.set("Katarzyna Moszczyńska", "kmoszczynska");
    mapping.set("Łukasz Jedynak", "ljedynak");
    mapping.set("Mateusz Chudziński", "mchudzinski");
    mapping.set("Marcin Godlewski", "mgodlewski");
    mapping.set("Maja Koszarska", "mkoszarska");
    mapping.set("Martyna Nowakowska-Sawicka", "mnowakowska");
    mapping.set("Marcin Mikołajczak", "mmikolajczak");
    mapping.set("Marcin Robak", "mrobak");
    mapping.set("Paweł Hendrysiak", "phendrysiak");
    mapping.set("Przemysław Jańczuk", "pjanczuk");
    mapping.set("Paweł Konieczka", "pkonieczka");
    mapping.set("Piotr Król", "pkrol");
    mapping.set("Rafał Irla", "rirla");
    mapping.set("Szymon Apolinarski", "sapolinarski");
    mapping.set("Sylwia Narożnowska", "snaroznowska");
    mapping.set("Tomasz Sulek", "tsulek");
    mapping.set("Przemysław Jabłoński", "UTRZYMANIE");
    mapping.set("Maciej Gorzelańczyk", "UTRZYMANIE");

    var result = mapping.get(serviceNowName);
    if (result === undefined) {
        return "UTRZYMANIE";
    }
    return result;
}

function convertCategory(category) {
    var mapping = new Map();
    mapping.set("Errors", "BŁĄD");
    mapping.set("Questions", "KONSULTACJE");
    mapping.set("User Issue", "KONSULTACJE");

    var result = mapping.get(category);
    if (result === undefined) {
        return "KONSULTACJE";
    }
    return result;
}

function convertSeverity(severity) {
    var mapping = new Map();
    mapping.set("5", "BLOKUJĄCY");
    mapping.set("6", "BŁĄD KRYTYCZNY");
    mapping.set("7", "WAŻNY");
    mapping.set("8", "DROBNY");

    var result = mapping.get(severity);
    if (result === undefined) {
        return "DROBNY";
    }
    return result;
}

function getData() {
    var taskId = document.getElementById("sys_readonly.incident.number").value;
    var assignee = convertPersonName(document.getElementById("sys_display.incident.assigned_to").value);
    //var projectId = document.getElementById("sys_display.incident.caller_id").value;
    var summary = document.getElementById("incident.short_description").value;
    //var jiraSummary = "[" + projectId.pop() + "] " + summary.join(" ");
    var description = document.getElementById("incident.description").value;
    var severity = convertSeverity(document.getElementById("incident.urgency").value);
    var category = convertCategory(document.getElementById("incident.category").value);

    var createdTime = parseDate(document.getElementById("sys_readonly.incident.opened_at").value);

    var ddc = new DueDateCalculator(8, 18);
    var dueDate = ddc.calculateDueDate(createdTime, category, severity);

    var label = "SERWIS_GWARANCYJNY";
    if (category.toUpperCase() === "KONSULTACJE") {
        label = "UTRZYMANIE";
    }

    return new JiraTicket(taskId, jiraSummary, description, assignee, label, dueDate);
}