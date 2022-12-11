const totalElement = document.getElementById("totalAmount");
const addBtn = document.getElementById("addTransactionBtn");
const transactionsTable = document.getElementById("transactionsTable");
let lastTransactionId = 0;
let total;
let totalIncome;
let totalExpenses;
let allTransactionArray = [];

addBtn.addEventListener("click", addTransaction);

function loadLocalData() {
    const myArrayFromLocalStorage = localStorage.getItem('myArray')
    if (myArrayFromLocalStorage != null && JSON.parse(myArrayFromLocalStorage).length > 0) {
        console.log(myArrayFromLocalStorage.length);
        allTransactionArray = JSON.parse(myArrayFromLocalStorage)
        getTotal();
        getTotalIncome();
        getTotalExpenses();
        drawAllTransactions();
        lastTransactionId = allTransactionArray[allTransactionArray.length - 1].id;
    } else {
        lastTransactionId = 0;
    }
}
function drawAllTransactions() {
    let transactionNumber = 0;
    allTransactionArray.forEach(transaction =>
        drawTransaction(transaction, transactionNumber += 1)
    );
}

function getTotal() {
    total = updateTotal("total");
    if (total > 0) {
        totalElement.style.color = "rgb(59, 228, 59)";
    } else {
        totalElement.style.color = "red"
    }
    drawData(total, totalElement);

}

function getTotalExpenses() {
    let totalExpenses = updateTotal("expenses");
    const totalExpensesElement = document.getElementById("totalExpenses");
    drawData(totalExpenses, totalExpensesElement);
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
    drawData(totalIncome, totalIncomeElement);
}

function drawData(value, element) {
    element.innerText = Math.round(value * 100) / 100 + "$";
}

function drawTransaction(transaction) {
    const transactionElement = document.createElement("tr");
    transactionElement.setAttribute("id", transaction.id);
    let borderRight;
    if (transaction.amount >= 0) {
        borderRight = "5px solid rgb(59, 228, 59)";
    } else {
        borderRight = "5px solid red";
    }
    transactionElement.innerHTML =
        `
    <td class="start">${transaction.concept}</td>
    <td class="end" style="border-right: ${borderRight}">${Math.round(transaction.amount*100)/100}$</td>
    <button class="btn"onclick="askToConfirmRemoveAction(${transaction.id})">Borrar</button>
    `;
    transactionsTable.appendChild(transactionElement);
}

function askToConfirmRemoveAction(transactionId) {
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
    if (concept.value == "") {
        window.alert("Por favor, añade un concepto.");
    } else if (amount.value == "") {
        window.alert("Por favor, añade una cantidad");
    } else {
        amount.value = amount.value.replace(",", ".");
        if (!isNaN(parseFloat(amount.value))) {
            let id = lastTransactionId + 1
            let transaction = {
                id: id,
                concept: concept.value,
                amount: (Math.round(amount.value*100)/100)+""
            }
            allTransactionArray.push(transaction);
            localStorage.setItem('myArray', JSON.stringify(allTransactionArray));
            lastTransactionId += 1;
            updateTotals(amount.value);
            drawTransaction(transaction, allTransactionArray.length);
            concept.value = "";
            amount.value = "";
        }
    }
}

function updateTotals(amountAdded) {
    total += parseFloat(amountAdded);
    getTotalExpenses();
    getTotalIncome();
    getTotal();
    localStorage.setItem('myArray', JSON.stringify(allTransactionArray));


}


loadLocalData();