let tasks = []

const taskInput = document.getElementById('task-input')
const addBtn    = document.getElementById('add-btn')
const taskList  = document.getElementById('task-list')

// createTask — สร้าง Tasks Li
function createTaskElement(task) {

  // สร้าง <li class="task-item">
  const li = document.createElement('li')
  li.className = 'task-item'
  li.dataset.id = task.id        // เก็บ id ไว้ใน data attribute

  if (task.completed) {
    li.classList.add('done')
  }

  // สร้าง <input type="checkbox">
  const checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  checkbox.checked = task.completed
  checkbox.addEventListener('change',()=>{
    toggleTask(task.id)
  })

  // สร้าง <span class="task-text">
  const span = document.createElement('span')
  span.className = 'task-text'
  span.textContent = task.text

  // สร้าง <button class="delete-btn">
  const deleteBtn = document.createElement('button')
  deleteBtn.className = 'delete-btn'
  deleteBtn.textContent = '×'
  deleteBtn.addEventListener('click', ()=>{
    deleteTask(task.id)
  })

  // ประกอบร่าง: ใส่ทุกอย่างเข้า <li>
  li.appendChild(checkbox)
  li.appendChild(span)
  li.appendChild(deleteBtn)

  return li   // return กลับไปใช้ที่ renderTasks()
}



// RENDER — แสดงข้อความออกมาผ่าน Li
function renderTasks() {
  // ล้าง list ทั้งหมดก่อน
  taskList.innerHTML = ''

  // ถ้าไม่มี task เลย → แสดง empty state
  if (tasks.length === 0) {
    const emptyLi = document.createElement('li')
    emptyLi.className = 'empty-state'
    emptyLi.textContent = 'No tasks yet. Add one above!'
    taskList.appendChild(emptyLi)
    return
  }

  // วน loop สร้าง element ทีละ task แล้ว append เข้า list
  tasks.forEach((task)=>{
    const taskEl = createTaskElement(task)
    taskList.appendChild(taskEl)
  })
}



//ACTIONS — ฟังก์ชันที่เปลี่ยน state แล้ว render ใหม่
function addTask() {
  const text = taskInput.value.trim()

  // ถ้า input ว่างก็ไม่ทำอะไร
  if (text === '') return

  // สร้าง task object ใหม่
  const newTask = {
    id: Date.now(),
    text: text,
    completed: false
  }

  tasks.push(newTask)

  saveTasks()

  taskInput.value = ''

  renderTasks()
}

function toggleTask(id) {
  // วน loop หา task ที่ตรงกับ id แล้วเปลี่ยน completed
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === id) {
      tasks[i].completed = !tasks[i].completed
      saveTasks()
      break
    }
  }

  renderTasks()
}

function deleteTask(id) {
  // สร้าง array ใหม่ที่ไม่มี task ตัวนั้น
  const newTasks = []

  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id !== id) {
      newTasks.push(tasks[i])
    }
  }

  tasks = newTasks

  saveTasks()

  renderTasks()
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks))
}

function loadTasks() {
  const savedTasks = localStorage.getItem('tasks')

  if (savedTasks) {
    tasks = JSON.parse(savedTasks)
  }
}


// EVENT LISTENERS — รับ event จาก user
addBtn.addEventListener('click', ()=>{
  addTask()
})

// กด Enter ใน input
taskInput.addEventListener('keydown',(e)=>{
  if (e.key === 'Enter') {
    addTask()
  }
})

loadTasks()
renderTasks()
