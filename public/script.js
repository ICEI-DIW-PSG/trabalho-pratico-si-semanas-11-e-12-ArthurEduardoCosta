// Lista dos quadrinhos
const quadrinhos = [
  {
    titulo: "Batman: A Piada Mortal",
    descricao: "A sombria origem do Coringa — uma das histórias mais intensas do Batman.",
    imagem: "piada-mortal-vitrine.jpg"
  },
  {
    titulo: "O Cavaleiro das Trevas",
    descricao: "Batman volta da aposentadoria para enfrentar um mundo em ruínas e o Superman.",
    imagem: "capa_cavaleiro-das-trevas.jpg"
  },
  {
    titulo: "Batman: Silêncio",
    descricao: "Mistério e traição marcam a chegada de Hush, um novo inimigo de Gotham.",
    imagem: "batman hush.jpg"
  },
  {
    titulo: "Watchmen",
    descricao: "Heróis questionam a moral e o poder — um clássico de Alan Moore.",
    imagem: "Watchmen.jpg"
  },
  {
    titulo: "Batman: Ano Um",
    descricao: "A origem definitiva do Cavaleiro das Trevas e sua primeira luta contra o crime.",
    imagem: "batman-ano-um.jpg"
  },
  {
    titulo: "Flashpoint",
    descricao: "Barry Allen muda o tempo e cria uma realidade onde Thomas Wayne é o Batman.",
    imagem: "flash_flashpoint_quadrinho_conheca__64b6520m8.jpg"
  },
  {
    titulo: "Justiça" ,
    descricao: "Heróis e vilões unem forças para enfrentar uma ameaça cósmica ao planeta.",
    imagem: "justice_dc_capa.jpg"
  },
  {
    titulo: "crise nas infinitas terras",
    descricao: "Um evento épico que redefine o multiverso DC e suas realidades paralelas.",
    imagem: "crise-nas-infinitas-terras.jpg"
  },
  {
    titulo: "batman vitória sombria",
    descricao: "Batman enfrenta uma nova onda de crimes em Gotham enquanto lida com seus próprios demônios.",
    imagem: "batman-vitoria-sombria.jpg"
  },
  {
    titulo: "superman Red son",
    descricao: "E se o Superman tivesse caído na União Soviética em vez dos EUA?",
    imagem: "superman-red-son.jpg"
  }
];

// Montar os cards
const container = document.querySelector("#quadrinhos .row");
quadrinhos.forEach((q, i) => {
  const card = document.createElement("div");
  card.classList.add("col-md-3");
  card.innerHTML = `
    <div class="card h-100 text-center" onclick="abrirDetalhes(${i})" style="cursor:pointer;">
      <img src="${q.imagem}" class="card-img-top" alt="${q.titulo}">
      <div class="card-body">
        <h5 class="card-title">${q.titulo}</h5>
        <p class="card-text">${q.descricao}</p>
      </div>
    </div>`;
  container.appendChild(card);
});

// Redirecionar para página de detalhes
function abrirDetalhes(index) {
  window.location.href = `detalhes.html?id=${index}`;
}



