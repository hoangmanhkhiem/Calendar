var today = new Date();
var currentMonth = today.getMonth();
var currentYear = today.getFullYear();

// Function to display the current month
function displayMonth(month, year) {
    var firstDay = new Date(year, month, 1);
    var lastDay = new Date(year, month + 1, 0);
    var daysInMonth = lastDay.getDate();

    var calendarBody = document.getElementById("calendarBody");
    calendarBody.innerHTML = "";

    var date = 1;
    fetch('/upload/data.json')
    .then(response => response.json())
    .then(data => {
        let currentDate = new Date();
        for (var i = 0; i < 6; i++) {
            var row = calendarBody.insertRow();
            for (var j = 0; j < 7; j++) {
                if (i === 0 && j < firstDay.getDay()-1) {
                    var cell = row.insertCell();
                    cell.innerHTML = "";
                } else if (date > daysInMonth) {
                    break;
                } else {
                    var cell = row.insertCell();
                    cell.style.height = "100px";
                    cell.innerHTML = date;
                    cell.style.fontSize = "18px";
                    for (var k = 0; k < 5; k++) {
                        let item = data.find(item => {
                            let startDate = new Date(item.ThoiGianBatDau);
                            let endDate = new Date(item.ThoiGianKetThuc);
                            currentDate = new Date(year, month, date);
                            return currentDate >= startDate && currentDate < endDate && item.Thu == j + 2 && item.Ca == k + 1;
                        });
                        let temp;
                        if (item) {
                            var button = document.createElement("button");
                            temp = item.TenLop;
                            temp = temp.split(" ");
                            if(temp[0].length > 3) {
                                temp = temp[0].substring(0, 3) + "..";
                            }
                            else temp = temp[0] + "..";
                            button.innerHTML = temp;
                            button.style.fontSize = "13px";
                            cell.appendChild(button);
                        }
                        else {
                            button = document.createElement("button");
                            button.innerHTML = "";
                            button.style.fontSize = "13px";
                            cell.appendChild(button);
                        }
                        button.onclick = function() {
                            show_data(item.ThoiGianBatDau, item.ThoiGianKetThuc, item.TenLop, item.Thu, item.Ca);
                        }
                    }
                    cell.style.width = "14.28%";
                    date++;
                }
            }
        }
    });
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
    var rows = document.getElementById("calendarBody").rows;
    var today = new Date();
    var date = today.getDate();
    for (var i = 0; i < rows.length; i++) {
        var cells = rows[i].cells;
        for (var j = 0; j < cells.length; j++) {
            if (parseInt(cells[j].innerHTML) === date) {
                cells[j].style.backgroundColor = "#c8f1e1";
            }
        }
    }
}

function show_data(startDate, endDate, TenLop, Thu, Ca) {
    // Fetch data from the server
    fetch('/upload/data.json')
    .then(response => response.json())
    .then(data => {
        for (let i = 0; i < data.length; i++) {
            if(data[i].ThoiGianBatDau == startDate && data[i].ThoiGianKetThuc == endDate && data[i].TenLop == TenLop && data[i].Thu == Thu && data[i].Ca == Ca) {
                var detailWindow = document.createElement("div");
                // thêm icon close
                var close = document.createElement("span");
                close.innerHTML = "&times;";
                close.style.position = "absolute";
                close.style.top = "10px";
                close.style.right = "10px";
                close.style.cursor = "pointer";
                close.onclick = function() {
                    detailWindow.style.display = "none";
                }
                detailWindow.style.position = "fixed";
                detailWindow.style.width = "300px";
                detailWindow.style.height = "400px";
                detailWindow.style.padding = "20px";
                detailWindow.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
                detailWindow.style.border = "1px solid black";
                detailWindow.style.zIndex = "1000";
                detailWindow.style.left = "50%";
                detailWindow.style.top = "50%";
                detailWindow.style.transform = "translate(-50%, -50%)";
                detailWindow.style.display = "none";

                detailWindow.innerHTML = `
                    <h4>${data[i].TenLop}</h4>
                    <strong>Lớp học phần: ${data[i].LopHocPhan}</strong>
                    <p>Thứ: ${data[i].Thu}</p>
                    <p>Ca: ${data[i].Ca}</p>
                    <p>Phòng: ${data[i].PhongHoc}</p>
                    <p>Thời gian bắt đầu: ${data[i].ThoiGianBatDau}</p>
                    <p>Thời gian kết thúc: ${data[i].ThoiGianKetThuc}</p>
                    <button onclick="this.parentElement.style.display = 'none'">Close</button>
                `;
                document.body.appendChild(detailWindow);
                detailWindow.style.display = "block";
            }
        }
    });
}


displayMonth(currentMonth, currentYear);