document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"));
  const API_URL = "http://localhost:3000/quadrinhos";


  fetch("quadrinhos.json")
    .then(res => res.json())
    .then(data => {
      const quadrinho = data.quadrinhos.find(q => q.id === id);
      if (quadrinho) mostrarDetalhes(quadrinho);
      else document.getElementById("infoGeral").innerHTML = "<p>Quadrinho não encontrado.</p>";
    })
    .catch(err => console.error("Erro ao carregar o JSON:", err));
});

function mostrarDetalhes(item) {
  const info = document.getElementById("infoGeral");
  info.innerHTML = `
    <div class="row">
      <div class="col-md-4">
        <img src="imagens/${item.imagem}" class="info-img" alt="${item.titulo}">
      </div>
      <div class="col-md-8">
        <h2>${item.titulo}</h2>
        <p><strong>Ano de Lançamento:</strong> ${item.ano}</p>
        <p><strong>Autor(es):</strong> ${item.autor}</p>
        <p><strong>Editora:</strong> ${item.editora}</p>
        <p><strong>Personagens Principais:</strong> ${item.personagens}</p>
        <p><strong>Descrição:</strong> ${item.descricao}</p>
      </div>
    </div>
  `;

  const fotos = document.getElementById("fotosSecundarias");
  fotos.innerHTML = "";

  item.fotos.forEach(f => {
    const div = document.createElement("div");
    div.classList.add("col-md-3");
    div.innerHTML = `<img src="imagens/${f}" alt="${item.titulo}">`;
    fotos.appendChild(div);
  });
}
