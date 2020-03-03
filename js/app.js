
// GENERAL 
const inp = document.querySelector("#inp");
const add = document.querySelector("#add");
const todoBox = document.querySelector("#todoBox");
const tdList = document.querySelector("#tdList");

// View Control
const clearList = document.querySelector("#clearList");
const filterControl = document.querySelector("#filterControl");
const secondaryOptions = document.querySelector("#secondaryOptions");
const all = document.querySelector("#all");
const tasktodo = document.querySelector("#tasktodo");
const taskdone = document.querySelector("#taskdone");
const trash = document.querySelector("#trash");
const restore = document.querySelector("#restore");
const emptyTrash = document.querySelector("#emptyTrash");

// Description Boxes
const descRows = document.querySelectorAll(".desc-row");
const descAreas = document.querySelectorAll(".desc-area");
const knobs = document.querySelectorAll(".knob");

// Theming
const root = document.documentElement;
const nightIcon = document.querySelector("#night-icon");
const themeColor = document.querySelector("meta[name=theme-color]");
const visuals = document.querySelector("#visuals");
const visOpt = document.querySelectorAll(".vis-opt");
let visualCh = visuals.value;

// Start Variables
let LIST, id, view;
let newItemId = 0;
inp.focus();
let THEME = [];
let darkmode = false;

// ENTER-KEY @ main INPUT
inp.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        event.preventDefault();
		add.click();
    }
});

// fetch TODO-key from localStorage
let data = localStorage.getItem("TODO");
if (data) {
    LIST = JSON.parse(data);
    retrieveTodo(LIST);
    id = LIST.length;
} else {
    LIST = [];
    id = 0;
}

// fetch THEME-key from localStorage
let themeData = localStorage.getItem("THEMEDATA");
if (themeData) {
    THEME = JSON.parse(themeData);
    themenr = THEME[0].theme;
    darkmode = THEME[0].darkui;
    themeChanger(themenr, darkmode);
    visuals.selectedIndex = themenr;
} else {
    themenr = '0'; darkmode = false;
    THEME.push({theme: themenr, darkui: darkmode});
    themeChanger(themenr, darkmode);
    updateTheme(THEME);
}

// Clean Interface on Start
if (LIST.length === 0) {
    filterControl.style.display = "none";
    secondaryOptions.style.display = "none";
    tdList.classList.add("allempty");
}

// RETRIEVING LIST from localStorage

function loadItem(toDo, toDoDesc, id, done, trash){

    newItem = document.createElement("tr");
    newItem.classList.add("todo");
    newItem.setAttribute("draggable","true");
    newItem.setAttribute("ondragstart","drag(event)");
    newItem.setAttribute("ondrop","drop(event)");
    newItem.setAttribute("ondragover","allowDrop(event)");

    newItem.innerHTML =
    `<td class="desc-btn"><div class="knob"></div></td>
    <td class="title">${toDo}</td>
    <td><button class="check"><i class="fas fa-check"></i></button></td>`;
    
    // newItem.classList.add("grow-Y"); // Animating Todos
    
    tdList.appendChild(newItem);
    // tdList.insertBefore(newItem, tdList.firstElementChild);

    // inserting row for DESC as last row
    descRow = tdList.insertRow(-1);
    descRow.classList.add('desc-row');
    descRow.classList.add('hidden');
    descCell = descRow.insertCell(0);
    descCell.setAttribute('colspan','3');
    descCell.innerHTML =
    `<textarea class="desc-area grow-Y hidden" rows="7" placeholder="Write your notes in here ...">${toDoDesc}</textarea>`;

    markDone(newItem);
    editItem(newItem);
    dndListener();

    const checkmark = newItem.children[2].firstChild.firstChild;
    if (done === true) {
        newItem.classList.add('marked');
        checkmark.classList.add('done');
        
    } else if (done === false) {
        newItem.classList.remove('marked');
        checkmark.classList.remove('done');
        checkmark.classList.add('actionPreview');
    }

    if (trash === true) {
        newItem.classList.add('deleted');
    }

}


