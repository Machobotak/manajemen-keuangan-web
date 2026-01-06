const form = document.getElementById('financeForm');
const table = document.getElementById('dataTable');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

renderTable();

form.addEventListener('submit', function(event) {
    event.preventDefault();
    const transaction = {
        date: document.getElementById('date').value,
        desc: document.getElementById('desc').value,
        amount: document.getElementById('amount').value,
        type: document.getElementById('type').value
    };

    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));

    renderTable();
    form.reset();
});
function renderTable() {
    table.innerHTML = "";
    transactions.forEach(item=>{
        const row = `
        <tr>
            <td>${item.date}</td>
            <td>${item.desc}</td>
            <td>${item.amount}</td>
            <td>${item.type}</td>
        </tr>
        `;
        table.innerHTML += row;
    })
}