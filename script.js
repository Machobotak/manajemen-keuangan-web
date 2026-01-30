const form = document.getElementById('financeForm');
const table = document.getElementById('dataTable');

const totalExpenseEl = document.getElementById('totalExpense');
const totalIncomeEl = document.getElementById('totalIncome');
const balanceEl = document.getElementById('balance');

fetchData();

function fetchData(){
    fetch("backend/get.php")
    .then(res => res.json())
    .then(data =>{
        renderTable(data);
    })
    .catch(err => console.error(err));
}

form.addEventListener('submit',function(event){
    event.preventDefault();

    const transaction = {
        date: document.getElementById('date').value,
        desc: document.getElementById('desc').value,
        amount: document.getElementById('amount').value,
        type: document.getElementById('type').value
    };

    fetch("backend/save.php",{
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body:JSON.stringify(transaction)
    })
    .then(res=> res.json())
    .then(()=>{
        fetchData();
        form.reset();
    }) 
    .catch(err=>console.error(err));
});

function renderTable(transactions){
    table.innerHTML = "";

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(item=>{
        const amount = Number(item.amount);

        if(item.type==="income"){
            totalIncome += amount;
        }else{
            totalExpense += amount;
        }

        const row = `
        <tr>
            <td>${item.date}</td>
            <td>${item.desc}</td>
            <td>Rp ${amount.toLocaleString()}</td>
            <td>${item.type}</td>
        </tr>
        `;
        table.innerHTML += row;
    });

    totalIncomeEl.textContent = `Rp ${totalIncome.toLocaleString()}`;
    totalExpenseEl.textContent = `Rp ${totalExpense.toLocaleString()}`;
    balanceEl.textContent = `Rp ${(totalIncome - totalExpense).toLocaleString()}`;
}