const API_URL = "http://localhost:3000/quadrinhos";
const container = document.querySelector("#quadrinhos .row");

//  Função principal: carrega os quadrinhos do JSON Server
function carregarQuadrinhos() {
  container.innerHTML = "<p class='text-center text-warning'>Carregando quadrinhos...</p>";

  fetch(API_URL)
    .then(res => {
      if (!res.ok) throw new Error("Erro ao buscar quadrinhos");
      return res.json();
    })
    .then(quadrinhos => {
      container.innerHTML = "";
      quadrinhos.forEach(q => {
        const card = document.createElement("div");
        card.classList.add("col-md-3");
        card.innerHTML = `
          <div class="card h-100 text-center shadow" onclick="abrirDetalhes(${q.id})" style="cursor:pointer;">
            <img src="img/${q.imagem}" class="card-img-top" alt="${q.titulo}">
            <div class="card-body">
              <h5 class="card-title">${q.titulo}</h5>
              <p class="card-text small">${q.descricao}</p>
            </div>
          </div>
        `;
        container.appendChild(card);
      });
    })
    .catch(err => {
      console.error("Erro ao carregar quadrinhos:", err);
      container.innerHTML = `<p class="text-danger text-center">Erro ao carregar dados 😢</p>`;
    });
}

// Abre a página de detalhes
function abrirDetalhes(id) {
  window.location.href = `detalhes.html?id=${id}`;
}

//  Função para adicionar um novo quadrinho
function adicionarQuadrinho(novoQuadrinho) {
  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(novoQuadrinho)
  })
  .then(res => res.json())
  .then(data => {
    console.log("Quadrinho adicionado:", data);
    carregarQuadrinhos();
  })
  .catch(err => console.error("Erro ao adicionar quadrinho:", err));
}

//  Função para atualizar um quadrinho existente
function atualizarQuadrinho(id, dadosAtualizados) {
  fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dadosAtualizados)
  })
  .then(res => res.json())
  .then(data => {
    console.log("Quadrinho atualizado:", data);
    carregarQuadrinhos();
  })
  .catch(err => console.error("Erro ao atualizar:", err));
}

//  Função para excluir um quadrinho
function excluirQuadrinho(id) {
  fetch(`${API_URL}/${id}`, { method: "DELETE" })
    .then(res => {
      if (res.ok) {
        console.log("Quadrinho removido com sucesso");
        carregarQuadrinhos();
      }
    })
    .catch(err => console.error("Erro ao excluir quadrinho:", err));
}

//  Inicializa
carregarQuadrinhos();
