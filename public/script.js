const API_URL = "http://localhost:3000/quadrinhos";
const container = document.querySelector("#quadrinhos .row");


function carregarQuadrinhos() {
  container.innerHTML = ""; 

  fetch(API_URL)
    .then(res => res.json())
    .then(quadrinhos => {
      quadrinhos.forEach(q => {
        const card = document.createElement("div");
        card.classList.add("col-md-3");
        card.innerHTML = `
          <div class="card h-100 text-center" onclick="abrirDetalhes(${q.id})" style="cursor:pointer;">
            <img src="imagens/${q.imagem}" class="card-img-top" alt="${q.titulo}">
            <div class="card-body">
              <h5 class="card-title">${q.titulo}</h5>
              <p class="card-text">${q.descricao}</p>
            </div>
          </div>`;
        container.appendChild(card);
      });
    })
    .catch(err => console.error("Erro ao carregar quadrinhos:", err));
}


function abrirDetalhes(id) {
  window.location.href = `detalhes.html?id=${id}`;
}


carregarQuadrinhos();
