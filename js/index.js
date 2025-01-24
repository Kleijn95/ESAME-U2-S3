const URL = "https://striveschool-api.herokuapp.com/api/product/";

// Funzione per mostrare o nascondere lo spinner
const isLoading = function (loadingState) {
  const spinner = document.querySelector(".spinner-border");
  if (loadingState) {
    spinner.classList.remove("d-none");
  } else {
    spinner.classList.add("d-none");
  }
};

// Funzione per generare un messaggio di errore
const generateAlert = function (message) {
  const alertContainer = document.getElementById("alert-container");
  alertContainer.innerHTML = `
    <div class="alert alert-danger" role="alert">
      ${message}
    </div>`;
};

fetch(URL, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzkzNTc2NmI3NDcwMTAwMTU4YjJhZTciLCJpYXQiOjE3Mzc3MDk0MTQsImV4cCI6MTczODkxOTAxNH0.jO_jlHxXIbH7MzCVQLgiSfhZLBCoif12IvEqZFCnDfo",
  },
})
  .then((resp) => {
    if (resp.ok) {
      return resp.json();
    } else {
      throw new Error("Impossibile recuperare i prodotti. Riprova più tardi.");
    }
  })
  .then((products) => {
    isLoading(false);

    const row = document.getElementById("products-wrapper");
    row.innerHTML = ""; // Pulisce la riga per evitare duplicazioni

    products.forEach((product) => {
      const col = document.createElement("div");
      col.classList.add("col-6", "col-md-3", "gx-2");

      const divCard = document.createElement("div");
      divCard.classList.add("card", "mt-2");

      const cardImg = document.createElement("img");
      cardImg.classList.add("card-img-top");
      cardImg.src = product.imageUrl;
      cardImg.alt = product.name || "Immagine prodotto";

      const divBody = document.createElement("div");
      divBody.classList.add("card-body");

      const h5 = document.createElement("h5");
      h5.classList.add("card-title");
      h5.innerText = product.name;

      const p = document.createElement("p");
      p.classList.add("card-text");
      p.innerText = `${product.price} $`;

      const a = document.createElement("a");
      a.href = `./details.html?prodId=${product._id}`;
      a.classList.add("ms-2");
      a.innerText = "Vai ai dettagli";

      const button = document.createElement("button");
      button.type = "button";
      button.classList.add("btn", "btn-dark");
      button.innerText = "Modifica";
      button.addEventListener("click", function () {
        window.location.assign(`./backoffice.html?prodId=${product._id}`);
      });

      // Append elementi al DOM
      divBody.append(h5, p, button, a);
      divCard.append(cardImg, divBody);
      col.appendChild(divCard);
      row.appendChild(col);
    });
  })
  .catch((err) => {
    isLoading(false); // Mostra lo spinner in caso di errore
    console.error(err);
    generateAlert(err.message);
  })
  .finally(() => {
    isLoading(false);
  });
