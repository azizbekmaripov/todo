//Находим элементы на странице

const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];

if (localStorage.getItem('tasks')) {
  tasks = JSON.parse(localStorage.getItem('tasks'));
  console.log(tasks);

}
tasks.forEach((task) => renderTask(task))

checkEmptyList();

form.addEventListener('submit', addTask)
tasksList.addEventListener('click', deleteTask)
tasksList.addEventListener('click', doneTask)


function addTask(event) {
  //Отменяем отправку формы
  event.preventDefault();

  //Достаем текст задачи из поля ввода
  const taskText = taskInput.value

  //Описываем задачу в виде об
  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false
  };

  //Добавляем задачу в массив с задачами
  tasks.push(newTask)

  saveToLocalStorage()

  renderTask(newTask)

  //Очищаем поле ввода и возвращаем на него фокус
  taskInput.value = ""
  taskInput.focus()

  checkEmptyList();

}

function deleteTask(event) {
  //Проверяем если клик был НЕ по кнопке "удалить задачу"
  if (event.target.dataset.action !== 'delete') return;

  //Проверяем что клик был по кнопке "удалить задачу"
  const parenNode = event.target.closest('li');

  //Определяем ID задачу
  const id = Number(parenNode.id)

  //Удаляем задача через фильтирацию массива
  tasks = tasks.filter((task) => {
    if (task.id === id) {
      return false
    } else {
      return true
    }
  })

  saveToLocalStorage();

  //Удаляем задачк из разметки
  parenNode.remove();

  checkEmptyList();

}

function doneTask(event) {
  //Проверяем что клик был НЕ по кнопке "задача выполнена"
  if (event.target.dataset.action !== "done") return

  //Проверяем что клик был по кнопке "задача выполнена"
  const parentNow = event.target.closest('li');

  //Определяем ID задачи
  const id = Number(parentNow.id);

  const task = tasks.find((task) => {
    if (task.id === id) {
      return true
    }
  })
  task.done = !task.done

  saveToLocalStorage();

  const taskTitle = parentNow.querySelector('.task-title');
  taskTitle.classList.toggle('task-title--done');


}

function checkEmptyList() {
  if (tasks.length === 0) {
    const emptyListHTML = `
        <li id="emptyList" class="list-group-item empty-list">
					<img src="./img/todo-icon.svg" alt="Empty" width="48" class="mt-3">
					<div class="empty-list__title">Список дел пуст</div>
				</li>`;
    tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
  }
}

function saveToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask(task) {
  //Формируем CSS класс
  const cssClass = task.done ? "task-title task-title--done" : "task-title"


  //Формируем разметку для новой задачи
  const taskHTML = `
     <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
             <span class="${cssClass}">${task.text}</span>
             <div class="task-item__buttons">
               <button type="button" data-action="done" class="btn-action">
                 <img src="./img/tick.svg" alt="Done" width="18" height="18">
               </button>
               <button type="button" data-action="delete" class="btn-action">
                 <img src="./img/cross.svg" alt="Done" width="18" height="18">
               </button>
             </div>
           </li>`

  //Добавляем задачу на страницу
  tasksList.insertAdjacentHTML('beforeend', taskHTML);
}