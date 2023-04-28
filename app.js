const btnSubmit = document.querySelector(".btn-submit");
const todoList = document.querySelector(".todo-list");
const filterOptions = document.getElementsByName("filter");
!localStorage.getItem("filterBy") ||
localStorage.getItem("filterBy") === "undefined"
  ? window.localStorage.setItem("filterBy", "all")
  : null;

buildTodoList();
filterTodos();
filterOptions.forEach((item) =>
  item.value === localStorage.getItem("filterBy")
    ? (item.checked = true)
    : (item.checked = false)
);

btnSubmit.addEventListener("click", addTodo);
todoList.addEventListener("click", handleTodoClickEvent);
filterOptions.forEach((option) =>
  option.addEventListener("click", filterTodos)
);

function buildTodoList() {
  todoList.innerHTML = "";
  const currentList =
    JSON.parse(window.localStorage.getItem("localTodoList")) || [];
  currentList.forEach((todo) => buildTodoListItem(todo));
}
function addTodo(event) {
  event.preventDefault();
  const todoInput = document.querySelector(".todo-input");
  const newTodo = {
    todoText: todoInput.value,
    completed: false,
    id: new Date().getTime(),
  };
  addTodoToLocalStorage(newTodo);
  buildTodoListItem(newTodo);
  todoInput.value = "";
}

function buildTodoListItem(obj) {
  const todoItem = document.createElement("div");
  todoItem.classList.add("todo-item");
  todoItem.innerHTML = `<p class="todo-content">${obj.todoText}</p><button aria-label="mark complete" class="todo-completed">✓</button><button class="todo-delete">-</button>`;
  obj.completed ? todoItem.classList.add("completed") : null;
  todoItem.dataset.id = obj.id;
  todoList.appendChild(todoItem);
}

function handleTodoClickEvent(e) {
  e.preventDefault();
  const todo = e.target.parentElement;
  if (e.target.classList.contains("todo-delete")) {
    deleteTodo(todo);
  } else if (e.target.classList.contains("todo-completed")) {
    markTodoComplete(todo);
  }
}

function deleteTodo(todo) {
  todo.classList.add("rotate-fade");
  todo.addEventListener("transitionend", () => {
    removeTodoFromLocalStorage(todo);
    todo.remove();
  });
}

function removeTodoFromLocalStorage(todo) {
  const currentList = JSON.parse(window.localStorage.getItem("localTodoList"));
  const newList = currentList.filter(
    (item) => item.id !== parseInt(todo.dataset.id)
  );
  window.localStorage.setItem("localTodoList", JSON.stringify(newList)) || [];
}

function addTodoToLocalStorage(todo) {
  const currentList =
    JSON.parse(window.localStorage.getItem("localTodoList")) || [];
  const newList = [...currentList, todo];
  window.localStorage.setItem("localTodoList", JSON.stringify(newList));
}

function markTodoComplete(todo) {
  todo.children[0].focus();
  todo.classList.toggle("completed");
  const isComplete = todo.classList.contains("completed");
  console.log(isComplete);
  const localTodoList = JSON.parse(
    window.localStorage.getItem("localTodoList")
  );
  localTodoList.forEach((item) => {
    if (item.id === parseInt(todo.dataset.id)) item.completed = isComplete;
  });
  console.log(localTodoList);
  window.localStorage.setItem("localTodoList", JSON.stringify(localTodoList));
}

// FILTER FUNC

function filterTodos() {
  const value = this.value || window.localStorage.getItem("filterBy");
  const todoListItems = document.querySelectorAll(".todo-item");

  todoListItems.forEach((item) =>
    item.value === value ? (item.checked = true) : (item.checked = false)
  );
  switch (value) {
    case "all":
      todoListItems.forEach((item) => (item.style.display = "grid"));
      break;
    case "completed":
      todoListItems.forEach((item) =>
        !item.classList.contains("completed")
          ? (item.style.display = "none")
          : (item.style.display = "grid")
      );
      break;
    case "uncompleted":
      todoListItems.forEach((item) =>
        item.classList.contains("completed")
          ? (item.style.display = "none")
          : (item.style.display = "grid")
      );
      break;
    default:
      todoListItems.forEach((item) => (item.style.display = "grid"));
      break;
  }
}
