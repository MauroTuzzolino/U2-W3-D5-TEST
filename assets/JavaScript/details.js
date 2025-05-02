const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

if (productId) {
  fetch("https://striveschool-api.herokuapp.com/api/product/" + productId, {
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODE0NzllZDFjMjUwNDAwMTUxYWI2NTAiLCJpYXQiOjE3NDYxNzIzOTcsImV4cCI6MTc0NzM4MTk5N30.u8Ac726nS_MPU1v1Dlbh1CZEBgfTY5QmZoe1BrzxqBU",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("product-name").textContent = data.name;
      document.getElementById("product-image").src = data.imageUrl;
      document.getElementById("product-brand").textContent = data.brand;
      document.getElementById("product-description").textContent = data.description;
      document.getElementById("product-price").textContent = data.price.toFixed(2);
    })
    .catch((error) => {
      console.error("Errore nel caricamento del prodotto:", error);
    });
}
