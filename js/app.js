class TaskManager {
    constructor() {
        this.tasks = this.loadTasks();
        this.currentFilter = 'all';
        this.init();
    }
e
    loadTasks() {
        try {
            return JSON.parse(localStorage.getItem('tasks')) || [];
        } catch {
            return [];
        }
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    addTask(text) {
        const trimmed = text.trim();
        if (!trimmed) return;

        const newTask = {
            id: Date.now(),
            text: trimmed,
            completed: false,
            date: new Date().toLocaleDateString('ru-RU')
        };

        this.tasks.push(newTask);
        this.saveTasks();
        this.renderTasks();
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
        }
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.saveTasks();
        this.renderTasks();
    }

    getFilteredTasks() {
        switch (this.currentFilter) {
            case 'active': return this.tasks.filter(t => !t.completed);
            case 'completed': return this.tasks.filter(t => t.completed);
            default: return this.tasks;
        }
    }

    renderTasks() {
        const taskList = document.getElementById('taskList');
        const filtered = this.getFilteredTasks();

        if (filtered.length === 0) {
            taskList.innerHTML = '<p style="text-align:center;color:#999;padding:2rem;">Задач нет</p>';
        } else {
            taskList.innerHTML = filtered.map(task => `
                <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                    <div class="task-content">
                        <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                        <span class="task-text">${this.escapeHtml(task.text)}</span>
                    </div>
                    <button class="task-delete" type="button">Удалить</button>
                </div>
            `).join('');
        }

        this.updateStats();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    updateStats() {
        document.getElementById('totalTasks').textContent = this.tasks.length;
        document.getElementById('completedTasks').textContent = this.tasks.filter(t => t.completed).length;
    }

    attachEventListeners() {
        const input = document.getElementById('taskInput');
        const addBtn = document.getElementById('addTask');
        const taskList = document.getElementById('taskList');

        // Клик по кнопке
        addBtn.addEventListener('click', () => {
            this.addTask(input.value);
            input.value = '';
            input.focus();
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.addTask(input.value);
                input.value = '';
            }
        });

        taskList.addEventListener('click', (e) => {
            const taskItem = e.target.closest('.task-item');
            if (!taskItem) return;
            const id = parseInt(taskItem.dataset.id);

            if (e.target.classList.contains('task-checkbox')) {
                this.toggleTask(id);
            } else if (e.target.classList.contains('task-delete')) {
                this.deleteTask(id);
            }
        });

        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.renderTasks();
            });
        });
    }

    init() {
        this.attachEventListeners();
        this.renderTasks();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TaskManager();
});