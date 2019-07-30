class MantisClient {
    constructor(address, username, password, taskId) {
        this.address = address;
        this.username = username;
        this.password = password;
        this.taskId = taskId;
        this.task = null;
    }

	getTask() {
        var request = this.getTaskRequest();
        var clientToListener = this;
        GM_xmlhttpRequest({
            method: "POST",
            url: this.address,
            data: request,
            onload: function(response) {
                var obj = XmlParser.parse(response.responseText, false);
                clientToListener.task = new Task(obj);
                var htmlTask = HtmlGenerator.createMantisInfo(clientToListener.task);

                var parent = document.getElementsByClassName("aui-item issue-main-column")[0];
                var description = document.getElementById("descriptionmodule");

                var iDiv = document.createElement('div');
                iDiv.innerHTML = htmlTask;
                parent.insertBefore(iDiv, description);

                addListenerToEdit(clientToListener, "category");
                addListenerToEdit(clientToListener, "severity");
                addListenerToEdit(clientToListener, "status");
                addListenerToEdit(clientToListener, "assignee");
            }
        });
    }

    sendEditTask() {
        var request = this.getEditRequest();
        var clientToListener = this;
        console.log(request);
        GM_xmlhttpRequest({
            method: "POST",
            url: this.address,
            data: request,
            onload: function(response) {
                var mantisDiv = document.getElementById("mantis-details-root");
                mantisDiv.parentNode.removeChild(mantisDiv);
                clientToListener.getTask();
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

    getEditRequest() {
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
        "         <issueId xsi:type=\"xsd:integer\">" + this.taskId + "</issueId>\n" +
        "         <issue xsi:type=\"man:IssueData\">\n");

        request.push("<view_state xsi:type=\"man:ObjectRef\">\n" +
                  "<name xsi:type=\"xsd:string\">" + this.task.viewState + "</name>\n" +
                  "</view_state>\n");

        request.push("<project xsi:type=\"man:ObjectRef\">\n" +
                  "<name xsi:type=\"xsd:string\">" + this.task.projectName + "</name>\n" +
                  "</project>\n");

        if (this.task.category !== null) {
            request.push("<category xsi:type=\"xsd:string\">" + this.task.category + "</category>\n");
        }

        request.push("<priority xsi:type=\"man:ObjectRef\">\n" +
                  "<name xsi:type=\"xsd:string\">" + this.task.priority + "</name>\n" +
                  "</priority>\n");

        if (this.task.severity !== null) {
            request.push("<severity xsi:type=\"man:ObjectRef\">\n" +
            "<name xsi:type=\"xsd:string\">" + this.task.severity + "</name>\n" +
            "</severity>\n");
        }
        if (this.task.status !== null) {
            request.push("<status xsi:type=\"man:ObjectRef\">\n" +
            "<name xsi:type=\"xsd:string\">" + this.task.status + "</name>\n" +
            "</status>\n");
        }

        request.push("<reporter xsi:type=\"man:AccountData\">\n" +
                  "<name xsi:type=\"xsd:string\">" + this.task.reporter + "</name>\n" +
                  "</reporter>\n");

        request.push("<summary xsi:type=\"xsd:string\">" + this.task.summary + "</summary>\n");

        request.push("<reproducibility xsi:type=\"man:ObjectRef\">\n" +
                  "<name xsi:type=\"xsd:string\">" + this.task.reproducibility + "</name>\n" +
                  "</reproducibility>\n");

        if (this.task.assignee !== null) {
            request.push("<handler xsi:type=\"man:AccountData\">\n" +
            "<name xsi:type=\"xsd:string\">" + this.task.assignee + "</name>\n" +
            "</handler>\n");
        }

        request.push("<resolution xsi:type=\"man:ObjectRef\">\n" +
                  "<name xsi:type=\"xsd:string\">" + this.task.resolution + "</name>\n" +
                  "</resolution>\n");

        request.push("<description xsi:type=\"xsd:string\">" + this.task.description + "</description>\n");

        request.push("</issue>\n" +
        "</man:mc_issue_update>\n" +
        "</soapenv:Body>\n" +
        "</soapenv:Envelope>");

        return request.join("");
    }
}