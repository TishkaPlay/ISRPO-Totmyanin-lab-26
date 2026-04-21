class TaskManager {
	constructor() {
		this.tasks = this.loadTasks()
		this.currentFilter = 'all'
		this.init()
	}

	init() {
		this.renderTasks()
		this.attachEventListeners()
	}

	loadTasks() {
		const savedTasks = localStorage.getItem('tasks')
		return savedTasks ? JSON.parse(savedTasks) : []
	}

	saveTasks() {
		localStorage.setItem('tasks', JSON.stringify(this.tasks))
	}

	addTask(text) {
		if (!text?.trim()) return
		const task = {
			id: Date.now(),
			text: text.trim(),
			completed: false,
			createdAt: new Date().toISOString(),
		}
		this.tasks.push(task)
		this.saveTasks()
		this.renderTasks()
	}

	toggleTask(id) {
		const task = this.tasks.find(t => t.id === id)
		if (task) {
			task.completed = !task.completed
			this.saveTasks()
			this.renderTasks()
		}
	}

	deleteTask(id) {
		this.tasks = this.tasks.filter(t => t.id !== id)
		this.saveTasks()
		this.renderTasks()
	}

	getFilteredTasks() {
		switch (this.currentFilter) {
			case 'active':
				return this.tasks.filter(t => !t.completed)
			case 'completed':
				return this.tasks.filter(t => t.completed)
			default:
				return this.tasks
		}
	}

	renderTasks() {
		const taskList = document.getElementById('taskList')
		const filteredTasks = this.getFilteredTasks()
		if (filteredTasks.length === 0) {
			taskList.innerHTML =
				'<p style="text-align: center; color: #999; padding: 2rem;">Задач нет</p>'
		} else {
			taskList.innerHTML = filteredTasks
				.map(
					task => `
                        <div class="task-item ${task.completed ? 'completed' : ''}">
                            <div class="task-content">
                                <input
                                type="checkbox"
                                class="task-checkbox"
                                ${task.completed ? 'checked' : ''}
                                data-id="${task.id}"
                                >
                                <span class="task-text">${this.escapeHtml(task.text)}</span>
                            </div>
                        <button class="task-delete" data-id="${task.id}">Удалить</button>
                        </div>
                        `,
				)
				.join('')
		}
		this.updateStats()
	}

	escapeHtml(text) {
		const div = document.createElement('div')
		div.textContent = text
		return div.innerHTML
	}

	updateStats() {
		const totalTasksElement = document.getElementById('totalTasks')
		const completedTasksElement = document.getElementById('completedTasks')
		if (totalTasksElement) totalTasksElement.textContent = this.tasks.length
		if (completedTasksElement)
			completedTasksElement.textContent = this.tasks.filter(
				t => t.completed,
			).length
	}

	attachEventListeners() {
		const addButton = document.getElementById('addTask')
		if (addButton) {
			addButton.addEventListener('click', () => {
				const input = document.getElementById('taskInput')
				this.addTask(input.value)
				input.value = ''
			})
		}

		const taskInput = document.getElementById('taskInput')
		if (taskInput) {
			taskInput.addEventListener('keypress', e => {
				if (e.key === 'Enter') {
					this.addTask(e.target.value)
					e.target.value = ''
				}
			})
		}

		const taskList = document.getElementById('taskList')
		if (taskList) {
			taskList.addEventListener('click', e => {
				const id = parseInt(e.target.dataset.id)
				if (e.target.classList.contains('task-checkbox')) {
					this.toggleTask(id)
				} else if (e.target.classList.contains('task-delete')) {
					this.deleteTask(id)
				}
			})
		}

		document.querySelectorAll('.filter-btn').forEach(btn => {
			btn.addEventListener('click', e => {
				document
					.querySelectorAll('.filter-btn')
					.forEach(b => b.classList.remove('active'))
				e.target.classList.add('active')
				this.currentFilter = e.target.dataset.filter
				this.renderTasks()
			})
		})
	}
}

const app = new TaskManager()