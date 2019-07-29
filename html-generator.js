class HtmlGenerator {
    static createMantisInfo(task) {
        return "<div id=\"mantis-module\" class=\"module toggle-wrap\">\n" +
                "    <div id=\"mantis-module_heading\" class=\"mod-header\">\n" +
                "        <ul class=\"ops\"></ul>\n" +
                "        <h2 class=\"toggle-title\">Mantis Info</h2></div>\n" +
                "    <div class=\"mod-content\">\n" +
                "        <ul id=\"mantisdetails\" class=\"property-list two-cols\">\n" +
                "            <li class=\"item\">\n" +
                HtmlGenerator.createField("Dealer", "dealer", task.projectName) +
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
        return "<div class=\"wrap\">\n" +
                "    <strong class=\"name\">" + label + ":</strong>\n" +
                "    <span id=\"" + fieldId + "-val-inactive\" class=\"value editable-field inactive\" title=\"Click to edit\">\n" +
                     selectedValue +
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
        return "<div class=\"wrap\">\n" +
            "    <strong class=\"name\">" + label + ":</strong>\n" +
            "    <span id=\"" + fieldId + "-val\" class=\"value\">\n" +
                 selectedValue +
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
        var values = [];
        values[0] = "błahy";
        values[1] = "drobny";
        values[2] = "ważny";
        values[3] = "błąd krytyczny";
        values[4] = "blokujący";
        return values;
    }

    static getStatuses() {
        var values = [];
        values[0] = "nowy";
        values[1] = "uznany";
        values[2] = "przypisany";
        values[3] = "zwrócony";
        values[4] = "potwierdzony";
        values[5] = "rozwiązany";
        values[6] = "zamknięty";
        return values;
    }

    static getUsers() {
        var values = [];
        values[0] = "akruczynska";
        values[1] = "brutkowski";
        values[2] = "ejanakowska";
        values[3] = "gstepniewski";
        values[4] = "gszerstobitow";
        values[5] = "jhorodecki";
        values[6] = "kdudziak";
        values[7] = "kmoszczynska";
        values[8] = "lgalinski";
        values[9] = "ljedynak";
        values[10] = "mbartkowiak";
        values[11] = "mchudzinski";
        values[12] = "mgodlewski";
        values[13] = "mkoszarska";
        values[14] = "mmikolajczak";
        values[15] = "mrobak";
        values[16] = "phendrysiak";
        values[17] = "pjanczuk";
        values[18] = "pkonieczka";
        values[19] = "pkrol";
        values[20] = "pzurawski";
        values[21] = "rirla";
        values[22] = "sapolinarski";
        values[23] = "snaroznowska";
        values[24] = "tsulek";
        return values;
    }

    static getOptions(selectedValue, values) {
        var options = [];
        for (var i = 0; i < values.length; i++) {
            var selected = "";
            if (values[i] === selectedValue) {
                selected = "selected";
            }
            options.push("<option value=\"" + values[i] + "\" " + selected + ">" + values[i] + "</option>\n")
        }

        return options.join("");
    }
}