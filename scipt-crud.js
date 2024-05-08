const buttonAddTask = document.querySelector(".app__button--add-task");
const formAddTask = document.querySelector(".app__form-add-task");
const textArea = document.querySelector(".app__form-textarea");
const ulTasks = document.querySelector(".app__section-task-list");
const deleteButton = document.querySelector(".app__form-footer__button--delete");
const cleanButton = document.querySelector(".app__form-footer__button--cancel");
const paragraphDescriptionTask = document.querySelector(".app__section-active-task-description");
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const removeButtonCompleted = document.querySelector("#btn-remove-completed");
const buttonRemoveAll = document.querySelector("#btn-remove-all");

let selectedTask = null;
let liSelectedTask = null;

function remove() {
    formAddTask.classList.add("hidden");
    textArea.value = "";
}

function clean() {
    textArea.value = "";
}

deleteButton.addEventListener("click", () => {
    remove();
})

cleanButton.addEventListener("click", () => {
    clean();
})

function updateTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function createTaskElement(task) {
    const li = document.createElement("li");
    li.classList.add('app__section-task-list-item');

    const svg = document.createElement("svg");
    svg.innerHTML = `
    <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z"
                fill="#01080E"></path>
        </svg>
    `
    const paragraph = document.createElement("paragraph");
    paragraph.textContent = task.description;
    paragraph.classList.add('app__section-task-list-item-description');


    const button = document.createElement("button");
    button.classList.add("app_button-edit");

    button.onclick = () => {
        const newDescription = prompt("Informe o novo nome da tarefa: ");
        console.log("Nova descrição da tarefa: ", newDescription);
        if (newDescription) {
            paragraph.textContent = newDescription;
            task.description = newDescription;
            updateTasks();
        }
    }

    const imgButton = document.createElement("img");
    imgButton.setAttribute("src", "/imagens/edit.png");
    button.append(imgButton);

    li.append(svg);
    li.append(paragraph);
    li.append(button);

    if (task.complete) {
        li.classList.add("app__section-task-list-item-complete");
        button.setAttribute("disabled", "disabled");
    } else {
        li.onclick = () => {
            document.querySelectorAll(".app__section-task-list-item-active")
                .forEach(element => {
                    element.classList.remove("app__section-task-list-item-active");
                })
            if (selectedTask == task) {
                paragraphDescriptionTask.textContent = "";
                selectedTask = null;
                liSelectedTask = null;
                return;
            }
            selectedTask = task;
            liSelectedTask = li;
            paragraphDescriptionTask.textContent = task.description;
            li.classList.add("app__section-task-list-item-active");
        }
    }

    return li;
}

buttonAddTask.addEventListener("click", () => {
    formAddTask.classList.toggle("hidden");
})

formAddTask.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const task = {
        description: textArea.value
    }
    tasks.push(task);
    const taskElement = createTaskElement(task);
    ulTasks.append(taskElement);
    updateTasks();
    textArea.value = "";
    formAddTask.classList.add("hidden");
})

tasks.forEach(task => {
    const taskElement = createTaskElement(task);
    ulTasks.append(taskElement);
})

document.addEventListener("focusFinished", () => {
    if (selectedTask && liSelectedTask) {
        liSelectedTask.classList.remove("app__section-task-list-item-active");
        liSelectedTask.classList.add("app__section-task-list-item-complete");
        liSelectedTask.querySelector("button").setAttribute("disabled", "disabled");
        selectedTask.complete = true;
        updateTasks();
    }
})

const removeTasks = (onlyComplete) => {
    const selector = onlyComplete ? ".app__section-task-list-item-complete" : ".app__section-task-list-item";
    document.querySelectorAll(selector).forEach(element => {
        element.remove();
    })
    tasks = onlyComplete ? tasks.filter(task => !task.complete) : [];
    updateTasks();

    const noTasksRemaining = tasks.length === 0;
    const noCompletedTasksRemaining = tasks.every(task => !task.complete);
    if (onlyComplete && noCompletedTasksRemaining || !onlyComplete && noTasksRemaining) {
        paragraphDescriptionTask.textContent = "";
    }
}

removeButtonCompleted.onclick = () => removeTasks(true);
buttonRemoveAll.onclick = () => removeTasks(false);

