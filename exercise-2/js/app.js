;(() => {
  const taskInput = document.getElementById('new-task')
  const addButton = document.getElementsByTagName('button')[0]
  const incompleteTasksHolder = document.getElementById('incomplete-tasks')
  const completedTasksHolder = document.getElementById('completed-tasks')
  let taskOnEdit

  const createNewTaskElement = (taskString, completed = false) => {
    const listItem = document.createElement('li')
    const checkBox = document.createElement('input')
    const label = document.createElement('label')
    const editInput = document.createElement('input')
    const editButton = document.createElement('button')
    const deleteButton = document.createElement('button')

    checkBox.type = 'checkbox'
    editInput.type = 'text'
    editButton.innerText = 'Edit'
    editButton.className = 'edit'
    deleteButton.innerText = 'Delete'
    deleteButton.className = 'delete'
    label.innerText = taskString
    if (completed) checkBox.checked = true

    listItem.appendChild(checkBox)
    listItem.appendChild(label)
    listItem.appendChild(editInput)
    listItem.appendChild(editButton)
    listItem.appendChild(deleteButton)

    return listItem
  }

  const bindTaskEvents = (taskListItem, checkBoxEventHandler) => {
    const checkBox = taskListItem.querySelectorAll('input[type=checkbox]')[0]
    const editButton = taskListItem.querySelectorAll('button.edit')[0]
    const deleteButton = taskListItem.querySelectorAll('button.delete')[0]
    editButton.onclick = editTask
    deleteButton.onclick = deleteTask
    checkBox.onchange = checkBoxEventHandler
  }

  const updateCachedItems = (task, action, completed = false) => {
    const cachedItems = localStorage.getItem('tasks')
    const tasks = JSON.parse(cachedItems || '[]')
    const updatedCache =
      action === 'update' ? [...tasks.filter(v => v.task !== task), { task, completed }] : tasks.filter(v => v.task !== task)
    localStorage.setItem('tasks', JSON.stringify(updatedCache))
  }

  const addTask = () => {
    const listItemName = taskInput.value
    if (!listItemName) return alert('Please enter the Task')
    const listItem = createNewTaskElement(listItemName)
    incompleteTasksHolder.appendChild(listItem)
    bindTaskEvents(listItem, taskCompleted)
    taskInput.value = ''
    updateCachedItems(listItemName, 'update')
  }

  const editTask = function (el) {
    const listItem = this.parentNode
    const editInput = listItem.querySelectorAll('input[type=text')[0]
    const label = listItem.querySelector('label')
    const button = listItem.getElementsByTagName('button')[0]

    const containsClass = listItem.classList.contains('editMode')

    if (containsClass) {
      label.innerText = editInput.value
      button.innerText = 'Edit'
      const task =
        this.parentNode.childNodes[3].nodeName === 'LABEL'
          ? this.parentNode.childNodes[3].textContent
          : this.parentNode.childNodes[1].textContent
      if (taskOnEdit) updateCachedItems(taskOnEdit, 'remove')
      updateCachedItems(task, 'update')
    } else {
      editInput.value = label.innerText
      button.innerText = 'Save'
      taskOnEdit = label.innerText
    }

    listItem.classList.toggle('editMode')
  }

  const deleteTask = function (el) {
    const listItem = this.parentNode
    const ul = listItem.parentNode
    ul.removeChild(listItem)
    const task =
      this.parentNode.childNodes[3].nodeName === 'LABEL'
        ? this.parentNode.childNodes[3].textContent
        : this.parentNode.childNodes[1].textContent
    updateCachedItems(task, 'delete')
  }

  const taskCompleted = function (el) {
    const listItem = this.parentNode
    completedTasksHolder.appendChild(listItem)
    bindTaskEvents(listItem, taskIncomplete)

    const task =
      this.parentNode.childNodes[3].nodeName === 'LABEL'
        ? this.parentNode.childNodes[3].textContent
        : this.parentNode.childNodes[1].textContent
    updateCachedItems(task, 'update', true)
  }

  const taskIncomplete = function (el) {
    const listItem = this.parentNode
    incompleteTasksHolder.appendChild(listItem)
    bindTaskEvents(listItem, taskCompleted)
  }

  addButton.addEventListener('click', addTask)

  for (let i = 0; i < incompleteTasksHolder.children.length; i++) {
    bindTaskEvents(incompleteTasksHolder.children[i], taskCompleted)
  }

  for (let i = 0; i < completedTasksHolder.children.length; i++) {
    bindTaskEvents(completedTasksHolder.children[i], taskIncomplete)
  }

  const loadFromCache = () => {
    const cache = localStorage.getItem('tasks')
    let tasks
    if (!cache) {
      tasks = [
        {
          task: 'Pay Bills',
          completed: false
        },
        {
          task: 'Go Shopping',
          completed: false
        },
        {
          task: 'See the Doctor',
          completed: true
        }
      ]
      localStorage.setItem('tasks', JSON.stringify(tasks))
    }

    const task = JSON.parse(cache || JSON.stringify(tasks))
    for (let i = 0; i < task.length; i++) {
      const listItem = createNewTaskElement(task[i].task, task[i].completed)
      if (task[i].completed) {
        completedTasksHolder.appendChild(listItem)
        bindTaskEvents(listItem, taskIncomplete)
      } else {
        incompleteTasksHolder.appendChild(listItem)
        bindTaskEvents(listItem, taskCompleted)
      }
    }
  }

  loadFromCache()
})()
