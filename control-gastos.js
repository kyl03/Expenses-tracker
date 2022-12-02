
const totalElement = document.getElementById("totalAmount");
const addBtn = document.getElementById("addTransactionBtn");
const transactionsTable = document.getElementById("transactionsTable");

let allTransactionArray = [];

const myArrayFromLocalStorage = localStorage.getItem('myArray')
if (myArrayFromLocalStorage && myArrayFromLocalStorage.length) {
    allTransactionArray = JSON.parse(myArrayFromLocalStorage)
}



addBtn.addEventListener("click", addTransaction);

let lastId = 0;
let total = 0.00;
let totalIncome = 0.00;
let totalExpenses = 0.00;
function loadLocalData(){

    if(allTransactionArray.length>0){
        getTotal(); 
        getTotalIncome();
        getTotalExpenses();
        showAllTransactions();
        lastId= allTransactionArray[allTransactionArray.length-1].id;
     
    };
  
}
function showAllTransactions(){
    allTransactionArray.forEach(transaction => 
        showTransaction(transaction)
    );
}

function getTotal(){
    total = updateTotal("total");
    showData(total, totalElement);
}

function getTotalExpenses(){
    let totalExpenses = updateTotal("expenses");
    const totalExpensesElement = document.getElementById("totalExpenses");
    showData(totalExpenses, totalExpensesElement);
}

function updateTotal(transactionType){
    let total;
    switch(transactionType){
        case "expenses":
            total = allTransactionArray.filter(transaction=>transaction.amount.includes("-"))
            .reduce((sum, transaction)=> sum + parseFloat(transaction.amount), 0);
            console.log(total);
            break;
        case "income":
            total = allTransactionArray.filter(transaction=>!transaction.amount.includes("-"))
            .reduce((sum, transaction)=> sum + parseFloat(transaction.amount), 0);
            console.log(total);
            break;
        default:
            total = allTransactionArray.reduce((sum,transaction)=> sum + parseFloat(transaction.amount), 0);
            console.log(total);
            break;
    }
    return total;
}

function getTotalIncome(){
    const totalIncomeElement = document.getElementById("totalIncome");
    totalIncome = updateTotal("income");
    showData(totalIncome, totalIncomeElement);
}

function showData(value, element){
    element.innerText = value;

}
function showTransaction(transaction){
    const transactionElement = document.createElement("tr");
    transactionElement.innerHTML = `
    <td >${transaction.concept}</td>
    <td>${transaction.amount}</td>
  `;
    transactionsTable.appendChild(transactionElement);
}

function addTransaction(){
    const concept = document.getElementById("conceptInput");
    const amount = document.getElementById("amountInput");
    if(concept.value != "" && amount.value != ""){
        amount.value = amount.value.replace(",", ".");
        if(!isNaN(parseFloat(amount.value))){
            console.log(amount.value);
            let id = lastId+1
            let transaction = {
                id: id,
                concept: concept.value,
                amount: amount.value
            }
            allTransactionArray.push(transaction);
            localStorage.setItem('myArray', JSON.stringify(allTransactionArray));
            lastId+=1;
            updateTotals(amount.value);
            showTransaction(transaction, transactionsTable);
            concept.value= "";
            amount.value= "";
        } else{
            window.alert("Tiene que ser un numero")
        }
     

    }else{
        window.alert("Faltan datos");
    }


}


function updateTotals(amountAdded){
    total += parseFloat(amountAdded);
    getTotal();
    getTotalIncome();
    getTotalExpenses();

}


loadLocalData();