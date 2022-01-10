/* // handle sign in click

* document.querySelector('.signInBtn').addEventListener('click', function () {
*    document.querySelector('.registrationForm').style.display = 'none';
*     document.querySelector('.signInArea').style.display = 'block';
* })

* // Hit registration Button

* document.querySelector('.registerBtn').addEventListener('click', function(){
*     document.querySelector('.signInArea').style.display = 'none';
*    document.querySelector('.registrationForm').style.display = 'block';
* })

* Handle Registration

*/

let userJSONdata = localStorage.getItem('user');
const user = JSON.parse(userJSONdata);
let email = user.email;

if(userJSONdata === null){
    console.log(0);
}
else{
    document.querySelector('.registrationArea').style.display = 'none';
    loadData();
}

function handleRegistration(){
    const email = document.querySelector('#email').value;
    // const password = document.querySelector('#password').value;
    // const repeatPassword = document.querySelector('#psw-repeat').value;
    const user = {email: email};
    const rgx =  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!rgx.test(email)){
        document.querySelector('.emailWarning').innerHTML = 'Enter a valid email';
    }
    else{
       postUserInfo(user);
       localStorage.setItem('user', JSON.stringify(user));
       document.querySelector('.registrationArea').style.display = 'none';
       window.location.reload(false);
       document.querySelector('.container').style.display = 'block';
    }
}

// POST USER information to server

function postUserInfo(postUserInfo) {
    fetch('http://localhost:5000/addUser', {
        method: 'POST',
        body: JSON.stringify(postUserInfo),
        headers: {
            "Content-type": "application/json;charset=UTF-8"
        }
    })
        .then(res => res.json())
        .then(result => {
            if (result) {
                console.log(result);
            }
        })
}

// When user Click login button

// document.querySelector('.loginBtn').addEventListener('click', function(){
//     const email = document.querySelector('#signInEmail').value;
//     const password = document.querySelector('#signInPassword').value;
//     const user = {email: email, password: password};
//     postLoginInfo(user);
// })

// function postLoginInfo(loginInfo){
//     fetch('http://localhost:5000/users/login', {
//         method: 'POST',
//         body: JSON.stringify(loginInfo),
//         headers: {
//             "Content-type": "application/json;charset=UTF-8"
//         }
//     })
//         .then(res => res.json())
//         .then(result => {
//             if (result) {
//                 window.location.reload();
//             }
//         })
// }

// When user click ADD TASK button

document.querySelector('#btn').addEventListener('click', function () {
    const task = document.querySelector('#task').value;
    const today = new Date().toLocaleString();
    const taskCondition = 'incomplete';
    const taskInfo = { task: task, date: today, condition: taskCondition, email: email };
    postToServer(taskInfo);
})

// post task 

function postToServer(postInfo) {
    fetch('https://rocky-hollows-69892.herokuapp.com/addTask', {
        method: 'POST',
        body: JSON.stringify(postInfo),
        headers: {
            "Content-type": "application/json;charset=UTF-8"
        }
    })
        .then(res => res.json())
        .then(result => {
            if (result) {
                window.location.reload();
            }
        })
}

// read data

function loadData() {
    loader(true);
    document.querySelector('.container').style.display = 'block';
    fetch(`https://rocky-hollows-69892.herokuapp.com/api/tasks/${email}`)
        .then(response => response.json())
        .then(data => {
            data.reverse();
            showUI(data);
        })
}

// Display LOADER/SPINNER When backend data isn't ready

function loader(show) {
    if (show) {
        document.querySelector('.loader').style.display = 'flex';
    }
    else {
        document.querySelector('.loader').style.display = 'none';
    }
}
// data show on UI

function showUI(data) {
    for (let i = 0; i < data.length; i++) {
        const { task, _id, date, condition } = data[i];
        //console.log(typeof (_id));
        const div = document.createElement('div');
        div.innerHTML = `<div class="card card${i}">
                            <div class="task task${i}">${task}</div>
                            <div class="date">
                                <small>${date}</small>
                            </div>
                         
                                <button onClick="completeTask('${_id}')" id="completeBtn">Complete</button>
                          
                         
                                <button onClick="loadSingleItem('${_id}')" id="editBtn">Edit</button>
                          
                           
                                <button onClick="deleteTask(${i}, '${_id}')" id="deleteBtn">Delete</button>
    
                        </div>`
        document.querySelector('.task-area').appendChild(div);
        if (condition === 'complete') {
            document.querySelector(`.task${i}`).style.textDecorationLine = 'line-through';
        }
    }
    loader(false);
}

// delete data

function deleteTask(i, id) {
    // window.location.replace(`http://localhost:5000/api/delete/${id}`);

    fetch(`https://rocky-hollows-69892.herokuapp.com/delete/${id}`, {
        methods: 'DELETE'
    })
        .then(res => res.json())
        .then(result => {
            if (result) {
                document.querySelector(`.card${i}`).style.display = 'none';
            }
        })
}

// Show single Item on UI

function showSingleItemUI(data) {
    document.querySelector('.container').style.display = 'none';
    const { task, _id, condition } = data;
    const div = document.createElement('div');
    div.innerHTML = `<div>
        <input name="updateTask" id="updateTask" value="${task}">
        <input name="updateCondition" id="updateCondition" value="${condition}">
        <button id="btnUpdate" onClick="updateValue('${_id}')">Update</button>
</div>`
    document.querySelector('body').appendChild(div);
}

// Load Single Data //

function loadSingleItem(id) {
    fetch(`https://rocky-hollows-69892.herokuapp.com/api/task/${id}`)
        .then(res => res.json())
        .then(data => {
            showSingleItemUI(data);
        })
}

// UPDATE Data //

function updateValue(id) {
    const updatedTask = document.querySelector('#updateTask').value;
    const updatedCondition = document.querySelector('#updateCondition').value
    const updatedData = { task: updatedTask, condition: updatedCondition };
    updateDocument(id, updatedData);
}

function updateDocument(id, updatedTask) {
    fetch(`https://rocky-hollows-69892.herokuapp.com/update/${id}`, {
        method: 'PATCH',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(updatedTask)
    })
        .then(res => res.json())
        .then(result => {
            if (result) {
                window.location.reload();
            }
        })
}

// Hit Complete Button // 

function completeTask(id) {
    const taskCondition = 'complete';
    const updatedTask = { condition: taskCondition };
    updateDocument(id, updatedTask);
}



