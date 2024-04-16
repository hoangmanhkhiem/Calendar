var today = new Date();
var currentMonth = today.getMonth();
var currentYear = today.getFullYear();

// Function to display the current month
function displayMonth(month, year) {
    var firstDay = new Date(year, month, 1);
    var lastDay = new Date(year, month + 1, 0);
    var daysInMonth = lastDay.getDate();

    // document.getElementById("monthYear").innerHTML = firstDay.toLocaleString('default', {month: 'long'}) + " " + year;

    var calendarBody = document.getElementById("calendarBody");
    calendarBody.innerHTML = "";

    var date = 1;
    for (var i = 0; i < 6; i++) {
        var row = calendarBody.insertRow();
        for (var j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay.getDay() - 1) {
                var cell = row.insertCell();
                cell.innerHTML = "";
            } else if (date > daysInMonth) {
                break;
            } else {
                var cell = row.insertCell();
                cell.innerHTML = date;
                date++;
            }
        }
    }
    if (month === today.getMonth() && year === today.getFullYear()) {
        highlightToday();
    }
}

// Function to go to the previous month
function prevMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    displayMonth(currentMonth, currentYear);
}

// Function to go to the next month
function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    displayMonth(currentMonth, currentYear);
}

function selectMonth() {
    var month = document.getElementById("month").value;
    if (month === "-") {
        currentMonth = today.getMonth();
        displayMonth(currentMonth, currentYear);
    } else {
        currentMonth = parseInt(month);
        displayMonth(currentMonth, currentYear);
    }
}

function highlightToday() {
    var today = new Date();
    var date = today.getDate();
    var rows = document.getElementById("calendarBody").rows;
    for (var i = 0; i < rows.length; i++) {
        var cells = rows[i].cells;
        for (var j = 0; j < cells.length; j++) {
            if (cells[j].innerHTML == date) {
                cells[j].style.backgroundColor = "lightblue";
            }
        }
    }
}

function add(name, date, key) {
    var table = document.getElementById("table");
    var row = table.insertRow();
    var cell1 = row.insertCell();
    var cell2 = row.insertCell();
    var cell3 = row.insertCell();
    cell1.innerHTML = name;
    cell2.innerHTML = date;
    cell3.innerHTML = "<button onclick='remove(" + key + ")'>Remove</button>";
}


document.querySelector('.fa-bars').addEventListener('click', function() {
    var menu = document.getElementById('nav-menu');
    if (menu.style.display === 'none') {
        menu.style.display = 'block';
    } else {
        menu.style.display = 'none';
    }
});


displayMonth(currentMonth, currentYear);