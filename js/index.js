const URL = "https://striveschool-api.herokuapp.com/api/product/";

fetch(URL, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzkzNTc2NmI3NDcwMTAwMTU4YjJhZTciLCJpYXQiOjE3Mzc3MDk0MTQsImV4cCI6MTczODkxOTAxNH0.jO_jlHxXIbH7MzCVQLgiSfhZLBCoif12IvEqZFCnDfo",
  },
})
  .then((resp) => {
    if (!resp.ok) {
      throw new Error("Errore nella richiesta");
    }
    return resp.json();
  })
  .then((products) => {
    console.log(products);

    const row = document.getElementById("products-wrapper");

    for (let index = 0; index < products.length; index++) {
      const element = products[index];
      console.log(element);

      const col = document.createElement("div");
      col.classList.add("col-3", "gx-2");

      const divCard = document.createElement("div");
      divCard.classList.add("card", "mt-2");

      const cardImg = document.createElement("img");
      cardImg.classList.add("card-img-top");
      cardImg.src = element.imageUrl;
      cardImg.alt = "...";

      const divBody = document.createElement("div");
      divBody.classList.add("card-body");

      const h5 = document.createElement("h5");
      h5.classList.add("card-title");
      h5.innerText = element.name;

      const p = document.createElement("p");
      p.classList.add("card-text");
      p.innerText = element.price + "$";

      const a = document.createElement("a");
      a.href = `./details.html?prodId=${element._id}`;
      a.classList.add("ms-2");
      a.innerText = "Vai ai dettagli";

      const button = document.createElement("button");
      button.type = "button";
      button.classList.add("btn", "btn-dark");
      button.innerText = "Modifica";

      button.addEventListener("click", function () {
        window.location.assign(`./backoffice.html?prodId=${element._id}`);
      });

      // Append elementi al DOM
      divBody.appendChild(h5);
      divBody.appendChild(p);
      divBody.appendChild(button);
      divBody.appendChild(a);
      divCard.appendChild(cardImg);
      divCard.appendChild(divBody);

      col.appendChild(divCard);

      row.appendChild(col); // Aggiungo la colonna alla riga
    }
  });
