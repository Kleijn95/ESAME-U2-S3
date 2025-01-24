const params = new URLSearchParams(window.location.search);
const productId = params.get("prodId");
console.log(productId);
const URL = productId
  ? "https://striveschool-api.herokuapp.com/api/product/" + productId
  : "https://striveschool-api.herokuapp.com/api/product/";

window.addEventListener("DOMContentLoaded", () => {
  // prendiamo i riferimenti degli elementi che vogliamo manipolare
  const submitBtn = document.getElementById("submit-btn");
  const subtitle = document.querySelector("h2 + h5");
  const delBtn = document.getElementById("delete-btn");

  // da qui in poi abbiamo un bivio
  // il codice si autodeterminerà sulle cose da fare al caricamento della pagina
  if (productId) {
    // se siamo qui è perché nella URL c'era un appId (siamo in fase di modifica)

    // gestione della UI in caso di modifica
    submitBtn.innerText = "Modifica prodotto";
    submitBtn.classList.add("btn-secondary");

    subtitle.innerText = "— Modifica prodotto";

    delBtn.classList.remove("d-none");
    delBtn.onclick = handleDelete; // la funzione è definita sotto, viene solo usata come REFERENCE
    // (così da far sapere al bottone quale funzione avviare al momento del suo click)

    // gestione del reperimento del dato in caso di modifica che pre-popolerà i campi
    // chiederò al server di darmi i dati corrispondenti all'id che abbiamo trovato arrivando su questa pagina
    fetch(URL, {
      method: "GET",

      headers: {
        // questo è importante e fondamentale quando stiamo inviando il payload
        // solo col content-type il server può capire che c'è un json da convertire
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

        // sto modificando i valori dei campi input, con i DATI PRECEDENTI contenuti nell'oggetto appena ricavato dal server tramite appointmentId
        form.elements.name.value = product.name;
        form.elements.description.value = product.description;
        form.elements.price.value = product.price;
        form.elements.imageUrl.value = product.imageUrl;
        form.elements.brand.value = product.brand;
      });
  } else {
    // se siamo qui è perché sulla barra degli indirizzi non c'era un appId e quindi siamo sul backoffice normale per la fase di creazione di una
    // nuova risorsa (appuntamento)

    // gestione della UI in caso di creazione
    submitBtn.innerText = "Aggiungi prodotto";
    submitBtn.classList.add("btn-success");

    subtitle.innerText = "— Crea nuovo prodotto";
  }
});

const form = document.getElementById("product-form");
const buttonReset = document.createElement("button");
buttonReset.type = "button";
buttonReset.classList.add("btn", "btn-primary", "mt-2");
buttonReset.innerText = "Resetta form";
buttonReset.addEventListener("click", function () {
  const hasConfirmed = confirm("Sei sicuro di voler resettare il form?");

  // Se l'utente conferma, si procede con il reset del modulo
  if (hasConfirmed) {
    form.reset();
  }
});
form.appendChild(buttonReset);

form.onsubmit = function (event) {
  event.preventDefault(); // Evito il refresh del browser

  const newProduct = {
    name: form.elements.name.value,
    description: form.elements.description.value,
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
    // la URL contiene già SICURAMENTE l'id alla fine dell'indirizzo (vedi sopra)
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
