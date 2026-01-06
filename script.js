const form = document.getElementById('financeForm');
const table = document.getElementById('dataTable');

form.addEventListener('submit', function(event) {
    event.preventDefault();
    const date = document.getElementById('date').value;
    const desc = document.getElementById('desc').value;
    const amount = document.getElementById('amount').value;
    const type = document.getElementById('type').value;

    const row = `
    <tr>
        <td>${date}</td>
        <td>${desc}</td>
        <td>${amount}</td>
        <td>${type}</td>
    </tr>
    `;
    table.innerHTML += row;
    form.reset();
});