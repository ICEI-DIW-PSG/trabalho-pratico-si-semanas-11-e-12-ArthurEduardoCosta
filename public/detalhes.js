document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"));
  const API_URL = "http://localhost:3000/quadrinhos";

  // Busca o quadrinho pelo ID no JSON Server
  fetch(`${API_URL}/${id}`)
    .then(res => {
      if (!res.ok) throw new Error("Quadrinho não encontrado.");
      return res.json();
    })
    .then(quadrinho => {
      mostrarDetalhes(quadrinho);
    })
    .catch(err => {
      console.error("Erro ao carregar o quadrinho:", err);
      document.getElementById("infoGeral").innerHTML = "<p>Quadrinho não encontrado.</p>";
    });
});

function mostrarDetalhes(item) {
  const info = document.getElementById("infoGeral");
  info.innerHTML = `
    <div class="row">
      <div class="col-md-4">
        <img src="img/${item.imagem}" class="info-img" alt="${item.titulo}">
      </div>
      <div class="col-md-8">
        <h2>${item.titulo}</h2>
        <p><strong>Ano de Lançamento:</strong> ${item.ano}</p>
        <p><strong>Autor(es):</strong> ${item.autor}</p>
        <p><strong>Editora:</strong> ${item.editora}</p>
        <p><strong>Personagens Principais:</strong> ${item.personagens}</p>
        <p><strong>Descrição:</strong> ${item.descricao}</p>

        <!-- Botões de ação CRUD -->
        <div class="mt-3">
          <button class="btn btn-warning me-2" onclick="editarQuadrinho(${item.id})">Editar</button>
          <button class="btn btn-danger" onclick="excluirQuadrinho(${item.id})">Excluir</button>
        </div>
      </div>
    </div>
  `;

  const fotos = document.getElementById("fotosSecundarias");
  fotos.innerHTML = "";

  if (item.fotos && item.fotos.length > 0) {
    item.fotos.forEach(f => {
      const div = document.createElement("div");
      div.classList.add("col-md-3");
      div.innerHTML = `<img src="img/${f}" alt="${item.titulo}" class="img-fluid rounded shadow-sm">`;
      fotos.appendChild(div);
    });
  }
}

//  Função para editar um quadrinho
function editarQuadrinho(id) {
  const novoTitulo = prompt("Novo título do quadrinho:");
  if (!novoTitulo) return;

  fetch(`http://localhost:3000/quadrinhos/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ titulo: novoTitulo })
  })
    .then(res => res.json())
    .then(() => {
      alert("Quadrinho atualizado com sucesso!");
      location.reload();
    })
    .catch(err => console.error("Erro ao atualizar:", err));
}

//  Função para excluir um quadrinho
function excluirQuadrinho(id) {
  if (!confirm("Deseja realmente excluir este quadrinho?")) return;

  fetch(`http://localhost:3000/quadrinhos/${id}`, { method: "DELETE" })
    .then(res => {
      if (!res.ok) throw new Error("Erro ao excluir");
      alert("Quadrinho excluído com sucesso!");
      window.location.href = "index.html";
    })
    .catch(err => console.error("Erro ao excluir:", err));
}