function loadTodo(array){

    array.forEach(function(item){
        loadItem(item.name, item.desc, item.id, item.done, item.trash);

        newItem.id = LIST[item.id].id; // the html ID is redistributed according to LIST id value
        newItem.firstElementChild.id = `descBtn-${newItem.id}`;
        newItem.nextSibling.id = `descRow-${newItem.id}`;  // distribute id to desc row
        newItem.nextSibling.firstChild.firstChild.id = `descArea-${newItem.id}`;
        descBoxes(newItem);
        })
}

function retrieveTodo(array){

    array.forEach(function(item){
        loadItem(item.name, item.desc, item.id, item.done, item.trash);

        newItem.id = newItemId; // css id distribution stays in sync with LIST array
        newItem.firstElementChild.id = `descBtn-${newItem.id}`;
        newItem.nextSibling.id = `descRow-${newItem.id}`;  // distribute id to desc row
        newItem.nextSibling.firstChild.firstChild.id = `descArea-${newItem.id}`;
        descBoxes(newItem);
        
        newItemId++;  // it's crucial to up the html ID and stay in sync with LIST array

        })

    viewAll();
    all.click();
}


// ADD a NEW todo item to LIST array
function addToDo(toDo, toDoDesc, id, done, trash){
            
    LIST.push({
        name: toDo,
        desc: toDoDesc,
        id: id,
        done: false,
        trash: false
    })
}

// SAVING LIST and updating to localStorage
function updateList(List){
    localStorage.setItem("TODO", JSON.stringify(List));
}

// CLEAR Storage
clearList.addEventListener('click', () => {
const clearConfirm = confirm("REALLY? This will erase all your TODOs.");
    if (clearConfirm) {
        localStorage.clear();
        location.reload();
    } 
})


// CREATE new item on PLUS-Click
add.addEventListener('click', function(){


    if (inp.value !== "") {
        createItem();
    }

    inp.value = ""; //empty the input
    inp.focus();    //regain focus
    id++;
    updateList(LIST);   // updating all modifications to LIST

    all.click();

})


// CREATE or REBUILD Item
function createItem(){

    let toDo = inp.value;
    let toDoDesc = "";
    let done = false;
    let trash = false;

    let newItem = document.createElement("tr");
    newItem.classList.add("todo");
    newItem.setAttribute("draggable","true");
    newItem.setAttribute("ondragstart","drag(event)");
    newItem.setAttribute("ondrop","drop(event)");
    newItem.setAttribute("ondragover","allowDrop(event)");
    newItem.id = newItemId;

    newItem.innerHTML =
    `<td class="desc-btn" id="descBtn-${newItem.id}"><div class="knob"></div></td>
    <td class="title">${toDo}</td>
    <td><button class="check"><i class="fas fa-check"></i></button></td>`;

    // newItem.classList.add("grow-Y");   // Animating Todos

    tdList.appendChild(newItem);
    // tdList.insertBefore(newItem, tdList.firstElementChild);

    // inserting row for DESC as last row in table
    descRow = tdList.insertRow(-1);
    descRow.classList.add('hidden');
    descRow.classList.add('desc-row');
    descCell = descRow.insertCell(0);
    descCell.setAttribute('colspan','3');
    descCell.innerHTML =
    `<textarea class="desc-area grow-Y hidden" id="descArea-${newItem.id}" rows="7" placeholder="Write your notes in here ...">${toDoDesc}</textarea>`;

    filterControl.style.display = "flex";
    secondaryOptions.style.display = "flex";

    // add item to the LIST array
    addToDo(toDo, toDoDesc, id, done, trash);

    markDone(newItem);
    editItem(newItem);
    descBoxes(newItem);
    dndListener();

    newItem.nextSibling.id = `descRow-${newItem.id}`;  // distribute id to desc row
    newItemId++;
    // view = "ALL_view";
}

