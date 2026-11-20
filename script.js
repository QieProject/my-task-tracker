let taskSubject = document.getElementById("taskSubject");
let taskTitle = document.getElementById("taskTitle");
let taskCategory = document.getElementById("taskCategory");
let taskSubmitDate = document.getElementById("taskSubmitDate");
let taskDecs = document.getElementById("taskDecs");
let addBtn = document.getElementById("addBtn");
let taskList = document.getElementById("taskList");
let notifyBtn = document.getElementById("notifyBtn");
let reminderBox = document.getElementById("reminderBox");
let editingIndex = -1;

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addCell(row, text) {
  let cell = document.createElement("td");
  cell.textContent = text;
  row.appendChild(cell);
  return cell;
}

function clearForm() {
  taskSubject.value = "";
  taskTitle.value = "";
  taskSubmitDate.value = "";
  taskDecs.value = "";
  editingIndex = -1;
  addBtn.textContent = "Add New";
}

let calendarIds = {
  "Assignment": "dc62c72892dc3caac2113d0004b8a6ea589145d2e77803b6cab99c5ae90324c4@group.calendar.google.com",
  "Meeting": "399b942bced56b09583aeaf16206df69cc098698819af951730c04f0adf435fb@group.calendar.google.com",
  "Presentation": "989434a62e24a3539ad6bcf463808534854964a3bab48d3821add073067b0173@group.calendar.google.com",
  "Quiz": "3d2f384b54c3bf70e288714fb8882b8accb2e4b84f97049cdced836333885f61@group.calendar.google.com",
  "Test": "b06c0edb1200baa11512a6b41e26ee5f2a43666b6579945e09801f374429e0f8@group.calendar.google.com",
  "Other": ""
};

function addToCalendar(task) {
  let startDate = task.date;

  if (task.dateAdded) {
    let dayAfterAdded = new Date(task.dateAdded);
    dayAfterAdded.setUTCDate(dayAfterAdded.getUTCDate() + 1);
    startDate = dayAfterAdded.toISOString().slice(0, 10);

    if (startDate > task.date) {
      startDate = task.date;
    }
  }

  let start = startDate.split("-").join("");

  let nextDay = new Date(task.date);
  nextDay.setUTCDate(nextDay.getUTCDate() + 1);
  let end = nextDay.toISOString().slice(0, 10).split("-").join("");

  let url = "https://calendar.google.com/calendar/render?action=TEMPLATE";
  url += "&text=" + encodeURIComponent(task.title + " (" + task.subject + ")");
  url += "&dates=" + start + "/" + end;
  url += "&details=" + encodeURIComponent(task.category + " - " + task.description);

  let calId = calendarIds[task.category];
  if (calId) {
    url += "&src=" + encodeURIComponent(calId);
  }

  window.open(url, "_blank");
}

function showTasks() {
  tasks.sort(function (a, b) {
    if (a.date < b.date) return -1;
    if (a.date > b.date) return 1;
    return 0;
  });

  taskList.innerHTML = "";

  for (let i = 0; i < tasks.length; i++) {
    let row = document.createElement("tr");

    let status = "Not done yet";
    if (tasks[i].done === true) {
      status = "Done";
    }

    addCell(row, status);
    addCell(row, tasks[i].date);
    addCell(row, tasks[i].subject);
    addCell(row, tasks[i].title);
    addCell(row, tasks[i].category);
    addCell(row, tasks[i].description);
    addCell(row, tasks[i].dateAdded);

    let actionCell = document.createElement("td");

    let doneBtn = document.createElement("button");
    if (tasks[i].done === true) {
      doneBtn.textContent = "Undo";
    } else {
      doneBtn.textContent = "Finish";
    }
    doneBtn.onclick = function () {
      tasks[i].done = !tasks[i].done;
      saveTasks();
      showTasks();
    };

    let editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.onclick = function () {
      taskSubject.value = tasks[i].subject;
      taskTitle.value = tasks[i].title;
      taskCategory.value = tasks[i].category;
      taskSubmitDate.value = tasks[i].date;
      taskDecs.value = tasks[i].description;
      editingIndex = i;
      addBtn.textContent = "Save Changes";
    };

    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = function () {
      tasks.splice(i, 1);
      clearForm();
      saveTasks();
      showTasks();
    };

    let calBtn = document.createElement("button");
    calBtn.textContent = "Add to Calendar";
    calBtn.onclick = function () {
      addToCalendar(tasks[i]);
    };

    actionCell.appendChild(doneBtn);
    actionCell.appendChild(editBtn);
    actionCell.appendChild(deleteBtn);
    actionCell.appendChild(calBtn);
    row.appendChild(actionCell);

    taskList.appendChild(row);
  }

  showReminder();
}

