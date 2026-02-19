let editId = null;
const submitBtn = document.querySelector("form button");
const cancelBtn = document.getElementById("cancelEdit");

const form = document.getElementById('financeForm');
const table = document.getElementById('dataTable');

const totalExpenseEl = document.getElementById('totalExpense');
const totalIncomeEl = document.getElementById('totalIncome');
const balanceEl = document.getElementById('netBalance');


fetchData();

function fetchData(){
    fetch("backend/get.php")
    .then(res => res.json())
    .then(data =>{
        renderTable(data);

        const range = document.getElementById("rangeFilter").value;
        const filtered = filterTransactions(data,range);
        updateChart(filtered);
    })
    .catch(err => console.error(err));
}

document.getElementById("rangeFilter").addEventListener("change",fetchData);

form.addEventListener('submit',function(event){
    event.preventDefault();

    const transaction = {
        id:editId,
        date: document.getElementById('date').value,
        desc: document.getElementById('desc').value,
        amount: document.getElementById('amount').value,
        type: document.getElementById('type').value
    };

    const url = editId
    ? "backend/update.php"
    : "backend/save.php";

    fetch(url,{
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body:JSON.stringify(transaction)
    })
    .then(res=> res.json())
    .then(data=>{
        console.log("Respon SERVER: ",data);
        fetchData();
        form.reset();

        editId = null;
        submitBtn.textContent = "Tambah";
        cancelBtn.style.display = "none";
        const cancelBtn = document.getElementById("cancelEdit");
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
            <td>
                <button onclick="editTransaction('${item.id}')">edit</button>
                <button onclick="deleteTransaction('${item.id}')">hapus</button>
            </td>
        </tr>
        `;
        table.innerHTML += row;
    });

    totalIncomeEl.textContent = `Rp ${totalIncome.toLocaleString()}`;
    totalExpenseEl.textContent = `Rp ${totalExpense.toLocaleString()}`;
    balanceEl.textContent = `Rp ${(totalIncome - totalExpense).toLocaleString()}`;
}

function deleteTransaction(id){
    if(!confirm("Yakin ingin mengahapus transaksi ini?")){
        return;
    }

    fetch("backend/delete.php",{
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({id})
    })
    .then(res=>res.json())
    .then(()=>{
        fetchData();
    })
    .catch(err=>console.error(err));
}

function editTransaction(id){

    fetch("backend/get.php")
    .then(res=>res.json())
    .then(data=>{
        const item = data.find(t=>t.id === id);
        if(!item) return;
        document.getElementById("date").value=item.date;
        document.getElementById("desc").value=item.desc;
        document.getElementById("amount").value=item.amount;
        document.getElementById("type").value=item.type;

        editId = id;
        submitBtn.textContent = "Update";
        cancelBtn.style.display = "inline-block";
    });
}

cancelBtn.addEventListener("click",function(){
    editId = null;
    form.reset();

    submitBtn.textContent = "Tambah";
    cancelBtn.style.display = "none";
});

const themeToggle = document.getElementById("themeToggle");

if (localStorage.getItem("theme")===("dark")){
    document.body.classList.add("dark");
    themeToggle.checked = true;
}

themeToggle.addEventListener("change",()=>{
    const isDark = themeToggle.checked;

    document.body.classList.toggle("dark",isDark);

    localStorage.setItem("theme",isDark ? "dark":"light");

});

let chart;
const ctx = document.getElementById("financeChart");

function initChart(){
    chart = new Chart(ctx,{
        type:"bar",
        data:{
            labels:["Pemasukan","Pengeluaran"],
            datasets:[{
                label:"Jumlah (Rp)",
                data:[0,0],
                backgroundColor: ["#22c55e","#ef4444"],
                boderRadius : 8
            }]
        },
        options:{
            responsive: true,
            plugins:{
                legend:{display:false}
            }
        }
    });
}
initChart();

function filterTransactions(transactions,range){
    const now = new Date();
    let startDate;

    if(range === "today"){
        startDate = new Date(now.setHours(0,0,0,0));
    }else if(range === "7days") {
        startDate = new Date();
        startDate.setDate(startDate.getDate()-7);
    }else if(range === "30days"){
        startDate = new Date();
        startDate.setDate(startDate.getDate()-30);
    }

    return transactions.filter(t=> new Date(t.date)>= startDate);
}

function updateChart(transactions){
    let income = 0;
    let expense = 0;

    transactions.forEach(t=>{
        if(t.type === "income") income += Number(t.amount);
        else expense += Number(t.amount);
    });

    chart.data.datasets[0].data = [income,expense];
    chart.update()
}

