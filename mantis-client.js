class MantisClient {
    constructor(address, username, password, taskId) {
        this.address = address;
        this.username = username;
        this.password = password;
        this.taskId = taskId;
    }

	getTask() {
        var request = this.getTaskRequest();
        GM_xmlhttpRequest({
            method: "POST",
            url: this.address,
            data: request,
            onload: function(response) {
                var obj = XmlParser.parse(response.responseText, false);
                var task = new Task(obj);
                var htmlTask = HtmlGenerator.createMantisInfo(task);

                var parent = document.getElementsByClassName("aui-item issue-main-column")[0];
                var description = document.getElementById("descriptionmodule");

                var iDiv = document.createElement('div');
                iDiv.innerHTML = htmlTask;
                parent.insertBefore(iDiv, description);

                addListenerToEdit("category");
                addListenerToEdit("priority-mantis");
                addListenerToEdit("status");
                addListenerToEdit("assignee");
            }
        });
    }

    sendEditTask(editTask) {
        var request = this.getEditRequest(editTask);
        GM_xmlhttpRequest({
            method: "POST",
            url: this.address,
            data: request,
            onload: function(response) {
                var mantisDiv = document.getElementById("mantis-details-root");
                mantisDiv.parentNode.removeChild(mantisDiv);
                client.getTask();
            }
        });
    }

    getCredentialsInXml() {
        return "<username xsi:type=\"xsd:string\">" + this.username + "</username>\n" +
        "<password xsi:type=\"xsd:string\">" + this.password + "</password>\n";
    }

    getTaskRequest() {
        return "<soapenv:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"\n" +
        " xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\"\n" +
        " xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\"\n" +
        " xmlns:man=\"http://futureware.biz/mantisconnect\">\n" +
        "   <soapenv:Header/>\n" +
        "   <soapenv:Body>\n" +
        "      <man:mc_issue_get soapenv:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\">\n" +
                  this.getCredentialsInXml() +
        "         <issue_id xsi:type=\"xsd:integer\">" + this.taskId + "</issue_id>\n" +
        "      </man:mc_issue_get>\n" +
        "   </soapenv:Body>\n" +
        "</soapenv:Envelope>";
    }

    getEditRequest(editTask) {
        var request = [];
        request.push("<soapenv:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"\n" +
        " xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\"\n" +
        " xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\"\n" +
        " xmlns:man=\"http://futureware.biz/mantisconnect\"\n" +
        " xmlns:soapenc=\"http://schemas.xmlsoap.org/soap/encoding/\">\n" +
        "   <soapenv:Header/>\n" +
        "   <soapenv:Body>\n" +
        "      <man:mc_issue_update soapenv:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\">\n" +
                  this.getCredentialsInXml() +
        "         <issueId xsi:type=\"xsd:integer\">" + editTask.taskId + "</issueId>\n" +
        "         <issue xsi:type=\"man:IssueData\">\n");

        if (editTask.category !== null) {
            request.push("<category xsi:type=\"xsd:string\">" + editTask.category + "</category>\n");
        }
        if (editTask.severity !== null) {
            request.push("<severity xsi:type=\"man:ObjectRef\">\n" +
            "<name xsi:type=\"xsd:string\">" + editTask.severity + "</name>\n" +
            "</severity>\n");
        }
        if (editTask.status !== null) {
            request.push("<status xsi:type=\"man:ObjectRef\">\n" +
            "<name xsi:type=\"xsd:string\">" + editTask.status + "</name>\n" +
            "</status>\n");
        }
        if (editTask.assignee !== null) {
            request.push("<handler xsi:type=\"man:AccountData\">\n" +
            "<name xsi:type=\"xsd:string\">" + editTask.assignee + "</name>\n" +
            "</handler>\n");
        }
        request.push("</issue>\n" +
        "</man:mc_issue_update>\n" +
        "</soapenv:Body>\n" +
        "</soapenv:Envelope>");

        return request.join("");
    }
}