// MARKING todo as DONE
function markDone(newItem){
    let checkbox = newItem.children[2].firstElementChild;
    let checkmark = checkbox.firstElementChild;

    checkbox.addEventListener('click', function(e) {
        let targ = e.currentTarget.parentElement.parentElement;
        
        
        targ.classList.toggle('marked');
        checkmark.classList.toggle('done');


        if (LIST[targ.id].done == false) {
            LIST[targ.id].done = true;
            checkmark.classList.remove('actionPreview');
        } else {
            LIST[targ.id].done = false;
            checkmark.classList.add('actionPreview');
        }

        // immediate visual change of checkmark switch
        if (view == "ALL_view"){
            viewAll();
        } else if (view == "TODO_view") {
            viewTodos();
        } else if (view == "DONE_view") {
            viewDone();
        } else if (view == "TRASH_view") {
            viewTrash();
        }

        updateList(LIST);
    })
}


// add functionality of EDITING title of todo
function editItem(newItem){
    let titleLoc = newItem.children[1];

    titleLoc.addEventListener('dblclick', function(event){
        let currentTitle = this.innerText;

        if (event.target.classList.contains('title')) {
            event.target.innerHTML = `<textarea class="editForm" id="newTitle" rows="1" cols="14" draggable="false">${currentTitle}</textarea>`;
        }

        let newTitle = document.querySelector('#newTitle');
        newTitle.focus();
        newItem.setAttribute('draggable', 'false');

        newTitle.addEventListener('blur', function(){
            titleLoc.textContent = `${newTitle.value}`;
            newItem.setAttribute('draggable', 'true');
            LIST[newItem.id].name = titleLoc.textContent;
            updateList(LIST);
        })  // End editing blur func

        // ENTER-key @ title-INPUT
        newTitle.addEventListener('keypress', function(e){
            if (e.keyCode === 13) {
                e.preventDefault();
                newTitle.blur();
            }
        })  // End editing ENTER-key func
    })
}

// Editing of Description Boxes
function descBoxes(newItem){
    let descBtn = newItem.firstChild;
    
    descBtn.addEventListener('click', (e) => {
        currentRow = document.querySelector(`#descRow-${newItem.id}`);
        currentArea = document.querySelector(`#descArea-${newItem.id}`);
        let knob = e.currentTarget.firstElementChild;

        knob.classList.toggle('knobRotate');
        currentRow.classList.toggle('hidden');
        currentArea.classList.toggle('hidden');
        currentArea.focus();
        
        // Saving the new DESC content and closing textarea
        currentArea.addEventListener('blur', function(){
            currentArea.textContent = `${currentArea.value}`;
            LIST[newItem.id].desc = currentArea.textContent;
            updateList(LIST);
        })
    })
}


// ---------- View STATES ---------- //

function viewAll() {
view = "ALL_view";
tdList.classList.remove('alldone');
tdList.classList.remove('allundone');
tdList.classList.remove('nonedeleted');
tdList.classList.remove('allempty');
const all_items = LIST.filter(item => item.trash === false);
while (tdList.firstChild) {
    tdList.removeChild(tdList.lastChild);
}
loadTodo(all_items);
if (all_items.length === 0){
    tdList.classList.remove('alldone');
    tdList.classList.remove('allundone');
    tdList.classList.remove('nonedeleted');
    tdList.classList.add('allempty');
} else {
    tdList.classList.remove('allempty');
    tdList.classList.remove('alldone');
    tdList.classList.remove('allundone');
    tdList.classList.remove('nonedeleted');
    }
}

function viewTrash() {
view = "TRASH_view";
tdList.classList.remove('alldone');
tdList.classList.remove('allundone');
tdList.classList.remove('allempty');
const trash_items = LIST.filter(item => item.trash === true);
while (tdList.firstChild) {
    tdList.removeChild(tdList.lastChild);
}
loadTodo(trash_items);
if (trash_items.length === 0){
    tdList.classList.remove('alldone');
    tdList.classList.remove('allundone');
    tdList.classList.remove('allempty');
    tdList.classList.add('nonedeleted');
} else {
    tdList.classList.remove('allempty');
    tdList.classList.remove('alldone');
    tdList.classList.remove('allundone');
    tdList.classList.remove('nonedeleted');
    }
}

