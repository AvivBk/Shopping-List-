import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, remove ,onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const inputEl = document.getElementById("input-field-el");
const addBtnEl = document.getElementById("add-btn-el");
const shoppingListEl = document.getElementById("shopping-list-el");

const appSettings = {
    databaseURL: "https://myshoppinglist-a8bf6-default-rtdb.europe-west1.firebasedatabase.app",
}

const app = initializeApp(appSettings);
const appDataBase = getDatabase(app);
const repositoryList = ref(appDataBase, "ShoppingList");

let shoppingList = [];
let PathOfShoppingListInDB = "ShoppingList";

// actived when new value added to repository (firebase)
onValue(repositoryList, function (snapshot) {
    if(snapshot.exists()){
    let map = Object.entries(snapshot.val());
    clearListEl();
    UpdateListByMap(map);
    }
    else{
        shoppingListEl.innerHTML = "All Checked !";
    }
})

addBtnEl.addEventListener("click", function () {
    let inputValue = inputEl.value;
    push(repositoryList, inputValue);
    clearInputElValue();
})

function UpdateListByMap(map) {
    for (let i = 0; i < map.length; i++) {
        addValueToShoppingListEl(map[i][1], map[i][0]);
    }
}

function ConvertArrayToLinks(arr) {
    let list = "";
    for (let i = 0; i < arr.length; i++) {
        list += AddInputAsLinkStringTemplates(arr[i]);
    }
    shoppingListEl.innerHTML = list;
}

function ConvertMapToArray(map) {
    let arr = [];
    for (let i = 0; i < map.length; i++) {
        arr.push(map[i][1]);
    }
    return arr;
}

function addValueToShoppingListEl(ListItemValue, ListItemID) {
    let elem = createListItemElement(ListItemValue,ListItemID);
    addListItemElementToLsEl(elem);
}

function createListItemElement(ListItemValue, ListItemID) {
    let elem = document.createElement("li"); // creating list item element on doc
    elem.textContent = ListItemValue;
    
     elem.addEventListener("dblclick", function() {
        let exactLocationListItemInDB = ref(appDataBase, `${PathOfShoppingListInDB}/${ListItemID}`);
        remove(exactLocationListItemInDB);
    })
    
    return elem;
}

function addListItemElementToLsEl(elemItem) {
    shoppingListEl.append(elemItem);
}
// using templates we can use multiple lines in the string and it looks like html code string  
function AddInputAsLinkStringTemplates(value) {
    return `<li>
                ${value}
             </li>`
}

function clearInputElValue() {
    inputEl.value = "";
}

function clearListEl() {
    shoppingListEl.innerHTML = "";
}
