const STORAGE_KEY = 'kanban-tasks';

let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const columnSelect = document.getElementById('task-column');

const lists = {
  todo: document.getElementById('todo-list'),
  inprogress: document.getElementById('inprogress-list'),
  done: document.getElementById('done-list')
};

const counts = {
  todo: document.getElementById('todo-count'),
  inprogress: document.getElementById('inprogress-count'),
  done: document.getElementById('done-count')
};

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function createCard(task) {
  const card = document.createElement('div');
  card.className = 'task-card';
  card.draggable = true;
  card.dataset.id = task.id;

  const text = document.createElement('p');
  text.textContent = task.text;
  card.appendChild(text);

  const actions = document.createElement('div');
  actions.className = 'task-actions';

  const editBtn = document.createElement('button');
  editBtn.textContent = 'Edit';
  editBtn.addEventListener('click', () => editTask(task.id));

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.addEventListener('click', () => deleteTask(task.id));

  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);
  card.appendChild(actions);

  card.addEventListener('dragstart', () => {
    card.classList.add('dragging');
  });

  card.addEventListener('dragend', () => {
    card.classList.remove('dragging');
  });

  return card;
}

function render() {
  Object.values(lists).forEach(list => {
    list.innerHTML = '';
  });

  const totals = { todo: 0, inprogress: 0, done: 0 };

  tasks.forEach(task => {
    lists[task.column].appendChild(createCard(task));
    totals[task.column]++;
  });

  Object.keys(counts).forEach(column => {
    counts[column].textContent = totals[column];
  });
}

function addTask(text, column) {
  tasks.push({
    id: Date.now().toString(),
    text: text,
    column: column
  });
  saveTasks();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  render();
}

function editTask(id) {
  const task = tasks.find(task => task.id === id);
  const newText = prompt('Edit task:', task.text);

  if (newText !== null && newText.trim() !== '') {
    task.text = newText.trim();
    saveTasks();
    render();
  }
}

form.addEventListener('submit', event => {
  event.preventDefault();
  const text = input.value.trim();

  if (text === '') {
    return;
  }

  addTask(text, columnSelect.value);
  input.value = '';
  input.focus();
});

Object.entries(lists).forEach(([column, list]) => {
  list.addEventListener('dragover', event => {
    event.preventDefault();
    list.classList.add('drag-over');
  });

  list.addEventListener('dragleave', () => {
    list.classList.remove('drag-over');
  });

  list.addEventListener('drop', event => {
    event.preventDefault();
    list.classList.remove('drag-over');

    const dragging = document.querySelector('.dragging');
    if (!dragging) {
      return;
    }

    const task = tasks.find(task => task.id === dragging.dataset.id);
    task.column = column;
    saveTasks();
    render();
  });
});

render();
