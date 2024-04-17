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
    let check = 0;
    var date = 1;
    fetch('/upload/data.json')
        .then(response => response.json())
        .then(data => {
            let currentDate = new Date();
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
                        cell.style.height = "100px";
                        var total = document.createElement("div");
                        total.className = "total";
                        total.style.height = "20px";
                        total.style.margin = "5px";
                        total.innerHTML = date;
                        total.style.fontSize = "18px";
                        cell.appendChild(total);
                        var downcell = document.createElement("div");
                        downcell.className = "downcell";
                        let m = 0;
                        for (var k = 0; k < 5; k++) {
                            let item = data.find(item => {
                                let startDate = new Date(item.ThoiGianBatDau);
                                let endDate = new Date(item.ThoiGianKetThuc);
                                currentDate = new Date(year, month, date);
                                return currentDate >= startDate && currentDate < endDate && item.Thu == j + 2 && item.Ca == k + 1;
                            });
                            let temp;
                            if (item) {
                                var button = document.createElement("span");
                                temp = item.TenLop;
                                button.style = "width = 100%;line-height: 1.6rem;overflow: hidden;display: -webkit-box;-webkit-line-clamp: 1;-webkit-box-orient: vertical;cursor: pointer;";
                                button.innerHTML = temp;
                                button.style.fontSize = "13px";
                                downcell.appendChild(button);
                            } else {
                                button = document.createElement("span");
                                button.innerHTML = " ";
                                button.style.fontSize = "13px";
                                button.style.backgroundColor = "white";
                                downcell.appendChild(button);
                                m++;
                            }
                            if (m < 5) {
                                downcell.style.height = "120px";
                                downcell.style.overflow = "auto";
                            }
                            cell.appendChild(downcell);
                            button.onclick = function () {
                                closeDetailWindow();
                                show_data(item.ThoiGianBatDau, item.ThoiGianKetThuc, item.TenLop, item.Thu, item.Ca);
                            }
                        }
                        cell.style.width = "14.28%";
                        date++;
                    }
                    if (month === today.getMonth() && year === today.getFullYear() && date === today.getDate() + 1 && check === 0) {
                        cell.style.backgroundColor = "rgba(82,74,74,0.2)";
                        let f = j;
                        thu = document.getElementById(f.toString());
                        thu.style.backgroundColor = "rgba(82,74,74,0.2)";
                        check = 1;
                    }
                }
            }
        });
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

function show_data(startDate, endDate, TenLop, Thu, Ca) {
    // Fetch data from the server
    fetch('/upload/data.json')
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                if (data[i].ThoiGianBatDau == startDate && data[i].ThoiGianKetThuc == endDate && data[i].TenLop == TenLop && data[i].Thu == Thu && data[i].Ca == Ca) {
                    var detailWindow = document.createElement("div");
                    detailWindow.className = "detailWindow";
                    var close = document.createElement("span");
                    close.innerHTML = "&times;";
                    close.style.position = "absolute";
                    close.style.top = "10px";
                    close.style.right = "10px";
                    close.style.cursor = "pointer";
                    close.onclick = function () {
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
                    detailWindow.appendChild(close);

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
                    break;
                }
            }
        });
}

function closeDetailWindow() {
    var detailWindow = document.getElementsByClassName("detailWindow");
    for (let i = 0; i < detailWindow.length; i++) {
        detailWindow[i].style.display = "none";
    }
}

displayMonth(currentMonth, currentYear);
