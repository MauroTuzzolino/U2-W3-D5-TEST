const API_URL = "https://striveschool-api.herokuapp.com/api/product/";
const TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODE0NzllZDFjMjUwNDAwMTUxYWI2NTAiLCJpYXQiOjE3NDYxNzIzOTcsImV4cCI6MTc0NzM4MTk5N30.u8Ac726nS_MPU1v1Dlbh1CZEBgfTY5QmZoe1BrzxqBU";

const form = document.getElementById("product-form");
const productContainer = document.getElementById("product-container");
const confirmDeleteModal = new bootstrap.Modal(document.getElementById("confirmDeleteModal"));
let productToDelete = null;

form.addEventListener("submit", function (e) {
  e.preventDefault();
  let id = document.getElementById("product-id").value;
  let method = id ? "PUT" : "POST";
  let url = id ? API_URL + id : API_URL;

  let product = {
    name: document.getElementById("name").value,
    brand: document.getElementById("brand").value,
    description: document.getElementById("description").value,
    imageUrl: document.getElementById("imageUrl").value,
    price: parseFloat(document.getElementById("price").value),
  };

  fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: TOKEN,
    },
    body: JSON.stringify(product),
  })
    .then(function (res) {
      if (!res.ok) throw new Error("Errore nella richiesta del prodotto");
      return res.json();
    })
    .then(function (data) {
      if (method === "POST") {
        fetch(API_URL + data._id, {
          headers: { Authorization: TOKEN },
        })
          .then((res) => res.json())
          .then((product) => createCard(product))
          .catch((err) => showError("Errore durante il recupero del prodotto"));
      } else {
        updateCard(data);
      }

      form.reset();
      document.getElementById("product-id").value = "";
      document.getElementById("submit-btn").textContent = "Salva";
    })
    .catch(function (err) {
      console.log(err);
      showError("Si è verificato un errore durante il salvataggio del prodotto");
    });
});

function showError(message) {
  document.getElementById("error-message").textContent = message;
  document.getElementById("error-alert").style.display = "block";
}

function createCard(product) {
  let col = document.createElement("div");
  col.className = "col-md-4 mb-4";
  col.id = "card-" + product._id;
  col.innerHTML = `
  <div class="card h-100">
    <a href="details.html?id=${product._id}">
      <img src="${product.imageUrl}" class="card-img-top" alt="${product.name}">
    </a>
    <div class="card-body">
      <h5 class="card-title">${product.name}</h5>
      <h6 class="card-subtitle mb-2 text-muted">${product.brand}</h6>
      <p class="card-text">${product.description}</p>
      <p class="fw-bold">€ ${product.price.toFixed(2)}</p>
      <button class="btn btn-sm btn-warning me-2" onclick='editProduct(${JSON.stringify(product)})'>Modifica</button>
      <button class="btn btn-sm btn-danger" onclick='showDeleteModal("${product._id}")'>Elimina</button>
    </div>
  </div>
`;

  productContainer.appendChild(col);
}

function updateCard(product) {
  let card = document.getElementById("card-" + product._id);
  if (card) {
    card.querySelector(".card-img-top").src = product.imageUrl;
    card.querySelector(".card-title").textContent = product.name;
    card.querySelector(".card-subtitle").textContent = product.brand;
    card.querySelector(".card-text").textContent = product.description;
    card.querySelector(".fw-bold").textContent = "€ " + product.price.toFixed(2);
  }
}

function editProduct(product) {
  document.getElementById("product-id").value = product._id;
  document.getElementById("name").value = product.name;
  document.getElementById("brand").value = product.brand;
  document.getElementById("description").value = product.description;
  document.getElementById("imageUrl").value = product.imageUrl;
  document.getElementById("price").value = product.price;
  document.getElementById("submit-btn").textContent = "Aggiorna";
}

document.getElementById("reset-btn").addEventListener("click", function () {
  form.reset();
  document.getElementById("submit-btn").textContent = "Salva";
});

function showDeleteModal(id) {
  productToDelete = id;
  confirmDeleteModal.show();
}

document.getElementById("confirmDeleteBtn").addEventListener("click", function () {
  if (productToDelete) {
    fetch(API_URL + productToDelete, {
      method: "DELETE",
      headers: { Authorization: TOKEN },
    })
      .then(function (res) {
        if (!res.ok) {
          showError("Errore nella cancellazione del prodotto");
          return;
        }
        let card = document.getElementById("card-" + productToDelete);
        if (card) card.remove();
      })
      .catch(function (err) {
        showError("Errore nella cancellazione del prodotto");
      });
  }

  confirmDeleteModal.hide();
});

function loadInitialProducts() {
  document.getElementById("loading-spinner").style.display = "inline-block";

  fetch(API_URL, {
    headers: { Authorization: TOKEN },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Errore nel caricamento dei prodotti");
      return res.json();
    })
    .then((products) => {
      products.forEach((product) => createCard(product));
      document.getElementById("loading-spinner").style.display = "none";
    })
    .catch((err) => {
      console.log(err);
      showError("Errore nel caricamento dei prodotti");
      document.getElementById("loading-spinner").style.display = "none";
    });
}

loadInitialProducts();
