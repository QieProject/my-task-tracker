let taskSubject = document.getElementById("taskSubject");
let taskTitle = document.getElementById("taskTitle");
let taskCategory = document.getElementById("taskCategory");
let taskSubmitDate = document.getElementById("taskSubmitDate");
let taskDecs = document.getElementById("taskDecs");
let addBtn = document.getElementById("addBtn");
let cancelBtn = document.getElementById("cancelBtn");
let openFormBtn = document.getElementById("openFormBtn");
let modal = document.getElementById("modal");
let modalTitle = document.getElementById("modalTitle");
let taskList = document.getElementById("taskList");
let reminderBox = document.getElementById("reminderBox");

let settingsBtn = document.getElementById("settingsBtn");
let settingsModal = document.getElementById("settingsModal");
let saveSettingsBtn = document.getElementById("saveSettingsBtn");
let cancelSettingsBtn = document.getElementById("cancelSettingsBtn");
let idAssignment = document.getElementById("idAssignment");
let idMeeting = document.getElementById("idMeeting");
let idPresentation = document.getElementById("idPresentation");
let idQuiz = document.getElementById("idQuiz");
let idTest = document.getElementById("idTest");

let helpBtn = document.getElementById("helpBtn");
let helpModal = document.getElementById("helpModal");
let closeHelpBtn = document.getElementById("closeHelpBtn");

let editingIndex = -1;

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let calendarIds = JSON.parse(localStorage.getItem("calendarIds")) || {};

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addCell(row, text) {
  let cell = document.createElement("td");
  cell.textContent = text;
  row.appendChild(cell);
  return cell;
}

function openForm() {
  modal.style.display = "flex";
}

function clearForm() {
  taskSubject.value = "";
  taskTitle.value = "";
  taskCategory.selectedIndex = 0;
  taskSubmitDate.value = "";
  taskDecs.value = "";
  editingIndex = -1;
  addBtn.textContent = "Add New";
  modalTitle.textContent = "Add New Task";
}

function closeForm() {
  modal.style.display = "none";
  clearForm();
}

function openSettings() {
  idAssignment.value = calendarIds["Assignment"] || "";
  idMeeting.value = calendarIds["Meeting"] || "";
  idPresentation.value = calendarIds["Presentation"] || "";
  idQuiz.value = calendarIds["Quiz"] || "";
  idTest.value = calendarIds["Test"] || "";
  settingsModal.style.display = "flex";
}

function closeSettings() {
  settingsModal.style.display = "none";
}

function openHelp() {
  helpModal.style.display = "flex";
}

function closeHelp() {
  helpModal.style.display = "none";
}

function addToCalendar(task) {
  let start = task.date.split("-").join("");

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

  if (tasks.length === 0) {
    let emptyRow = document.createElement("tr");
    let emptyCell = document.createElement("td");
    emptyCell.colSpan = 8;
    emptyCell.className = "empty-msg";
    emptyCell.textContent = "No tasks yet. Tap Add New Task to start.";
    emptyRow.appendChild(emptyCell);
    taskList.appendChild(emptyRow);
  }

  for (let i = 0; i < tasks.length; i++) {
    let row = document.createElement("tr");

    let status = "Not done yet";
    if (tasks[i].done === true) {
      status = "Done";
    }

    let statusCell = addCell(row, "");
    let pill = document.createElement("span");
    pill.textContent = status;
    if (tasks[i].done === true) {
      pill.className = "pill pill-done";
    } else {
      pill.className = "pill pill-pending";
    }
    statusCell.appendChild(pill);

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
      doneBtn.className = "btn-undo";
    } else {
      doneBtn.textContent = "Finish";
      doneBtn.className = "btn-finish";
    }
    doneBtn.onclick = function () {
      tasks[i].done = !tasks[i].done;
      saveTasks();
      showTasks();
    };

    let editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.className = "btn-edit";
    editBtn.onclick = function () {
      taskSubject.value = tasks[i].subject;
      taskTitle.value = tasks[i].title;
      taskCategory.value = tasks[i].category;
      taskSubmitDate.value = tasks[i].date;
      taskDecs.value = tasks[i].description;
      editingIndex = i;
      addBtn.textContent = "Save Changes";
      modalTitle.textContent = "Edit Task";
      openForm();
    };

    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "btn-delete";
    deleteBtn.onclick = function () {
      tasks.splice(i, 1);
      saveTasks();
      showTasks();
    };

    let calBtn = document.createElement("button");
    calBtn.textContent = "Add to Calendar";
    calBtn.className = "btn-calendar";
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

function addGroup(heading, list, colorClass) {
  if (list.length === 0) {
    return;
  }

  let card = document.createElement("div");
  card.className = "reminder-card " + colorClass;

  let h = document.createElement("h3");
  h.textContent = heading + " (" + list.length + ")";
  card.appendChild(h);

  for (let i = 0; i < list.length; i++) {
    let line = document.createElement("p");
    line.textContent = list[i];
    card.appendChild(line);
  }

  reminderBox.appendChild(card);
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

  addGroup("OVERDUE", overdueList, "overdue");
  addGroup("DUE TODAY", todayList, "today");
  addGroup("DUE SOON", soonList, "soon");
}

openFormBtn.onclick = function () {
  clearForm();
  openForm();
};

cancelBtn.onclick = function () {
  closeForm();
};

modal.onclick = function (event) {
  if (event.target === modal) {
    closeForm();
  }
};

settingsBtn.onclick = function () {
  openSettings();
};

cancelSettingsBtn.onclick = function () {
  closeSettings();
};

settingsModal.onclick = function (event) {
  if (event.target === settingsModal) {
    closeSettings();
  }
};

helpBtn.onclick = function () {
  openHelp();
};

closeHelpBtn.onclick = function () {
  closeHelp();
};

helpModal.onclick = function (event) {
  if (event.target === helpModal) {
    closeHelp();
  }
};

saveSettingsBtn.onclick = function () {
  calendarIds = {
    "Assignment": idAssignment.value.trim(),
    "Meeting": idMeeting.value.trim(),
    "Presentation": idPresentation.value.trim(),
    "Quiz": idQuiz.value.trim(),
    "Test": idTest.value.trim()
  };

  localStorage.setItem("calendarIds", JSON.stringify(calendarIds));
  closeSettings();
  alert("Settings saved");
};

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
  closeForm();
};

showTasks();  