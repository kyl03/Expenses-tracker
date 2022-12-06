
const totalElement = document.getElementById("totalAmount");
const addBtn = document.getElementById("addTransactionBtn");
const transactionsTable = document.getElementById("transactionsTable");

let allTransactionArray = [];






addBtn.addEventListener("click", addTransaction);

let lastId ;
let total ;
let totalIncome ;
let totalExpenses ;
function loadLocalData() {
    const myArrayFromLocalStorage = localStorage.getItem('myArray')
    if (myArrayFromLocalStorage && myArrayFromLocalStorage.length) {
        allTransactionArray = JSON.parse(myArrayFromLocalStorage)
    }

    if (allTransactionArray.length > 0) {
        getTotal();
        getTotalIncome();
        getTotalExpenses();
        showAllTransactions();
        lastId = allTransactionArray[allTransactionArray.length - 1].id;

    };

}
function showAllTransactions() {
    let transactionNumber = 0;
    allTransactionArray.forEach(transaction =>
        showTransaction(transaction, transactionNumber += 1)
    );
}

function getTotal() {
    total = updateTotal("total");

    if (total > 0) {
        totalElement.style.color = "rgb(59, 228, 59)";
    } else{
        totalElement.style.color = "red"
    } 
    showData(total, totalElement);

}

function getTotalExpenses() {
    let totalExpenses = updateTotal("expenses");
    const totalExpensesElement = document.getElementById("totalExpenses");
    showData(totalExpenses, totalExpensesElement);
}

function updateTotal(transactionType) {
    let total;
    switch (transactionType) {
        case "expenses":
            total = allTransactionArray.filter(transaction => transaction.amount.includes("-"))
                .reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0);
            console.log(total);
            break;
        case "income":
            total = allTransactionArray.filter(transaction => !transaction.amount.includes("-"))
                .reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0);
            console.log(total);
            break;
        default:
            total = allTransactionArray.reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0);
            console.log(total);
            break;
    }
    return total;
}

function getTotalIncome() {
    const totalIncomeElement = document.getElementById("totalIncome");
    totalIncome = updateTotal("income");
    showData(totalIncome, totalIncomeElement);
}

function showData(value, element) {

    element.innerText = value;

}
function showTransaction(transaction, arrayPosition) {
    const transactionElement = document.createElement("tr");
    transactionElement.setAttribute("id", transaction.id);
    let borderRight;
    if (transaction.amount >= 0) {
        borderRight = "5px solid rgb(59, 228, 59)";
    } else  {
        borderRight = "5px solid red";
    }
    transactionElement.innerHTML =
        `
    <td class="start">${transaction.concept}</td>
    <td class="end" style="border-right: ${borderRight}">${transaction.amount}</td>
    <button class="btn"onclick="removeTransaction(${transaction.id})">Borrar</button>
    `;
    transactionsTable.appendChild(transactionElement);


}

function removeTransaction(transactionId) {
    let text = "¿Estás seguro de que quieres eliminar esta transacción?";
    if (confirm(text) == true) {
        removeElement(transactionId);
    }
}

function removeElement(transactionId) {
    let elementToBeRemoved = document.getElementById(transactionId);
    console.log(transactionId);
    elementToBeRemoved.remove();
    const indexOfObject = allTransactionArray.findIndex(object => {
        return object.id === transactionId;
    });

    allTransactionArray.splice(indexOfObject, 1);
    updateTotals();
}

function addTransaction() {
    const concept = document.getElementById("conceptInput");
    const amount = document.getElementById("amountInput");
    if (concept.value != "" && amount.value != "") {
        amount.value = amount.value.replace(",", ".");
        if (!isNaN(parseFloat(amount.value))) {
            console.log(amount.value);
            let id = lastId + 1
            let transaction = {
                id: id,
                concept: concept.value,
                amount: amount.value
            }
            allTransactionArray.push(transaction);
            localStorage.setItem('myArray', JSON.stringify(allTransactionArray));
            lastId += 1;
            updateTotals(amount.value);
            showTransaction(transaction, allTransactionArray.length);
            concept.value = "";
            amount.value = "";
        } else {
            window.alert("Tiene que ser un numero")
        }


    } else {
        window.alert("Faltan datos");
    }


}

function updateTotals(amountAdded) {
    total += parseFloat(amountAdded);
    getTotal();
    getTotalIncome();
    getTotalExpenses();
    localStorage.setItem('myArray', JSON.stringify(allTransactionArray));

}


loadLocalData();