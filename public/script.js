
function wyslij() {

    var autor = document.getElementById('autor').value;
    var cytat = document.getElementById('cytat').value;
    var message = document.getElementById('message');
    var ptaszek = document.getElementById('ptaszek');

    console.log('Wyslano zapytanie...')

    if (autor == '' || cytat == '') return message.innerHTML = 'Wypełnij wszystkie pola!';
    if (!ptaszek.checked) return message.innerHTML = 'Zaznacz ptaszka!';

    fetch(`http://localhost:3000/add?autor=${autor}&cytat=${cytat}`)
        .then(res => success())
        .catch(err => message.innerHTML = 'Wystąpił błąd! Sprobuj ponownie za kilka minut lub poinformuj administaratora strony.');
}

function success() {
    var autor = document.getElementById('autor');
    var cytat = document.getElementById('cytat');
    var message = document.getElementById('message');
    var ptaszek = document.getElementById('ptaszek');

    ptaszek.checked = false;
    autor.value = '';
    cytat.value = '';
    message.innerHTML = 'Dodano cytat!';
}