;(() => {
  const taskInput = document.getElementById('new-task')
  const addButton = document.getElementsByTagName('button')[0]
  const incompleteTasksHolder = document.getElementById('incomplete-tasks')
  const completedTasksHolder = document.getElementById('completed-tasks')
  let taskOnEdit

  const createNewTaskElement = (taskString, completed = false) => {
    listItem = document.createElement('li')
    checkBox = document.createElement('input')
    label = document.createElement('label')
    editInput = document.createElement('input')
    editButton = document.createElement('button')
    deleteButton = document.createElement('button')
    if (completed) checkBox.checked = true

    checkBox.type = 'checkbox'
    editInput.type = 'text'
    editButton.innerText = 'Edit'
    editButton.className = 'edit'
    deleteButton.innerText = 'Delete'
    deleteButton.className = 'delete'
    label.innerText = taskString

    listItem.appendChild(checkBox)
    listItem.appendChild(label)
    listItem.appendChild(editInput)
    listItem.appendChild(editButton)
    listItem.appendChild(deleteButton)

    return listItem
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
    listItem = createNewTaskElement(listItemName)
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
    console.log(this.parentNode.childNodes)
    ul.removeChild(listItem)
    const task =
      this.parentNode.childNodes[3].nodeName === 'LABEL'
        ? this.parentNode.childNodes[3].textContent
        : this.parentNode.childNodes[1].textContent
    updateCachedItems(task, 'delete')
  }

  const bindTaskEvents = (taskListItem, checkBoxEventHandler, cb) => {
    const checkBox = taskListItem.querySelectorAll('input[type=checkbox]')[0]
    const editButton = taskListItem.querySelectorAll('button.edit')[0]
    const deleteButton = taskListItem.querySelectorAll('button.delete')[0]
    editButton.onclick = editTask
    deleteButton.onclick = deleteTask
    checkBox.onchange = checkBoxEventHandler
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
    const task = JSON.parse(cache || '[]')
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
