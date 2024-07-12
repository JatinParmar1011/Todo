// Select elements and initialize tasks array
const items = document.querySelectorAll('.item');
const btnAdd = document.querySelector('.project-btn-add');
const formInput = document.querySelector('.project-form');
const addTask = document.querySelector('.add-task');
const taskDisplay = document.querySelector('.task-container');
const closeTask = document.querySelector('.close-task');
const taskTitle = document.getElementById('title');
const taskDetails = document.getElementById('details');
const taskPriority = document.getElementById('priority');
const taskDuedate = document.getElementById('duedate');
const submitBtn = document.getElementById('submit');
const requiredTitle = document.getElementById('requiredTitle');
const requiredPriority = document.getElementById('requiredPriority');
const requiredDate = document.getElementById('requiredDate');
const displayContent = document.getElementById('display-content');
const allTasks = document.querySelector('.tasks');
const completeAllTasks = document.querySelector('.completed-tasks');
const projectForm = document.querySelector('.project-form');
const projectInput = document.querySelector('input[name="formProjectTitle"]');
const allProjectsDiv = document.querySelector('.all-projects');
const menuIcon=document.querySelector('.menu-btn');
const leftContainer=document.querySelector('.left-container')
const modal =document.querySelector('.modal')
let EditObj;
let tasks = [];
let completeTasks = [];
let i = 0;

// Toggle active class for items
items.forEach(item => {
    item.addEventListener('click', () => {
        if (leftContainer.classList.contains('active')) {
            leftContainer.classList.remove('active');
            modal.classList.add('hidden');
        }
        items.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        const view = item.getAttribute('data-view');
        if (view !== 'home') {
            console.log(completeTasks.length);
            tasks.length==0 ? displayContent.style.display = 'block' : displayContent.style.display='none';
            addTask.classList.add('hidden');
        }
        else{
            addTask.classList.remove('hidden');
        }
        updateView(view);
    });
});

function updateView(view) {
    let filteredTasks = [];
    const today = new Date().getDate(); 
    const month=new Date().getMonth();

    switch(view) {
        case 'home':
            filteredTasks = tasks;
            document.querySelector('.heading2 h1').innerText = 'Home';
            break;
        case 'today':
            filteredTasks = tasks.filter(task => task.duedate.slice(-2) == today);
            document.querySelector('.heading2 h1').innerText = 'Today';
            break;
        case 'week':
            filteredTasks = tasks.filter(task => {
                if (task.duedate.slice(-5,-3) == month+1) {
                    console.log(task.duedate.slice(-5,-3));
                    console.log(Math.abs(task.duedate.slice(-2)-(today)));
                    return Math.abs(task.duedate.slice(-2)-(today)) <= 7;
                }      
            });
            document.querySelector('.heading2 h1').innerText = 'This Week';
            break;
        default:
            filteredTasks = tasks;
            document.querySelector('.heading2 h1').innerText = 'Home';
            break;
    }

    renderFilteredTasks(filteredTasks);
}

function renderFilteredTasks(filteredTasks) {
    allTasks.innerHTML = '';
    filteredTasks.forEach(task => initTask(task));
}

// Toggle form input visibility
btnAdd.addEventListener('click', () => {
    btnAdd.classList.toggle("active");
    formInput.classList.add('active');
});

projectForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const projectTitle = projectInput.value.trim();

    if (projectTitle) {
        const projectHtml = `
            <div>
                <ul>
                    <li class="project-item">
                        <div class="project-sub-item">
                        <i class="fa-solid fa-folder"></i> 
                        ${projectTitle}
                        </div>
                        <div>
                        <i class="fa-solid fa-trash delete-icon" style="margin-left: 10px; cursor: pointer;"></i>
                        </div>
                    </li>
                </ul>
            </div>
        `;
        
        allProjectsDiv.insertAdjacentHTML('beforeend', projectHtml);
        projectInput.value = '';  // Clear the input field
    }
});

allProjectsDiv.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-icon')) {
        const li = e.target.closest('li');
        li.remove();
    }
});

