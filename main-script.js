var client = null;

function setClient(address, username, password) {
    if (client !== null) {
        updateTask();
        return;
    }
    client = initializeClient(address, username, password);
    if (client !== null) {
        client.getTask();
    }
}

function initializeClient(address, username, password) {
    var number = getTaskIdFromJira();
    if (number !== null) {
        return new MantisClient(address, username, password, number);
    }
    return null;
}

function getTaskIdFromJira() {
    var mantisInTask = document.getElementById('customfield_10904-val');
    if (mantisInTask === null) {
        return null;
    }
    var mantisNumbers = mantisInTask.innerHTML.split(',');
    for(var j=0; j < mantisNumbers.length; j++) {
        var number = mantisNumbers[j].match(/\d+/)[0];
        if (number !== undefined && !isNaN(number)) {
            return number;
        }
    }
    return null;
}

function updateTask() {
    var number = getTaskIdFromJira();
    if (number !== null && client.taskId !== number) {
        client.taskId = number;
        client.getTask();
    }
}

function addListenerToEdit(client, fieldId) {
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

        if (client.task[fieldId] instanceof ObjectRef ||
            client.task[fieldId] instanceof AccountData) {
            client.task[fieldId].id = spanEdit[0].value;
            client.task[fieldId].value = spanEdit[0].options[spanEdit[0].selectedIndex].innerHTML;
        } else {
            client.task[fieldId] = spanEdit[0].value;
        }
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