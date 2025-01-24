const params = new URLSearchParams(window.location.search);
const productId = params.get("prodId");
console.log(productId); // fino a riga 6 prendo l'eventuale id dall'URL e imposto variabile URL dinamica
const URL = productId
  ? "https://striveschool-api.herokuapp.com/api/product/" + productId
  : "https://striveschool-api.herokuapp.com/api/product/";

window.addEventListener("DOMContentLoaded", () => {
  const submitBtn = document.getElementById("submit-btn");
  const subtitle = document.querySelector("h2 + h5"); // elementi che cambieranno forma in base all'if
  const delBtn = document.getElementById("delete-btn");

  // creo un if che modificherà gli elementi E il fetch in base alla presenza o meno di un ID nell'URL (ovviamente mettendo DOMContentLoaded, al caricamento della pagina)

  if (productId) {
    // multiverso in cui c'è l'ID (qui essendoci l'ID possiamo modificare(PUT) o cancellare (DELETE) un prodotto in questo caso)

    // sotto modificherò quello che mi serve, in questo caso testo del bottone,il colore e il titolo del form
    submitBtn.innerText = "Modifica prodotto";
    submitBtn.classList.add("btn-secondary");

    subtitle.innerText = "— Modifica prodotto";

    delBtn.classList.remove("d-none"); // il bottone cancella essendo nell'if con ID "perderà" la classe d-none
    delBtn.onclick = handleDelete; // la funzione è definita sotto per ordine ma qui gli dico che onclick deve "attivare" la funzione

    //  intanto mi faccio un get per prendere i dati del prodotto specifico (mi riferisco a quell'ID)
    fetch(URL, {
      method: "GET",

      headers: {
        // solo col content-type il server può capire che c'è un json da convertire (su postman lo fa in automatico)
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzkzNTc2NmI3NDcwMTAwMTU4YjJhZTciLCJpYXQiOjE3Mzc3MDk0MTQsImV4cCI6MTczODkxOTAxNH0.jO_jlHxXIbH7MzCVQLgiSfhZLBCoif12IvEqZFCnDfo",
      },
    })
      .then((resp) => {
        if (resp.ok) {
          return resp.json();
        }
      })
      .then((product) => {
        console.log(product); // il server mi ritorna l'oggetto dell'appuntamento corrispondente all'appointmentId

        // sto impostando i valori del prodotto agli input-field, cosi che si capisca da che base si parte
        form.elements.name.value = product.name;
        form.elements.description.value = product.description;
        form.elements.price.value = product.price;
        form.elements.imageUrl.value = product.imageUrl;
        form.elements.brand.value = product.brand;
      });
  } else {
    // qui invece siamo nel multiverso in cui l'ID non c'è e quindi vorrò e potrò solo aggiungere nuovi prodotti

    // modifica del testo bottone, della classe e del titolo del form per essere "consono" all'ambiente
    submitBtn.innerText = "Aggiungi prodotto";
    submitBtn.classList.add("btn-success");

    subtitle.innerText = "— Crea nuovo prodotto";
  }
});

const form = document.getElementById("product-form");
const buttonReset = document.createElement("button");
buttonReset.type = "button";
buttonReset.classList.add("btn", "btn-primary", "mt-2"); // creato bottone reset e appeso al form
buttonReset.innerText = "Resetta form";
buttonReset.addEventListener("click", function () {
  const hasConfirmed = confirm("Sei sicuro di voler resettare il form?");

  // usando confirm faccio uscire un alert con Si e no e in base alla scelta il form si resetta o meno
  if (hasConfirmed) {
    form.reset();
  }
});
form.appendChild(buttonReset);

form.onsubmit = function (event) {
  event.preventDefault(); // Evito il refresh del browser

  const newProduct = {
    name: form.elements.name.value,
    description: form.elements.description.value, //seleziono tutti gli input da voler "mandare" al server"
    brand: form.elements.brand.value,
    imageUrl: form.elements.imageUrl.value,
    price: form.elements.price.value,
  };

  fetch(URL, {
    method: productId ? "PUT" : "POST",
    body: JSON.stringify(newProduct),
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzkzNTc2NmI3NDcwMTAwMTU4YjJhZTciLCJpYXQiOjE3Mzc3MDk0MTQsImV4cCI6MTczODkxOTAxNH0.jO_jlHxXIbH7MzCVQLgiSfhZLBCoif12IvEqZFCnDfo",
    },
  })
    .then((resp) => {
      if (!resp.ok) {
        throw new Error("Errore nella creazione del prodotto");
      }
      return resp.json();
    })
    .then((createdProd) => {
      if (!productId) {
        // avviso l'utente dell'avvenuta creazione
        alert("Prodotto con id " + createdProd._id + " creato correttamente!");

        // contestualmente resetto i campi del form, per prepararlo ad un altro inserimento
        form.reset();
      } else {
        // saremo qui dopo una modifica del dato
        alert("Prodotto con id " + createdProd._id + " modificato correttamente!");
      }
    });
};

const handleDelete = () => {
  // chiediamo conferma all'utente, visto che la cancellazione sarà irreversibile una volta effettuata
  const hasConfirmed = confirm("Sei sicuro di voler cancellare il prodotto?");

  // se l'utente aveva confermato si procede
  if (hasConfirmed) {
    fetch(URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzkzNTc2NmI3NDcwMTAwMTU4YjJhZTciLCJpYXQiOjE3Mzc3MDk0MTQsImV4cCI6MTczODkxOTAxNH0.jO_jlHxXIbH7MzCVQLgiSfhZLBCoif12IvEqZFCnDfo",
      },
    })
      .then((resp) => {
        if (resp.ok) {
          return resp.json();
        }
      })
      .then((deletedApp) => {
        // feedback all'utente ad avvenuta eliminazione
        alert("Abbiamo eliminato " + deletedApp.name + " con id " + deletedApp._id);
        // l'alert è bloccante, quindi il codice attenderà la sua chiusura per procedere oltre questo punto

        // questa operazione sposta l'utente di nuovo in homepage, perché non c'è più nulla da fare qui dopo che l'elemento si è eliminato
        window.location.assign("./index.html");
      })
      .catch((err) => console.log(err));
  }
};
