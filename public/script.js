
function wyslij() {

  var response = grecaptcha.getResponse();

  var autor = document.getElementById("autor").value;
  var cytat = document.getElementById("cytat").value;
  var message = document.getElementById("message");

  if (autor == "" || cytat == "")
    return (message.innerHTML = "Wypełnij wszystkie pola!");
  if (response.length == 0)
    return (message.innerHTML = 'Zaznacz pole "Nie jestem robotem"!');

  
  fetch(
    `http://${window.location.hostname}:3000/add?autor=${autor}&cytat=${cytat}`
  ).then((response) =>
    response.json().then((data) => {
      console.log(data);
      if (data.status == "OK") {
        success(data);
      } else {
        notsucces(data);
      }
    })
  );
}

function notsucces(data) {
  var autor = document.getElementById("autor");
  var cytat = document.getElementById("cytat");
  var message = document.getElementById("message");

  autor.value = "";
  cytat.value = "";
  message.innerHTML = `Wystąpił błąd!`;
}

function success(data) {
  var autor = document.getElementById("autor");
  var cytat = document.getElementById("cytat");
  var message = document.getElementById("message");

  autor.value = "";
  cytat.value = "";
  message.innerHTML = `Dodano cytat! <br><br> Cytat: ${data.cytat} <br> Autor: ${data.autor}`;
}