// Show task input form
addTask.addEventListener('click', () => {
    requiredTitle.innerHTML = '';
    submitBtn.value='New Task'
    taskDisplay.classList.remove("hidden");
    taskTitle.value='';
    taskDetails.value='';
    taskPriority.value='none';
    taskDuedate.value='';
    priorityCircle.classList.remove(...['low','medium','high'])
    closeTask.addEventListener('click', () => {
        taskDisplay.classList.add("hidden");
    });
});

// Update UI to show or hide display image
function updateUI() {
    const activeView = document.querySelector('.item.active').getAttribute('data-view');
    let taskList = [];
    switch (activeView) {
        case 'home':
            taskList = tasks;
            break;
        case 'today':
            taskList = tasks.filter(task => task.duedate === new Date().toISOString().split('T')[0]);
            break;
        case 'week':
            const today = new Date();
            const weekStart = new Date(today.setDate(today.getDate() - today.getDay() + 1));
            const weekEnd = new Date(today.setDate(weekStart.getDate() + 6));
            taskList = tasks.filter(task => {
                const taskDate = new Date(task.duedate);
                return taskDate >= weekStart && taskDate <= weekEnd;
            });
            break;
        default:
            taskList = tasks;
            break;
    }

    if (tasks.length === 0) {
        displayContent.style.display = 'block';
    } else {
        displayContent.style.display = 'none';
    }
}

// Handle task submission
submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (submitBtn.value==='Edit') {
        const temp=tasks.find((task)=>task.id==EditObj);
        temp.title=taskTitle.value;
        temp.details=taskDetails.value;
        temp.priority=taskPriority.value;
        temp.duedate=taskDuedate.value;
        taskDisplay.classList.add('hidden');
        allTasks.innerHTML='';
        tasks.forEach((task)=>{
            initTask(task);
        })
        return;
    }
    if (taskTitle.value === "") {
        requiredTitle.innerHTML = "<P>Task must include a title.</P>";
        return; 
    }
    if(taskPriority.value === "none"){
        requiredPriority.innerHTML = "<P>Task must include a Priority.</P>";
        return;  
    }
    if(taskDuedate.value==''){
        requiredDate.innerHTML = "<P>Task must include a Duedate.</P>";
        return;  
    }
    const task = {
        title: taskTitle.value,
        details: taskDetails.value,
        priority: taskPriority.value,
        duedate: taskDuedate.value,
        id: ++i
    };
    tasks.push(task);
    initTask(task);
    taskDisplay.classList.add('hidden');
    updateUI();
});

// Clear the required text message when input changes
taskTitle.addEventListener('input', () => {
    if (taskTitle.value == '') {
        requiredTitle.innerHTML = "<P>Task must include a title.</P>";
    } else {
        requiredTitle.innerHTML = '';
    }
});
taskPriority.addEventListener('input', () => {
    if (taskPriority.value == 'none') {
        requiredPriority.innerHTML = "<P>Task must include a Priority.</P>";
    } else {
        requiredPriority.innerHTML = '';
    }
});
taskDuedate.addEventListener('input', () => {
    if (requiredDate.value == '') {
        requiredDate.innerHTML = "<P>Task must include a Duedate.</P>";
    } else {
        requiredDate.innerHTML = '';
    }
});

// Initialize a task in the task container
function initTask(item) {
    const priorityClass = getPriorityClass(item.priority);
    const html = `
        <div class="single-task ${priorityClass}" data-id=${item.id}>
            <div class="left-line">
                <div>
                    <input type="checkbox" class="checkbox">
                </div>

                <details>
                    <summary>
                        <p>${item.title}</p>
                        <svg class="size-6 down" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                        <svg class="size-6 up hidden" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                        </svg>
                    </summary>
                    <p>${item.details}</p>
                </details>
            </div>
            
            <div class="right-line">
                <p class="red-date">${item.duedate}</p>
                <button class="edit"><i class="fa-solid fa-pen"></i></button>
                <button class="delete"><i class="fa-solid fa-trash"></i></button>
            </div>
        </div>`;
    allTasks.insertAdjacentHTML('afterbegin', html);
}

