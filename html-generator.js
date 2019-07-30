class HtmlGenerator {
    static createMantisInfo(task) {
        return "<div id=\"mantis-module\" class=\"module toggle-wrap\">\n" +
                "    <div id=\"mantis-module_heading\" class=\"mod-header\">\n" +
                "        <ul class=\"ops\"></ul>\n" +
                "        <h2 class=\"toggle-title\">Mantis Info</h2></div>\n" +
                "    <div class=\"mod-content\">\n" +
                "        <ul id=\"mantisdetails\" class=\"property-list two-cols\">\n" +
                "            <li class=\"item\">\n" +
                HtmlGenerator.createField("Dealer", "dealer", task.project) +
                "            </li>\n" +
                "            <li class=\"item item-right\">\n" +
                HtmlGenerator.createField("Reporter", "reporter", task.reporter) +
                "            </li>\n" +
                "            <li class=\"item\">\n" +
                HtmlGenerator.createFieldWithEdit("Priority", "severity", task.severity, HtmlGenerator.getSeverities()) +
                "            </li>\n" +
                "            <li class=\"item item-right\">\n" +
                HtmlGenerator.createFieldWithEdit("Category", "category", task.category, HtmlGenerator.getCategories()) +
                "            </li>\n" +
                "            <li class=\"item\">\n" +
                HtmlGenerator.createFieldWithEdit("Status", "status", task.status, HtmlGenerator.getStatuses()) +
                "            </li>\n" +
                "            <li class=\"item item-right\">\n" +
                HtmlGenerator.createFieldWithEdit("Assignee", "assignee", task.assignee, HtmlGenerator.getUsers()) +
                "            </li>\n" +
                "            <li class=\"item\">\n" +
                HtmlGenerator.createField("Date", "date", task.dateSubmitted) +
                "            </li>\n" +
                "        </ul>\n" +
                "    </div>\n" +
                "</div>";
    }

    static createFieldWithEdit(label, fieldId, selectedValue, values) {
        var value;
        if (selectedValue instanceof ObjectRef ||
            selectedValue instanceof AccountData) {
            value = selectedValue.value;
        } else {
            value = selectedValue;
        }
        return "<div class=\"wrap\">\n" +
                "    <strong class=\"name\">" + label + ":</strong>\n" +
                "    <span id=\"" + fieldId + "-val-inactive\" class=\"value editable-field inactive\" title=\"Click to edit\">\n" +
                     value +
                "        <span id=\"" + fieldId + "-val-inactive-inner\" class=\"overlay-icon aui-icon aui-icon-small aui-iconfont-edit\"></span>\n" +
                "    </span>" +
                "    <span id=\"" + fieldId + "-val\" class=\"value editable-field active\">\n" +
                "        <form id=\"" + fieldId + "-form\" class=\"ajs-dirty-warning-exempt aui\" action=\"javascript:void(0);\" style=\"display:none;\">\n" +
                "            <div class=\"inline-edit-fields\" tabindex=\"1\">\n" +
                "                <div class=\"field-group\" id=\"" + fieldId + "-container\">\n" +
                "                    <select id=\"" + fieldId + "\" name=\"" + fieldId + "\" class=\"aui-ss-select\">\n" +
                                     HtmlGenerator.getOptions(selectedValue, values) +
                "                    </select>\n" +
                "                </div>\n" +
                "            </div>\n" +
                "            <div class=\"save-options\" tabindex=\"1\">\n" +
                "                <button id=\"" + fieldId + "-btn-submit\" class=\"aui-button submit\">\n" +
                "                    <span class=\"aui-icon aui-icon-small aui-iconfont-success\">Save</span>\n" +
                "                </button>\n" +
                "                <button id=\"" + fieldId + "-btn-cancel\" class=\"aui-button cancel\">\n" +
                "                    <span class=\"aui-icon aui-icon-small aui-iconfont-close-dialog\">Cancel</span>\n" +
                "                </button>" +
                "            </div>\n" +
                "        </form>" +
                "    </span>\n" +
                "</div>\n";
    }

    static createField(label, fieldId, selectedValue) {
        var value;
        if (selectedValue instanceof ObjectRef ||
            selectedValue instanceof AccountData) {
            value = selectedValue.value;
        } else {
            value = selectedValue;
        }
        return "<div class=\"wrap\">\n" +
            "    <strong class=\"name\">" + label + ":</strong>\n" +
            "    <span id=\"" + fieldId + "-val\" class=\"value\">\n" +
                 value +
            "    </span>\n" +
            "</div>\n";
    }

    static getCategories() {
        var values = [];
        values[0] = "Błąd";
        values[1] = "Konsultacje";
        return values;
    }

    static getSeverities() {
        var xmlPropertyName = "severity";
        var values = [];
        values[0] = new ObjectRef(xmlPropertyName, 20, "błahy");
        values[1] = new ObjectRef(xmlPropertyName, 50, "drobny");
        values[2] = new ObjectRef(xmlPropertyName, 60, "ważny");
        values[3] = new ObjectRef(xmlPropertyName, 70, "błąd krytyczny");
        values[4] = new ObjectRef(xmlPropertyName, 80, "blokujący");
        return values;
    }

    static getStatuses() {
        var xmlPropertyName = "status";
        var values = [];
        values[0] = new ObjectRef(xmlPropertyName, 10, "nowy");
        values[1] = new ObjectRef(xmlPropertyName, 30, "uznany");
        values[2] = new ObjectRef(xmlPropertyName, 50, "przypisany");
        values[3] = new ObjectRef(xmlPropertyName, 20, "zwrócony");
        values[4] = new ObjectRef(xmlPropertyName, 40, "potwierdzony");
        values[5] = new ObjectRef(xmlPropertyName, 80, "rozwiązany");
        values[6] = new ObjectRef(xmlPropertyName, 90, "zamknięty");
        return values;
    }

    static getUsers() {
        var xmlPropertyName = "handler";
        var values = [];
        values[0] = new AccountData(xmlPropertyName, 749, "akruczynska");
        values[1] = new AccountData(xmlPropertyName, 66, "brutkowski");
        values[2] = new AccountData(xmlPropertyName, 671, "ejanakowska");
        values[3] = new AccountData(xmlPropertyName, 89, "gstepniewski");
        values[4] = new AccountData(xmlPropertyName, 54, "jhorodecki");
        values[5] = new AccountData(xmlPropertyName, 743, "kdudziak");
        values[6] = new AccountData(xmlPropertyName, 768, "kmoszczynska");
        values[7] = new AccountData(xmlPropertyName, 26, "ljedynak");
        values[8] = new AccountData(xmlPropertyName, 766, "mbartkowiak");
        values[9] = new AccountData(xmlPropertyName, 765, "mchudzinski");
        values[10] = new AccountData(xmlPropertyName, 740, "mgodlewski");
        values[11] = new AccountData(xmlPropertyName, 64, "mkoszarska");
        values[12] = new AccountData(xmlPropertyName, 741, "mmikolajczak");
        values[13] = new AccountData(xmlPropertyName, 6, "mrobak");
        values[14] = new AccountData(xmlPropertyName, 62, "phendrysiak");
        values[15] = new AccountData(xmlPropertyName, 728, "pjanczuk");
        values[16] = new AccountData(xmlPropertyName, 670, "pkonieczka");
        values[17] = new AccountData(xmlPropertyName, 3, "pkrol");
        values[18] = new AccountData(xmlPropertyName, 742, "rirla");
        values[19] = new AccountData(xmlPropertyName, 81, "sapolinarski");
        values[20] = new AccountData(xmlPropertyName, 706, "snaroznowska");
        values[21] = new AccountData(xmlPropertyName, 739, "tsulek");
        return values;
    }

    static getOptions(selectedValue, values) {
        if (selectedValue instanceof ObjectRef ||
            selectedValue instanceof AccountData) {
            var options = [];
            for (var i = 0; i < values.length; i++) {
                var selected = "";
                if (values[i].id === selectedValue.id) {
                    selected = "selected";
                }
                options.push("<option value=\"" + values[i].id + "\" " + selected + ">" + values[i].value + "</option>\n")
            }
        } else {
            var options = [];
            for (var i = 0; i < values.length; i++) {
                var selected = "";
                if (values[i] === selectedValue) {
                    selected = "selected";
                }
                options.push("<option value=\"" + values[i] + "\" " + selected + ">" + values[i] + "</option>\n")
            }
        }

        return options.join("");
    }
}