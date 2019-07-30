class Task {
    constructor(response) {
        var xmlObject = response["SOAP-ENV:Envelope"]["SOAP-ENV:Body"]["ns1:mc_issue_getResponse"].return;
        this.viewState = ObjectRef.fromXml("view_state", xmlObject.view_state);
        this.project = ObjectRef.fromXml("project", xmlObject.project);
        //editable
        this.category = xmlObject.category["#text"];
        this.priority = ObjectRef.fromXml("priority", xmlObject.priority);
        //editable
        this.severity = ObjectRef.fromXml("severity", xmlObject.severity);
        //editable
        this.status = ObjectRef.fromXml("status", xmlObject.status);
        this.reporter = AccountData.fromXml("reporter", xmlObject.reporter);
        this.summary = xmlObject.summary["#text"];
        this.reproducibility = ObjectRef.fromXml("reproducibility", xmlObject.reproducibility);
        this.description = xmlObject.description["#text"];
        this.dateSubmitted = xmlObject.date_submitted["#text"];
        //editable
        this.assignee = AccountData.fromXml("handler", xmlObject.handler);
        this.resolution = ObjectRef.fromXml("resolution", xmlObject.resolution);
        this.comments = [];
        if (xmlObject.notes !== undefined) {
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

class ObjectRef {
    constructor(xmlPropertyName, id, value) {
        this.xmlPropertyName = xmlPropertyName;
        this.id = id;
        this.value = value;
    }

    static fromXml(xmlPropertyName, xmlObject) {
        return new ObjectRef(xmlPropertyName, xmlObject.id["#text"], xmlObject.name["#text"]);
    }

    toXml() {
        return "<"+ this.xmlPropertyName +" xsi:type=\"man:ObjectRef\">\n" +
                 "<id xsi:type=\"xsd:integer\">" + this.id + "</id>\n" +
                 "<name xsi:type=\"xsd:string\">" + this.value + "</name>\n" +
                 "</" + this.xmlPropertyName + ">\n";
    }
}

class AccountData {
    constructor(xmlPropertyName, id, value) {
            this.xmlPropertyName = xmlPropertyName;
            this.id = id;
            this.value = value;
        }

        static fromXml(xmlPropertyName, xmlObject) {
            return new AccountData(xmlPropertyName, xmlObject.id["#text"], xmlObject.name["#text"]);
        }

    toXml() {
        return "<"+ this.xmlPropertyName +" xsi:type=\"man:AccountData\">\n" +
                 "<id xsi:type=\"xsd:integer\">" + this.id + "</id>\n" +
                 "<name xsi:type=\"xsd:string\">" + this.value + "</name>\n" +
                 "</" + this.xmlPropertyName + ">\n";
    }
}