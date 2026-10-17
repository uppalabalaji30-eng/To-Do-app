const todayDate = document.getElementById("todayDate");
const quote = document.getElementById("quote");
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskTime = document.getElementById("taskTime");
const taskList = document.getElementById("taskList");
const clearBtn = document.getElementById("clearBtn");
const themeBtn = document.getElementById("themeBtn");
const quotes = [
    "Believe you can and you're halfway there.",
    "Small steps every day lead to big results.",
    "Success is the sum of small efforts repeated daily.",
    "Don't wait for opportunity. Create it.",
    "Your future depends on what you do today.",
    "Great things take time. Keep going!",
    "Every day is a fresh start."
];
function displayDate() {
    const today = new Date();
    todayDate.textContent = today.toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}
function displayQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    quote.textContent = quotes[randomIndex];
}
let tasks = [];
try {
    const savedTasks = JSON.parse(localStorage.getItem("myTasks") || "[]");
    if (Array.isArray(savedTasks)) {
        tasks = savedTasks.filter(
            task =>
                task &&
                typeof task.id === "string" &&
                typeof task.text === "string" &&
                typeof task.time === "string" &&
                typeof task.completed === "boolean"
        );
    }
} catch (error) {
    tasks = [];
}
function saveTasks() {
    localStorage.setItem("myTasks", JSON.stringify(tasks));
}
function renderTasks() {
    taskList.replaceChildren();
    tasks.forEach(task => {
        const li = document.createElement("li");
        li.className = "task-item";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", `Complete ${task.text}`);
        const taskText = document.createElement("span");
        taskText.textContent = task.text;
        taskText.className = "task-text";
        if (task.completed) {
            taskText.classList.add("completed");
        }
        const timeText = document.createElement("span");
        timeText.className = "task-time";
        if (task.time) {
            const [hours, minutes] = task.time.split(":");
            const date = new Date();
            date.setHours(Number(hours), Number(minutes), 0, 0);
            timeText.textContent = date.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            });
        }
        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });
        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";
        deleteBtn.setAttribute("aria-label", `Delete ${task.text}`);
        deleteBtn.addEventListener("click", () => {
            tasks = tasks.filter(item => item.id !== task.id);
            saveTasks();
            renderTasks();
        });
        li.append(checkbox, taskText, timeText, deleteBtn);
        taskList.appendChild(li);
    });
}
taskForm.addEventListener("submit", event => {
    event.preventDefault();
    const text = taskInput.value.trim();
    const time = taskTime.value;
    if (!text) {
        taskInput.focus();
        return;
    }
    const newTask = {
        id: crypto.randomUUID(),
        text: text,
        time: time,
        completed: false
    };
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskForm.reset();
    taskInput.focus();
});
clearBtn.addEventListener("click", () => {
    if (tasks.length === 0) {
        alert("There are no tasks to clear!");
        return;
    }
    const confirmed = confirm("Are you sure you want to delete all tasks?");
    if (confirmed) {
        tasks = [];
        saveTasks();
        renderTasks();
    }
});
function setTheme(isDark) {
    document.body.classList.toggle("dark-mode", isDark);
    themeBtn.textContent = isDark
        ? "☀️ Light mode"
        : "🌙 Dark mode";
    themeBtn.setAttribute("aria-pressed", String(isDark));
    localStorage.setItem("myTheme", isDark ? "dark" : "light");
}
themeBtn.addEventListener("click", () => {
    const isDark = document.body.classList.contains("dark-mode");
    setTheme(!isDark);
});
setTheme(localStorage.getItem("myTheme") === "dark");
displayDate();
displayQuote();
renderTasks();
