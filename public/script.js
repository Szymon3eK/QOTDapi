
function wyslij() {
  var response = grecaptcha.getResponse();

  var autor = document.getElementById("autor").value;
  var cytat = document.getElementById("cytat").value;
  var message = document.getElementById("message");

  if (autor == "" || cytat == "")
    return notsuccess("Nie wypelniles wszystkich danych!", "nie");
  if (response.length == 0)
    return notsuccess('Brak potwierdzenia że nie jesteś botem!', 'nie');


  if (confirm(`Czy na pewno chcesz dodać cytat? AUTOR: ${autor} CYTAT: ${cytat}`) == true) {
    wysylaniedobazy();
  } else {
    notsuccess('anulowano dodawanie cytatu!');
  }
}

function wysylaniedobazy() {
  var response = grecaptcha.getResponse();

  var autor = document.getElementById("autor").value;
  var cytat = document.getElementById("cytat").value;
  var message = document.getElementById("message");

  fetch(
    `http://${window.location.hostname}:3000/add?autor=${autor}&cytat=${cytat}`
  ).then((response) =>
    response.json().then((data) => {
      console.log(data);
      if (data.status == "OK") {
        success(data);
      } else {
        notsuccess("Wystąpił błąd!", "tak");
      }
    })
  );
}

function notsuccess(powod, kasowanie) {

  var audio = new Audio("etc\soundboard\error.mp3");

  var autor = document.getElementById("autor");
  var cytat = document.getElementById("cytat");
  var message = document.getElementById("message");

  if (kasowanie == "nie") {
      message.style.color = "red";
      message.innerHTML = powod;
      audio.play();
  } else {
      autor.value = "";
      cytat.value = "";
      message.style.color = "red";
      message.innerHTML = powod;
      audio.play();
  }

}

function success(data) {
  var autor = document.getElementById("autor");
  var cytat = document.getElementById("cytat");
  var message = document.getElementById("message");

  autor.value = "";
  cytat.value = "";
  message.style.color = "green";
  message.innerHTML = `Dodano cytat! <br><br> Cytat: ${data.cytat} <br> Autor: ${data.autor}`;
}