// Event delegation for handling checkboxes, edit, and delete buttons
allTasks.addEventListener('click', (e) => {
    const clickedDetails = e.target.closest('details');
    if (clickedDetails) {
        const downArrow = clickedDetails.querySelector('.down');
        const upArrow = clickedDetails.querySelector('.up');
        downArrow.classList.toggle("hidden");
        upArrow.classList.toggle("hidden");
    }

    if (e.target.closest('.edit')) {
        requiredTitle.innerHTML = '';
        submitBtn.value="Edit"
        EditObj = e.target.closest('.single-task').getAttribute('data-id');
        const editTask = tasks.find(task => task.id == EditObj);
        taskTitle.value=editTask.title;
        taskDetails.value=editTask.details;
        taskPriority.value=editTask.priority;
        taskDuedate.value=editTask.duedate;
        priorityCircle.classList.remove(...['low','medium','high'])
        priorityCircle.classList.add(editTask.priority);
        taskDisplay.classList.remove("hidden");
        closeTask.addEventListener('click', () => {
            taskDisplay.classList.add("hidden");
        });
    }

    const singleTask = e.target.closest('.delete');
    if (singleTask) {
        const id = singleTask.closest('.single-task').getAttribute('data-id');
        tasks = tasks.filter(task => task.id != id);
        updateUI();
        renderTasks();
    }

    const checkbox = e.target.closest('.checkbox');
    if (checkbox) {
        const id = checkbox.closest('.single-task').getAttribute('data-id');
        const completedTask = tasks.find(task => task.id == id);
        completeTasks.push(completedTask);
        tasks = tasks.filter(task => task.id != id);
        updateUI();
        renderTasks();
        renderCompletedTasks();
    }
});

function renderTasks() {
    const activeView = document.querySelector('.item.active').getAttribute('data-view');
    updateView(activeView);
}

function renderCompletedTasks() {
    completeAllTasks.innerHTML = '';
    completeTasks.forEach(task => endTask(task));
}

// Initialize a completed task in the completed task container
function endTask(item) {
    const priorityClass = getPriorityClass(item.priority);
    const html = `
        <div class="single-complete-task ${priorityClass}" data-id=${item.id}>
            <div class="left-line">
                <input type="checkbox" class="checkbox" checked disabled>

                <details>
                    <summary>
                        <p class="checkedLine">${item.title}</p>
                        <svg class="size-6 down" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                        <svg class="size-6 up hidden" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                        </svg>
                    </summary>
                    <p>${item.details}</p>
                </details>
            </div>
            
            <div class="right-line">
                <p class="red-date">${item.duedate}</p>
                <button class="delete"><i class="fa-solid fa-trash"></i></button>
            </div>
        </div>`;
    completeAllTasks.insertAdjacentHTML('afterbegin', html);
}

// Event delegation for deleting completed tasks
completeAllTasks.addEventListener('click', (e) => {
    const singleTask = e.target.closest('.delete');
    if (singleTask) {
        const id = singleTask.closest('.single-complete-task').getAttribute('data-id');
        completeTasks = completeTasks.filter(task => task.id != id);
        renderCompletedTasks();
    }
});

const prioritySelect = document.getElementById('priority');
const priorityCircle = document.querySelector('.priority-circle');

prioritySelect.addEventListener('change', () => {
    const selectedPriority = prioritySelect.value;

    // Remove all priority classes
    priorityCircle.classList.remove('low', 'medium', 'high');

    // Add the class based on the selected priority
    if (selectedPriority === 'low') {
        priorityCircle.classList.add('low');
    } else if (selectedPriority === 'medium') {
        priorityCircle.classList.add('medium');
    } else if (selectedPriority === 'high') {
        priorityCircle.classList.add('high');
    }
});

function getPriorityClass(priority) {
    switch (priority) {
        case 'low':
            return 'low-priority';
        case 'medium':
            return 'medium-priority';
        case 'high':
            return 'high-priority';
        default:
            return '';
    }
}

document.body.addEventListener('click',(e)=>{
    if(e.target.classList.contains('modal')){
leftContainer.classList.remove('active');
modal.classList.add('hidden');
    }
    
})

menuIcon.addEventListener('click',()=>{
    modal.classList.toggle('hidden');
    leftContainer.classList.toggle('active');
})