function viewDone() {
view = "DONE_view";
const done_items = LIST.filter(item => item.done === true && item.trash === false);
while (tdList.firstChild) {
    tdList.removeChild(tdList.lastChild);
}
loadTodo(done_items);
if (done_items.length === 0){
    tdList.classList.remove('allempty');
    tdList.classList.remove('alldone');
    tdList.classList.remove('nonedeleted');
    tdList.classList.add('allundone');
} else {
    tdList.classList.remove('allempty');
    tdList.classList.remove('alldone');
    tdList.classList.remove('allundone');
    tdList.classList.remove('nonedeleted');
    }
}

function viewTodos() {
view = "TODO_view";
tdList.classList.remove('alldone');
tdList.classList.remove('allundone');
const todo_items = LIST.filter(item => item.done === false && item.trash === false);
while (tdList.firstChild) {
    tdList.removeChild(tdList.lastChild);
}
loadTodo(todo_items);
if (todo_items.length === 0){
    tdList.classList.remove('allundone');
    tdList.classList.remove('nonedeleted');
    tdList.classList.add('alldone');
} else {
    tdList.classList.remove('alldone');
    tdList.classList.remove('allundone');
    tdList.classList.remove('nonedeleted');
    }
}

// Enabling Listeners on VIEW BUTTONS
all.addEventListener('click', () => {
    viewAll();
})
tasktodo.addEventListener('click', () => {
    viewTodos(); 
})
taskdone.addEventListener('click', () => {
    viewDone();
})
trash.addEventListener('click', () => {
    viewTrash();
})


// View State Buttons (underlines the current view)
const optionsBtn = document.querySelectorAll('.options-btn');
all.classList.add('btnViewState');

optionsBtn.forEach(btn => {
    filterControl.addEventListener('click', function(e) {
        if (e.target == this) {
            event.preventDefault();
        } else {
            btn.classList.remove('btnViewState');
            e.target.classList.add('btnViewState');
        }
    })
    secondaryOptions.addEventListener('click', function(e) {
        if (e.target == this) {
            event.preventDefault();
        } else {
            btn.classList.remove('btnViewState');
            e.target.classList.add('btnViewState');
        }
    })
});


//DnD Listening Events
// Drag Listeners for TODOs
function dndListener(){
    let todos = document.querySelectorAll(".todo");
    todos.forEach(todo => {
        todo.addEventListener('dragenter', handleDragEnter, false);
        todo.addEventListener('dragleave', handleDragLeave, false);
    });
}

// Drag Listeners for TRASH Button
trash.addEventListener('dragenter', handleDragEnter, false);
trash.addEventListener('dragleave', handleDragLeave, false);


// empty TRASH
emptyTrash.addEventListener('click', () => {
    view = "TRASH_view";

    const deleteConfirm = confirm("This will permanently delete your trashed items. OK?")

    if (deleteConfirm) {
        for( let i = 0; i < LIST.length; i++){ 
            if ( LIST[i].trash === true) {
              LIST.splice(i, 1); 
              i--;                  // for every spliced item i needs to be reset
            }
         }
    }

    // Redistribution of HTML ID and LIST ID
    let todos = document.querySelectorAll(".todo");
    let elemid = 0;
    let itemid = 0;
    todos.forEach(todo => {
        todo.id = elemid++;
    });
    LIST.forEach(item => {
        item.id = itemid++;
    });

    while (tdList.firstChild) {
        tdList.removeChild(tdList.lastChild);
    }

    id = LIST.length;
    // newItem.id = LIST[item.id].id;

    updateList(LIST);
    loadTodo(LIST);
    viewTrash();
});

// ---------- DRAG N DROP ---------- //

// The Table (#tdList) has enabling attributes set in HTML (index.html)

//  Permission to drop
function allowDrop(event) {
    event.preventDefault();
  }

