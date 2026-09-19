import { createAction, createReducer, createStore } from '../dist/index.mjs';

const addTask = createAction('task/added');
const toggleTask = createAction('task/toggled');
const removeTask = createAction('task/removed');
const setFilter = createAction('view/filtered');
const resetSample = createAction('sample/reset');

const sampleTasks = [
  { id: 1, text: 'Review the release checklist', done: true },
  { id: 2, text: 'Test the package from a clean folder', done: false },
  { id: 3, text: 'Share the demo with a teammate', done: false },
];
const initialState = () => ({
  tasks: sampleTasks.map((task) => ({ ...task })),
  filter: 'all',
  nextId: 4,
});

const reducer = createReducer(initialState(), {
  [addTask.type]: (state, action) => ({
    ...state,
    nextId: state.nextId + 1,
    tasks: [...state.tasks, { id: state.nextId, text: action.payload, done: false }],
  }),
  [toggleTask.type]: (state, action) => ({
    ...state,
    tasks: state.tasks.map((task) => task.id === action.payload
      ? { ...task, done: !task.done } : task),
  }),
  [removeTask.type]: (state, action) => ({
    ...state,
    tasks: state.tasks.filter((task) => task.id !== action.payload),
  }),
  [setFilter.type]: (state, action) => ({ ...state, filter: action.payload }),
  [resetSample.type]: () => initialState(),
});
const store = createStore(reducer, initialState());

const selectCounts = (state) => {
  const done = state.tasks.filter((task) => task.done).length;
  return { total: state.tasks.length, done, open: state.tasks.length - done };
};
const selectVisibleTasks = (state) => state.tasks.filter((task) =>
  state.filter === 'all' || (state.filter === 'done' ? task.done : !task.done));

const taskList = document.getElementById('taskList');
const taskInput = document.getElementById('taskInput');
const formFeedback = document.getElementById('formFeedback');
const emptyMessage = document.getElementById('emptyMessage');
const filterButtons = [...document.querySelectorAll('[data-filter]')];
const eventList = document.getElementById('eventList');
const traceHint = document.getElementById('traceHint');
const observerButton = document.getElementById('observerButton');
const observerStatus = document.getElementById('observerStatus');
const history = [];
let lastAction = 'sample/loaded';

function dispatch(action) {
  lastAction = action.type;
  store.dispatch(action);
}

function renderList() {
  const { filter } = store.getState();
  const visible = store.select(selectVisibleTasks);
  const fragment = document.createDocumentFragment();

  for (const task of visible) {
    const row = document.createElement('li');
    row.className = `workbench-task${task.done ? ' is-done' : ''}`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-check';
    checkbox.id = `workbench-task-${task.id}`;
    checkbox.dataset.taskId = String(task.id);
    checkbox.checked = task.done;
    checkbox.addEventListener('change', () => {
      dispatch(toggleTask(task.id));
      const nextFocus = document.getElementById(checkbox.id)
        ?? document.querySelector('[data-filter][aria-pressed="true"]');
      nextFocus?.focus();
    });

    const label = document.createElement('label');
    label.htmlFor = checkbox.id;
    label.textContent = task.text;

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'text-button';
    remove.textContent = 'Remove';
    remove.setAttribute('aria-label', `Remove ${task.text}`);
    remove.addEventListener('click', () => {
      dispatch(removeTask(task.id));
      taskInput.focus();
    });
    row.append(checkbox, label, remove);
    fragment.append(row);
  }
  taskList.replaceChildren(fragment);
  emptyMessage.hidden = visible.length !== 0;
  for (const button of filterButtons) {
    button.setAttribute('aria-pressed', String(button.dataset.filter === filter));
  }
}

function renderSummary() {
  const { total, done, open } = store.select(selectCounts);
  document.getElementById('allCount').textContent = String(total);
  document.getElementById('openCount').textContent = String(open);
  document.getElementById('doneCount').textContent = String(done);
  document.getElementById('remainingCount').textContent = String(open);
  document.getElementById('completedCount').textContent = String(done);
  document.getElementById('progressText').textContent = `${done} of ${total} tasks complete`;
  const percent = total === 0 ? 0 : Math.round(done / total * 100);
  document.getElementById('progressFill').style.width = `${percent}%`;
  document.querySelector('.progress-track').setAttribute('aria-valuenow', String(percent));
  document.getElementById('stateOutput').textContent = JSON.stringify(store.getState(), null, 2);
}

function renderTrace() {
  const fragment = document.createDocumentFragment();
  for (const entry of history) {
    const row = document.createElement('li');
    const code = document.createElement('code');
    code.textContent = entry.action;
    const note = document.createElement('span');
    note.textContent = `${entry.open} open · ${entry.done} done`;
    row.append(code, note);
    fragment.append(row);
  }
  eventList.replaceChildren(fragment);
  traceHint.hidden = history.length > 0;
}

function observe() {
  const { open, done } = store.select(selectCounts);
  history.unshift({ action: lastAction, open, done });
  history.length = Math.min(history.length, 5);
  renderTrace();
}

store.subscribe(renderList);
store.subscribe(renderSummary);
let unsubscribeObserver = store.subscribe(observe);

document.getElementById('taskForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const text = taskInput.value.trim();
  if (!text) {
    formFeedback.textContent = 'Enter a task before adding it.';
    taskInput.focus();
    return;
  }
  formFeedback.textContent = '';
  dispatch(addTask(text));
  taskInput.value = '';
  taskInput.focus();
});

for (const button of filterButtons) {
  button.addEventListener('click', () => {
    dispatch(setFilter(button.dataset.filter));
    button.focus();
  });
}

document.getElementById('resetButton').addEventListener('click', () => {
  history.length = 0;
  dispatch(resetSample());
  renderTrace();
  formFeedback.textContent = '';
  taskInput.value = '';
  taskInput.focus();
});

observerButton.addEventListener('click', () => {
  if (unsubscribeObserver) {
    unsubscribeObserver();
    unsubscribeObserver = null;
    observerButton.textContent = 'Resume';
    observerStatus.textContent = 'Observer paused';
    observerStatus.parentElement.classList.add('is-paused');
  } else {
    unsubscribeObserver = store.subscribe(observe);
    observerButton.textContent = 'Pause';
    observerStatus.textContent = 'Observer subscribed';
    observerStatus.parentElement.classList.remove('is-paused');
  }
  observerButton.focus();
});

renderList();
renderSummary();
renderTrace();
