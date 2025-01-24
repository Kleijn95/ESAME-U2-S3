const params = new URLSearchParams(window.location.search);
const productId = params.get("prodId");

const URL = "https://striveschool-api.herokuapp.com/api/product/";

console.log("RESOURCE ID", productId);

fetch("https://striveschool-api.herokuapp.com/api/product/" + productId, {
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
    }
  })
  .then((product) => {
    const container = document.getElementById("details-container");

    container.innerHTML = `
                    <h2>${product.name}</h2>
                    <p>${product.description}</p>
                     <img class="img-fluid" width=500px src="${product.imageUrl}" alt="${product.name}">

                    <p class="display-6 text-primary">${product.price}€</p>
                    <a href="./backoffice.html?prodId=${product._id}" class="btn btn-success me-4 mt-2">MODIFICA PRODOTTO</a>
                    <a href="./backoffice.html?prodId=${product._id}" class="btn btn-danger mt-2">CANCELLA PRODOTTO</a>
                    
                    `;
  })
  .catch((err) => console.log(err));