// The DRAG event
function drag(event) {
    event.dataTransfer.setData("text", event.target.id);

    if (view !== "TRASH_view"){
        trash.classList.add("drag-general");
        trash.innerHTML = '<i class="far fa-trash-alt"></i> drop trash';
    } else if (view === "TRASH_view"){
        trash.classList.add("drag-general");
        trash.innerHTML = '<i class="fas fa-recycle"></i> restore';
    }
}

// The DROP event
function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    elToDrop = document.getElementById(data);
    elTarget = event.currentTarget;

    // -------- LIST Drop Stuff ---------- //
    if (elTarget.parentNode == tdList ) {
    let dropObj = LIST[elToDrop.id];  // Drop Object

    LIST.splice(elToDrop.id, 1);
    LIST.splice(elTarget.id, 0, dropObj);

    // Redistribution of HTML ID and LIST ID
    let todos = document.querySelectorAll(".todo");
    let elemid = 0;
    let itemid = 0;
    todos.forEach(todo => {
        todo.id = elemid++;
    });
    LIST.forEach(item => {
        item.id = itemid++;
    });
    updateList(LIST);
    
    // Update VIEW STATES 
    if (view == "ALL_view"){
        viewAll();
    } else if (view == "TODO_view") {
        viewTodos();
    } else if (view == "DONE_view") {
        viewDone();
    } else if (view == "TRASH_view") {
        viewTrash();
    }

    // -------- TRASH Drop Stuff ---------- //
    } else if (elTarget == trash) {
        if (view !== "TRASH_view") {
            LIST[elToDrop.id].trash = true;
            elToDrop.style.display = "none";
        } else {
            LIST[elToDrop.id].trash = false; // restore
            elToDrop.style.display = "none";
        }
        updateList(LIST);
    } 
    //remove any residues from the drag event
    trash.innerHTML = '<i class="far fa-trash-alt"></i> trash';
    elTarget.classList.remove('dragOver');
    elTarget.classList.remove('drag-general');
    trash.classList.remove("drag-general");
}


// STYLE of DND - functions
// EventListeners of each todo are set during creation 
// this or e.target is the current hover target

function handleDragEnter(e) {
    if (e.target == trash) {
        trash.classList.toggle('dragenter-btn');
    } else {    // meaning todo item
        this.classList.add('dragOver');
    }
}

function handleDragLeave(e) {
    if (e.target == trash) {
        trash.classList.toggle('dragenter-btn');
    } else {    // meaning todo item
        this.classList.remove('dragOver');
    }
}


// ---------- SETTINGS WINDOW ---------- //
// SETTINGS Button
let elementIsClicked = false;

function setWindow() {
	const shade = document.querySelector('#shade');
	const popUp = document.querySelector('#popup');
	const btnClose = document.querySelector('#closeBtn');

	shade.style.display = "flex";
	shade.style.backdropFilter = "blur(8px)";

	shade.addEventListener("click", closeWindowOut);
	popUp.addEventListener("click", clickHandler);
	btnClose.addEventListener("click", closeWindow);
}

function clickHandler(){
	elementIsClicked = true;
	setTimeout(function(){
		elementIsClicked = false;
	}, 1000)
}

function closeWindowOut() {
		if (elementIsClicked == false) {
			shade.style.display = "none";
		}	
}
function closeWindow() {
	shade.style.display = "none";
}


// ----------- NIGHT MODE ----------- //

nightIcon.addEventListener('click', () => {

    if (darkmode === false) {
        darkmode = true;
        THEME[0].darkui = darkmode;
        darkMode();
        updateTheme(THEME);
        } else {
        darkmode = false;
        THEME[0].darkui = false;
        themeChanger(themenr);
        updateTheme(THEME);
    }

})