/*function notifyUser() {
  if (!("Notification" in window)) {
    return;
  }
  if (Notification.permission !== "granted") {
    return;
  }

  let today = new Date().toLocaleDateString("en-CA");
  let overdue = 0;
  let dueToday = 0;
  let dueSoon = 0;

  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].done !== true) {
      let diff = (new Date(tasks[i].date) - new Date(today)) / (1000 * 60 * 60 * 24);

      if (diff < 0) {
        overdue++;
      } else if (diff === 0) {
        dueToday++;
      } else if (diff <= 3) {
        dueSoon++;
      }
    }
  }

  if (overdue + dueToday + dueSoon === 0) {
    return;
  }

  let message = overdue + " overdue, " + dueToday + " due today, " + dueSoon + " due soon";

  navigator.serviceWorker.ready.then(function (reg) {
    reg.showNotification("My Task Tracker", { body: message });
  });
}

notifyBtn.onclick = function () {
  Notification.requestPermission().then(function (result) {
    if (result === "granted") {
      alert("Notification enabled");
      notifyUser();
    } else {
      alert("Notification not allowed");
    }
  });
};*/

function addGroup(heading, list) {
  if (list.length === 0) {
    return;
  }

  let h = document.createElement("p");
  h.textContent = heading;
  h.style.fontWeight = "bold";
  reminderBox.appendChild(h);

  for (let i = 0; i < list.length; i++) {
    let line = document.createElement("p");
    line.textContent = "- " + list[i];
    reminderBox.appendChild(line);
  }
}

function showReminder() {
  reminderBox.innerHTML = "";

  let today = new Date().toLocaleDateString("en-CA");

  let overdueList = [];
  let todayList = [];
  let soonList = [];

  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].done !== true) {
      let diff = (new Date(tasks[i].date) - new Date(today)) / (1000 * 60 * 60 * 24);
      let text = tasks[i].title + " (" + tasks[i].subject + ")";

      if (diff < 0) {
        overdueList.push(text);
      } else if (diff === 0) {
        todayList.push(text);
      } else if (diff <= 3) {
        soonList.push(text + " - " + diff + " day(s) left");
      }
    }
  }

  addGroup("OVERDUE:", overdueList);
  addGroup("DUE TODAY:", todayList);
  addGroup("DUE SOON:", soonList);
}

addBtn.onclick = function () {
  let subject = taskSubject.value;
  let title = taskTitle.value;
  let category = taskCategory.value;
  let taskDate = taskSubmitDate.value;
  let description = taskDecs.value;

  if (subject.trim() == "" || title.trim() == "" || category.trim() == "" || taskDate.trim() == "" || description.trim() == "") {
    alert("Please enter all details");
    return;
  }

  if (editingIndex === -1) {
    let dateAdded = new Date().toLocaleDateString("en-CA");

    tasks.push({
      subject: subject,
      title: title,
      category: category,
      date: taskDate,
      description: description,
      dateAdded: dateAdded,
      done: false
    });
  } else {
    tasks[editingIndex].subject = subject;
    tasks[editingIndex].title = title;
    tasks[editingIndex].category = category;
    tasks[editingIndex].date = taskDate;
    tasks[editingIndex].description = description;
  }

  saveTasks();
  showTasks();
  clearForm();
};

showTasks();
//notifyUser();