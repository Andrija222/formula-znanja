const adminPassword = "admin123"; // Postavite vašu šifru ovde
const reservations = {}; // Objekat za čuvanje rezervacija

const daysOfWeek = ["Ponedeljak", "Utorak", "Sreda", "Četvrtak", "Petak", "Subota", "Nedelja"];

function reserve(button) {
    const row = button.parentElement.parentElement;
    const statusCell = row.querySelector('.status');
    const day = row.cells[0].innerText;
    const timeSlot = row.cells[1].innerText;

    if (statusCell.innerText === 'Slobodno') {
        const studentName = prompt('Unesite vaše ime:');
        if (studentName) {
            statusCell.innerText = 'Zauzeto';
            button.disabled = true;
            button.innerText = 'Zauzeto';
            reservations[`${day} ${timeSlot}`] = studentName; // Čuvanje rezervacije
            console.log(`Rezervacija za ${studentName} u terminu ${day} ${timeSlot}`);
            updateMiniTable();
        }
    }
}

function adminLogin() {
    const password = document.getElementById('adminPassword').value;
    if (password === adminPassword) {
        document.getElementById('adminControls').style.display = 'block';
        document.getElementById('adminWeekControl').style.display = 'block';
        document.getElementById('logoutButton').style.display = 'inline-block';
        addDeleteButtons();
        loadReservations();
    } else {
        alert('Pogrešna šifra!');
    }
}

function adminLogout() {
    document.getElementById('adminControls').style.display = 'none';
    document.getElementById('adminWeekControl').style.display = 'none';
    document.getElementById('logoutButton').style.display = 'none';
    document.getElementById('adminPassword').value = '';
    removeDeleteButtons();
}

function addTimeSlot() {
    const newDay = document.getElementById('newDay').value;
    const newTimeSlot = document.getElementById('newTimeSlot').value;
    if (newDay && newTimeSlot) {
        const table = document.getElementById('reservationTable');
        const newRow = table.insertRow(-1); // Dodajemo red na kraj tabele
        const dayCell = newRow.insertCell(0);
        const timeCell = newRow.insertCell(1);
        const statusCell = newRow.insertCell(2);
        const actionCell = newRow.insertCell(3);

        dayCell.innerText = newDay;
        timeCell.innerText = newTimeSlot;
        statusCell.innerText = 'Slobodno';
        statusCell.className = 'status';
        const button = document.createElement('button');
        button.innerText = 'Rezerviši';
        button.onclick = function() { reserve(button); };
        actionCell.appendChild(button);

        if (document.getElementById('adminControls').style.display === 'block') {
            const deleteButton = document.createElement('button');
            deleteButton.innerText = 'Obriši';
            deleteButton.className = 'delete-button';
            deleteButton.onclick = function() { deleteTimeSlot(newRow); };
            actionCell.appendChild(deleteButton);
        }

        sortTable();
    }
}

function loadReservations() {
    updateMiniTable();
}

function editReservation(timeSlot) {
    const newName = prompt('Unesite novo ime:', reservations[timeSlot]);
    if (newName) {
        reservations[timeSlot] = newName;
        updateMiniTable();
    }
}

function deleteReservation(timeSlot) {
    if (confirm(`Da li ste sigurni da želite da obrišete rezervaciju za termin ${timeSlot}?`)) {
        delete reservations[timeSlot];
        const rows = document.querySelectorAll('#reservationTable tr');
        rows.forEach(row => {
            if (`${row.cells[0].innerText} ${row.cells[1].innerText}` === timeSlot) {
                row.querySelector('.status').innerText = 'Slobodno';
                row.querySelector('button').disabled = false;
                row.querySelector('button').innerText = 'Rezerviši';
            }
        });
        updateMiniTable();
    }
}

function deleteTimeSlot(row) {
    const day = row.cells[0].innerText;
    const timeSlot = row.cells[1].innerText;
    if (confirm(`Da li ste sigurni da želite da obrišete termin ${day} ${timeSlot}?`)) {
        row.remove();
    }
}

function addDeleteButtons() {
    const rows = document.querySelectorAll('#reservationTable tr');
    rows.forEach((row, index) => {
        if (index > 0) { // Preskoči zaglavlje tabele
            const actionCell = row.cells[3];
            if (!actionCell.querySelector('.delete-button')) {
                const deleteButton = document.createElement('button');
                deleteButton.innerText = 'Obriši';
                deleteButton.className = 'delete-button';
                deleteButton.onclick = function() { deleteTimeSlot(row); };
                actionCell.appendChild(deleteButton);
            }
        }
    });
}

function removeDeleteButtons() {
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => button.remove());
}

function sortTable() {
    const table = document.getElementById('reservationTable');
    const rows = Array.from(table.rows).slice(1); // Izuzimamo prvi red (zaglavlje)
    rows.sort((a, b) => {
        const dayA = daysOfWeek.indexOf(a.cells[0].innerText);
        const dayB = daysOfWeek.indexOf(b.cells[0].innerText);
        const timeA = a.cells[1].innerText;
        const timeB = b.cells[1].innerText;
        return dayA - dayB || timeA.localeCompare(timeB);
    });
    rows.forEach(row => table.appendChild(row));
}

function updateWeek() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    if (startDate && endDate) {
        const weekRange = document.getElementById('weekRange');
        weekRange.innerText = `Nedelja od ${startDate} do ${endDate}`;
        document.getElementById('weekDisplay').style.display = 'block';
    } else {
        alert('Molimo unesite oba datuma.');
    }
}

function updateMiniTable() {
    const miniTable = document.getElementById('miniReservationTable');
    miniTable.innerHTML = `
        <tr>
            <th>Dan</th>
            <th>Vreme</th>
            <th>Ime</th>
            <th>Akcija</th>
        </tr>
    `; // Resetujemo mini tabelu
    for (const timeSlot in reservations) {
        const [day, time] = timeSlot.split(' ');
        const row = miniTable.insertRow();
        const dayCell = row.insertCell(0);
        const timeCell = row.insertCell(1);
        const nameCell = row.insertCell(2);
        const actionCell = row.insertCell(3);
        dayCell.innerText = day;
        timeCell.innerText = time;
        nameCell.innerText = reservations[timeSlot];

        const editButton = document.createElement('button');
        editButton.innerText = 'Izmeni';
        editButton.onclick = function() { editReservation(timeSlot); };
        actionCell.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Obriši';
        deleteButton.className = 'delete-button';
        deleteButton.onclick = function() { deleteReservation(timeSlot); };
        actionCell.appendChild(deleteButton);
    }
}