function darkMode() {

    root.style.setProperty('--bg-color', "#2e2e2e");
    root.style.setProperty('--main', "var(--night-color)");
    root.style.setProperty('--glow', `${glow}`);
    root.style.setProperty('--main-bg', "linear-gradient(145deg, #313131, #292929)");
    root.style.setProperty('--main-bs', "8px 8px 16px #212121, -8px -8px 16px #3b3b3b");
    root.style.setProperty('--inp-shadow', "inset 8px 8px 16px #212121, inset -8px -8px 16px #3b3b3b");
    root.style.setProperty('--faint', "var(--night-color)");
    themeColor.setAttribute("content", "#2e2e2e");
    visOpt.forEach(opt => {opt.style.color = "#272727";});
    // localStorage.setItem('THEME', `${themeData}`);
}


// ---------- THEMEs ---------- //

function updateTheme(themeArray){
    localStorage.setItem("THEMEDATA", JSON.stringify(themeArray));
}


// VISUALS CHOICE

visuals.addEventListener("change", () => {
    themenr = visuals.value;
    THEME[0].theme = themenr;
    THEME[0].darkui = darkmode;
    themeChanger(themenr, darkmode);
    if (darkmode === true){ darkMode() };
    updateTheme(THEME);
})

function themeChanger(themenr){

switch (themenr) {
    
    // ROSE
    case '1':
        glow = 'none';
        root.style.setProperty('--main', "#272727");
        root.style.setProperty('--bg-color', "#e7a7bd");
        root.style.setProperty('--night-color', "#e7a7bd");
        root.style.setProperty('--main-bg', "linear-gradient(145deg, #f7b3ca, #d096aa)");
        root.style.setProperty('--main-bs', "9px 9px 18px #c08b9d, -9px -9px 18px #ffc3dd");
        root.style.setProperty('--inp-shadow', "inset 9px 9px 18px #c08b9d, inset -9px -9px 18px #ffc3dd");
        root.style.setProperty('--faint', "#313131");
        themeColor.setAttribute("content", "#e7a7bd");
        if (darkmode === true){ darkMode() };
        break;

    // CITRUS
    case '2':
        glow = 'none';
        root.style.setProperty('--main', "#272727");
        root.style.setProperty('--bg-color', "#e3e59d");
        root.style.setProperty('--night-color', "#e3e59d");
        root.style.setProperty('--main-bg', "linear-gradient(145deg, #f3f5a8, #ccce8d)");
        root.style.setProperty('--main-bs', "9px 9px 18px #bcbe82, -9px -9px 18px #ffffb8");
        root.style.setProperty('--inp-shadow', "inset 9px 9px 18px #bcbe82, inset -9px -9px 18px #ffffb8");
        root.style.setProperty('--faint', "#313131");
        themeColor.setAttribute("content", "#e3e59d");
        if (darkmode === true){ darkMode() };
        break;

    // LIME
    case '3':
        glow = 'none';
        root.style.setProperty('--main', "#272727");
        root.style.setProperty('--bg-color', "#98e79f");
        root.style.setProperty('--night-color', "#98e79f");
        root.style.setProperty('--main-bg', "linear-gradient(145deg, #a3f7aa, #89d08f)");
        root.style.setProperty('--main-bs', "9px 9px 18px #7ec084, -9px -9px 18px #b2ffba");
        root.style.setProperty('--inp-shadow', "inset 9px 9px 18px #7ec084, inset -9px -9px 18px #b2ffba");
        root.style.setProperty('--faint', "#313131");
        themeColor.setAttribute("content", "#98e79f");
        if (darkmode === true){ darkMode() };
        break;
    
    //PEACH
    case '4':
        glow = 'none';
        root.style.setProperty('--main', "#272727");
        root.style.setProperty('--bg-color', "#ffab91");
        root.style.setProperty('--night-color', "#ffab91");
        root.style.setProperty('--main-bg', "linear-gradient(145deg, #ffb79b, #e69a83)");
        root.style.setProperty('--main-bs', "9px 9px 18px #d48e78, -9px -9px 18px #ffc8aa");
        root.style.setProperty('--inp-shadow', "inset 9px 9px 18px #d48e78, inset -9px -9px 18px #ffc8aa");
        root.style.setProperty('--faint', "#313131");
        themeColor.setAttribute("content", "#ffab91");
        if (darkmode === true){ darkMode() };
        break;

    // LAVENDER
    case '5':
        glow = 'none';
        root.style.setProperty('--main', "#272727");
        root.style.setProperty('--bg-color', "#b4adf3");
        root.style.setProperty('--night-color', "#b4adf3");
        root.style.setProperty('--main-bg', "linear-gradient(145deg, #c1b9ff, #a29cdb)");
        root.style.setProperty('--main-bs', "9px 9px 18px #9590ca, -9px -9px 18px #d3caff");
        root.style.setProperty('--inp-shadow', "inset 9px 9px 18px #9590ca, inset -9px -9px 18px #d3caff");
        root.style.setProperty('--faint', "#313131");
        themeColor.setAttribute("content", "#b4adf3");
        if (darkmode === true){ darkMode() };
        break;

    // BABYBLUE
    case '6':
        glow = 'none';
        root.style.setProperty('--main', "#272727");
        root.style.setProperty('--bg-color', "#97c2ff");
        root.style.setProperty('--night-color', "#97c2ff");
        root.style.setProperty('--main-bg', "linear-gradient(145deg, #a2d0ff, #88afe6)");
        root.style.setProperty('--main-bs', "9px 9px 18px #7da1d4, -9px -9px 18px #b1e3ff");
        root.style.setProperty('--inp-shadow', "inset 9px 9px 18px #7da1d4, inset -9px -9px 18px #b1e3ff");
        root.style.setProperty('--faint', "#313131");
        themeColor.setAttribute("content", "#97c2ff");
        if (darkmode === true){ darkMode() };
        break;
    
    //ROYALBLUE
    case '7':
        glow = 'brightness(150%)';
        root.style.setProperty('--main', "#dddddd");
        root.style.setProperty('--bg-color', "#364edf");
        root.style.setProperty('--night-color', "#364edf");
        root.style.setProperty('--main-bg', "linear-gradient(145deg, #3a53ef, #3146c9)");
        root.style.setProperty('--main-bs', "9px 9px 18px #2d41b9, -9px -9px 18px #3f5bff");
        root.style.setProperty('--inp-shadow', "inset 9px 9px 18px #2d41b9, inset -9px -9px 18px #3f5bff");
        root.style.setProperty('--faint', "#b9b9b9");
        themeColor.setAttribute("content", "#364edf");
        visOpt.forEach(opt => {opt.style.color = "#272727";});
        if (darkmode === true){ darkMode() };
        break;

    //SEAGREEN
    case '8':
        glow = 'brightness(140%)';
        root.style.setProperty('--main', "#dddddd");
        root.style.setProperty('--bg-color', "#00876c");
        root.style.setProperty('--night-color', "#00876c");
        root.style.setProperty('--main-bg', "linear-gradient(145deg, #009074, #007a61)");
        root.style.setProperty('--main-bs', "12px 12px 24px #00745d, -12px -12px 24px #009a7b");
        root.style.setProperty('--inp-shadow', "inset 12px 12px 24px #00745d, inset -12px -12px 24px #009a7b");
        root.style.setProperty('--faint', "#b9b9b9");
        themeColor.setAttribute("content", "#00876c");
        visOpt.forEach(opt => {opt.style.color = "#272727";});
        if (darkmode === true){ darkMode() };
        break;
    
    //MAGURO
    case '9':
        glow = 'brightness(170%)';
        root.style.setProperty('--main', "#dddddd");
        root.style.setProperty('--bg-color', "#89212a");
        root.style.setProperty('--night-color', "#89212a");
        root.style.setProperty('--main-bg', "linear-gradient(145deg, #93232d, #7b1e26)");
        root.style.setProperty('--main-bs', "19px 19px 37px #6e1a22, -19px -19px 37px #a42832");
        root.style.setProperty('--inp-shadow', "inset 19px 19px 37px #6e1a22, inset -19px -19px 37px #a42832");
        root.style.setProperty('--faint', "#b9b9b9");
        themeColor.setAttribute("content", "#89212a");
        visOpt.forEach(opt => {opt.style.color = "#272727";});
        if (darkmode === true){ darkMode() };
        break;
    
    // LAGOON
    case '10':
        glow = 'none';
        root.style.setProperty('--main', "#272727");
        root.style.setProperty('--bg-color', "#63d1c5");
        root.style.setProperty('--night-color', "#63d1c5");
        root.style.setProperty('--main-bg', "linear-gradient(145deg, #6ae0d3, #59bcb1)");
        root.style.setProperty('--main-bs', "19px 19px 37px #4fa79e, -19px -19px 37px #77fbec");
        root.style.setProperty('--inp-shadow', "inset 19px 19px 37px #4fa79e, inset -19px -19px 37px #77fbec");
        root.style.setProperty('--faint', "#313131");
        themeColor.setAttribute("content", "#63d1c5");
        if (darkmode === true){ darkMode() };
        break;

    //VEGAS GOLD
    case '11':
        glow = 'none';
        root.style.setProperty('--main', "#272727");
        root.style.setProperty('--bg-color', "#c5b358");
        root.style.setProperty('--night-color', "#c5b358");
        root.style.setProperty('--main-bg', "linear-gradient(145deg, #d3c05e, #b1a14f)");
        root.style.setProperty('--main-bs', "19px 19px 38px #a29348, -19px -19px 38px #e8d368");
        root.style.setProperty('--inp-shadow', "inset 19px 19px 38px #a29348, inset -19px -19px 38px #e8d368");
        root.style.setProperty('--faint', "#313131");
        themeColor.setAttribute("content", "#C5B358");
        if (darkmode === true){ darkMode() };
        break;

    // BATH (DEFAULT)
    case '0':
        glow = 'none';
        root.style.setProperty('--main', "#555555");
        root.style.setProperty('--bg-color', "#e0e5ec");
        root.style.setProperty('--night-color', "#e0e5ec");
        root.style.setProperty('--main-bg', "linear-gradient(145deg, #f0f5fd, #caced4)");
        root.style.setProperty('--main-bs', "11px 11px 19px #b8bcc2, -11px -11px 19px #ffffff");
        root.style.setProperty('--inp-shadow', "inset 11px 11px 19px #b8bcc2, inset -11px -11px 19px #ffffff");
        root.style.setProperty('--faint', "#adadad");
        themeColor.setAttribute("content", "#e0e5ec");
        if (darkmode === true){ darkMode() };
        break;
    }
}


