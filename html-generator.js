class HtmlGenerator {
    static createMantisInfo(task) {
        return "<div id=\"mantis-module\" class=\"module toggle-wrap\">\n" +
                "    <div id=\"mantis-module_heading\" class=\"mod-header\">\n" +
                "        <ul class=\"ops\"></ul>\n" +
                "        <h2 class=\"toggle-title\">Mantis Info</h2></div>\n" +
                "    <div class=\"mod-content\">\n" +
                "        <ul id=\"mantisdetails\" class=\"property-list two-cols\">\n" +
                "            <li class=\"item\">\n" +
                "                <div class=\"wrap\">\n" +
                "                    <strong class=\"name\">Dealer:</strong>\n" +
                "                    <span id=\"dealer-val\" class=\"value\">\n" +
                task.projectName +
                "                    </span>\n" +
                "                </div>\n" +
                "            </li>\n" +
                "            <li class=\"item item-right\">\n" +
                "                <div class=\"wrap\">\n" +
                "                    <strong class=\"name\">Reporter:</strong>\n" +
                "                    <span id=\"reporter-val\" class=\"value\">\n" +
                task.reporter +
                "                    </span>\n" +
                "                </div>\n" +
                "            </li>\n" +
                "            <li class=\"item\">\n" +
                "                <div class=\"wrap\">\n" +
                "                    <strong class=\"name\">Priority:</strong>\n" +
                "                    <span id=\"priority-val\" class=\"value\">\n" +
                task.severity +
                "                    </span>\n" +
                "                </div>\n" +
                "            </li>\n" +
                "            <li class=\"item item-right\">\n" +
                "                <div class=\"wrap\">\n" +
                "                    <strong class=\"name\">Category:</strong>\n" +
                "                    <span id=\"category-val\" class=\"value editable-field active\">\n" +
                "<form id=\"category-form\" class=\"ajs-dirty-warning-exempt aui\" action=\"#\">\n" +
                "    <select id=\"category\" name=\"category\" class=\"single-user-picker js-assignee-picker aui-ss-select\"\n" +
                "            data-show-dropdown-button=\"true\" data-container-class=\"long-field\"\n" +
                "            multiple=\"multiple\" style=\"display: none;\">\n" +
                "        <option value=\"Błąd\">Błąd</option>\n" +
                "        <option value=\"Konsultacja\">Konsultacja</option>\n" +
                "    </select>\n" +
                "    <div class=\"save-options\" tabindex=\"1\">\n" +
                "        <button type=\"submit\" class=\"aui-button submit\"><span\n" +
                "                class=\"aui-icon aui-icon-small aui-iconfont-success\">Save</span></button>\n" +
                "        <button type=\"cancel\" class=\"aui-button cancel\"><span\n" +
                "                class=\"aui-icon aui-icon-small aui-iconfont-close-dialog\">Cancel</span></button>\n" +
                "    </div>\n" +
                "</form>" +
                "                    </span>\n" +
                "                </div>\n" +
                "            </li>\n" +
                "            <li class=\"item\">\n" +
                "                <div class=\"wrap\">\n" +
                "                    <strong class=\"name\">Status:</strong>\n" +
                "                    <span id=\"status-val\" class=\"value\">\n" +
                task.status +
                "                    </span>\n" +
                "                </div>\n" +
                "            </li>\n" +
                "            <li class=\"item item-right\">\n" +
                "                <div class=\"wrap\">\n" +
                "                    <strong class=\"name\">Assignee:</strong>\n" +
                "                    <span id=\"assignee-val\" class=\"value\">\n" +
                task.assignee +
                "                    </span>\n" +
                "                </div>\n" +
                "            </li>\n" +
                "            <li class=\"item\">\n" +
                "                <div class=\"wrap\">\n" +
                "                    <strong class=\"name\">Date:</strong>\n" +
                "                    <span id=\"date-val\" class=\"value\">\n" +
                task.dateSubmitted +
                "                    </span>\n" +
                "                </div>\n" +
                "            </li>\n" +
                "        </ul>\n" +
                "    </div>\n" +
                "</div>";
    }
}
