let arr_container = []
let arr_id = []
const noteInput = document.getElementById("note-input")
const noteBtn = document.getElementById("note-btn")
const tabBtn = document.getElementById("tab-btn")
const container = document.getElementById("container")

$(document).ready(function () {
    if (JSON.parse(localStorage.getItem("arr_container")) === null) {
        arr_container = [];
        localStorage.setItem("arr_container", JSON.stringify(arr_container));
    } else {
        arr_container = (JSON.parse(localStorage.getItem("arr_container")));
    }
    if (JSON.parse(localStorage.getItem("arr_id")) === null) {
        arr_id = [];
        localStorage.setItem("arr_id", JSON.stringify(arr_id));
    } else {
        arr_id = (JSON.parse(localStorage.getItem("arr_id")));
    }
    $(".alert").hide();
    renderContainer();
});
function uniqueId() {
    while (true) {
        number = Math.floor(Math.random() * 100000) * 10;
        index = arr_id.indexOf(number);
        if (index < 0)
            return number;
    }
}
noteBtn.addEventListener("click", function () {
    if (noteInput.value != "") {
        let id = uniqueId();
        arr_id.push(id);
        arr_container.push({ "type": "note", "val": noteInput.value, "id": id })
        noteInput.value = ""
        localStorage.setItem("arr_container", JSON.stringify(arr_container));
        localStorage.setItem("arr_id", JSON.stringify(arr_id))
        renderContainer()
    }
    else {
        $(".alert").show();
        setTimeout(function () { $(".alert").hide(); }, 1000);
    }

})
tabBtn.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        let id = uniqueId();
        arr_id.push(id);
        url = tabs[0].url;
        // url = "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof"
        arr_container.push({ "type": "link", "val": url, "id": id })
        localStorage.setItem("arr_container", JSON.stringify(arr_container));
        localStorage.setItem("arr_id", JSON.stringify(arr_id))
        renderContainer()
    })
})
function renderContainer() {
    let listItems = "";
    arr_container.map(item => {
        if (item.type === "note") {
            listItems += `
            <div class="note  mb-3 p-2">
            <span>${item.val}</span>
            <br/>
            <button class="btn btn-danger deleteBtn" id="${item.id}" >Delete</button>
            </div>`
        }
        else {
            listItems += ` 
            <li class="link mb-3 p-2">
                <a target='_blank' href='${item.val}'>
                    ${item.val}
                </a>
                <br/>
                <button class="btn btn-danger deleteBtn" id="${item.id}" >Delete</button>
            </li>
            `
        }
    })
    container.innerHTML = listItems
}
container.addEventListener("click", (e) => {
    if (e.target.tagName === 'BUTTON') {
        const btn = e.target;
        let id = parseInt(btn.id);
        arr_id.splice(arr_id.indexOf(id), 1);
        arr_container.splice(arr_container.findIndex(a => a.id === id), 1);
        localStorage.setItem("arr_container", JSON.stringify(arr_container));
        localStorage.setItem("arr_id", JSON.stringify(arr_id))
        renderContainer();
    }
})