// ---------- EXPERIMENTAL STUFF ---------- //


// TESTING SORT

function sortAll(){
    view = "sortAll_VIEW";
    LIST.sort((a, b) => a.done - b.done );
    // const todosBottom = LIST.sort((a, b) => b.done - a.done );
    // clear List View
    updateList(LIST);
    while (tdList.firstChild) {
        tdList.removeChild(tdList.lastChild);
    }
    loadTodo(LIST);
    // Redistribution of HTML ID and LIST ID
    let todos = document.querySelectorAll(".todo");
    let elemid = 0;
    let itemid = 0;
    todos.forEach(todo => {
        todo.id = elemid++;
    });
    LIST.forEach(item => {
        item.id = itemid++;
    });
    updateList(LIST);
    all.click();
}

function VueC(trashState, doneState) {

    if ( doneState === undefined ) {
        const afterTrash = LIST.filter(
            item => item.trash === JSON.parse(trashState));
        while (tdList.firstChild) {
            tdList.removeChild(tdList.lastChild);
            loadTodo(afterTrash);}
    } else {
        const afterDone = LIST.filter(
            item =>
            item.trash === JSON.parse(trashState) && 
            item.done === JSON.parse(doneState));
            while (tdList.firstChild) {
                tdList.removeChild(tdList.lastChild);}
            loadTodo(afterDone);
    }
}

// all = VueC(false); only todos = VueC(false, false); only done's = VueC(false, true);
