const newListForm = document.querySelector("#new-list-form");
const newListInput = document.querySelector("[data-new-list-input]");
const listInput = document.getElementById("new-list-input");
const myLists = document.getElementById("myLists");
const LOCAL_LIST_KEY = "task.list";
const LOCAL_SELECTED_LIST_ID_KEY = "task.selectedListId";
let lists = JSON.parse(localStorage.getItem(LOCAL_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_SELECTED_LIST_ID_KEY);
const deleteListBtn = document.getElementById("delete-list-btn");
const listDisplayContainer = document.querySelector(
  "[data-list-display-container]"
);
const listTitle = document.querySelector("[data-list-title]");
const remainingTaskCount = document.querySelector(
  "[data-remaining-task-count]"
);
const taskItems = document.querySelector("[data-task-items]");
const taskTemplate = document.getElementById("task-template");
const newTaskForm = document.querySelector("[data-new-task-form]");
const newTaskInput = document.querySelector("[data-new-task-input]");
const deleteTaskBtn = document.getElementById("delete-task-btn");

myLists.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "li") {
    selectedListId = e.target.dataset.listId;
    save();
    render();
  }
});

taskItems.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "input") {
    const selectedList = lists.find((list) => list.id === selectedListId);
    const selectedTask = selectedList.tasks.find(
      (task) => task.id === e.target.id
    );
    selectedTask.complete = e.target.checked;
    save();
    renderTaskCount(selectedList);
  }
});

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

newListForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (listInput.value == null || listInput.value === "") return;
  const list = createList(listInput.value);
  listInput.value = null;
  lists.push(list);
  save();
  render();
});

newTaskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (newTaskInput.value == null || newTaskInput.value === "") return;
  const task = createTask(newTaskInput.value);
  newTaskInput.value = null;
  const selectedList = lists.find((list) => list.id === selectedListId);
  selectedList.tasks.push(task);
  save();
  render();
});

function createList(name) {
  return {
    id: Date.now().toString(),
    name: name,
    tasks: [],
  };
}

function createTask(name) {
  return {
    id: Date.now().toString(),
    name: name,
    complete: false,
  };
}

function save() {
  localStorage.setItem(LOCAL_LIST_KEY, JSON.stringify(lists));
  localStorage.setItem(LOCAL_SELECTED_LIST_ID_KEY, selectedListId);
}

function render() {
  clearElement(myLists);
  renderLists();

  const selectedList = lists.find((list) => list.id === selectedListId);
  if (selectedListId == null) {
    listDisplayContainer.style.display = "none";
  } else {
    listDisplayContainer.style.display = "";
    listTitle.innerHTML = selectedList.name;
    renderTaskCount(selectedList);
    clearElement(taskItems);
    renderTasks(selectedList);
  }
}

function renderTasks(selectedList) {
  selectedList.tasks.forEach((task) => {
    const taskElement = document.importNode(taskTemplate.content, true);
    const checkbox = taskElement.querySelector("input");
    checkbox.id = task.id;
    checkbox.checked = task.complete;
    const label = taskElement.querySelector("label");
    label.htmlFor = task.id;
    label.append(task.name);
    taskItems.appendChild(taskElement);
  });
}

function renderTaskCount(selectedList) {
  const incompleteTaskCount = selectedList.tasks.filter(
    (task) => !task.complete
  ).length;
  const taskString = incompleteTaskCount === 1 ? "task" : "tasks";
  remainingTaskCount.innerHTML = `${incompleteTaskCount} ${taskString} left`;
}

function renderLists() {
  lists.forEach((list) => {
    const listElement = document.createElement("li");
    listElement.dataset.listId = list.id;
    listElement.classList.add("list-name");
    listElement.textContent = list.name;
    if (list.id === selectedListId) {
      listElement.classList.add("active-list");
    }
    myLists.appendChild(listElement);
  });
}

render();

deleteListBtn.addEventListener("click", (e) => {
  lists = lists.filter((list) => list.id !== selectedListId);
  selectedListId = null;
  save();
  render();
});

deleteTaskBtn.addEventListener("click", (e) => {
  const selectedList = lists.find((list) => list.id === selectedListId);
  selectedList.tasks = selectedList.tasks.filter((task) => !task.complete);
  save();
  render();
});
