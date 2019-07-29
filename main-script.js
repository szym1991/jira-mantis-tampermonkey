var client = null;

function initializeClient(address, username, password) {
    var mantisInTask = document.getElementById('customfield_10904-val');
    var mantisNumbers = mantisInTask.innerHTML.split(',');
    for(var j=0; j < mantisNumbers.length; j++) {
        var number = mantisNumbers[j].match(/\d+/)[0];
        if (number !== undefined && !isNaN(number)) {
            return new MantisClient(address, username, password, number);
        }
    }
    return null;
}

function addListenerToEdit(fieldId) {
    var inactiveSpan = document.getElementById(fieldId + "-val-inactive");
    var inactiveSpanInner = document.getElementById(fieldId + "-val-inactive-inner");
    var submitBtn = document.getElementById(fieldId + "-btn-submit");
    var cancelBtn = document.getElementById(fieldId + "-btn-cancel");

    inactiveSpan.addEventListener("click", function() {
        var spanInactive = document.getElementById(fieldId + "-val-inactive");
        var spanEdit = document.getElementById(fieldId + "-form");

        spanInactive.style.display = "none";
        spanEdit.style.display = "";
    }, false);

    inactiveSpanInner.addEventListener("click", function() {
        var spanInactive = document.getElementById(fieldId + "-val-inactive");
        var spanEdit = document.getElementById(fieldId + "-form");

        spanInactive.style.display = "none";
        spanEdit.style.display = "";
    }, false);

    submitBtn.addEventListener("click", function() {
        var spanInactive = document.getElementById(fieldId + "-val-inactive");
        var spanEdit = document.getElementById(fieldId + "-form");

        client.task[fieldId] = spanEdit[0].value;
        client.sendEditTask();

        spanInactive.style.display = "";
        spanEdit.style.display = "none";
    }, false);


    cancelBtn.addEventListener("click", function() {
        var spanInactive = document.getElementById(fieldId + "-val-inactive");
        var spanEdit = document.getElementById(fieldId + "-form");

        spanInactive.style.display = "";
        spanEdit.style.display = "none";
    }, false);
}