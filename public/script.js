const API_URL = "http://localhost:3000/quadrinhos";
const API_FAVORITOS = "http://localhost:3000/favoritos";

function verificarLogin() {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  
  const menuDeslogado = document.getElementById("menu-deslogado");
  const menuLogado = document.getElementById("menu-logado");
  const spanNome = document.getElementById("nomeUsuario");
  const navFavoritos = document.getElementById("nav-favoritos");
  const navCadastro = document.getElementById("nav-cadastro-item"); // O novo botão

  if (!menuDeslogado || !menuLogado) return;

  if (usuarioLogado) {
    // ESTÁ LOGADO
    menuDeslogado.classList.add("d-none");
    menuDeslogado.classList.remove("d-flex");

    menuLogado.classList.remove("d-none");
    menuLogado.classList.add("d-flex");

    if (navFavoritos) navFavoritos.classList.remove("d-none");
    if (navCadastro) navCadastro.classList.remove("d-none"); // Mostra botão Novo Item
    
    const primeiroNome = usuarioLogado.nome.split(' ')[0];
    if (spanNome) spanNome.innerText = `Olá, ${primeiroNome}!`;
  } else {
    // NÃO ESTÁ LOGADO
    menuLogado.classList.add("d-none");
    menuDeslogado.classList.remove("d-none");
    
    if (navFavoritos) navFavoritos.classList.add("d-none");
    if (navCadastro) navCadastro.classList.add("d-none"); // Esconde botão Novo Item
  }
}

function fazerLogout() {
  localStorage.removeItem("usuarioLogado");
  window.location.href = "index.html";
}

// --- LÓGICA DE FAVORITOS ---
async function verificarFavorito(quadrinhoId) {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (!usuarioLogado) return null;

  const res = await fetch(`${API_FAVORITOS}?usuarioId=${usuarioLogado.id}&quadrinhoId=${quadrinhoId}`);
  const dados = await res.json();
  return dados.length > 0 ? dados[0] : null;
}

async function toggleFavorito(btn, quadrinhoId) {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  
  if (!usuarioLogado) {
    alert("Você precisa fazer login para favoritar!");
    window.location.href = "login.html";
    return;
  }

  btn.disabled = true; 

  const favoritoExistente = await verificarFavorito(quadrinhoId);

  if (favoritoExistente) {
    await fetch(`${API_FAVORITOS}/${favoritoExistente.id}`, { method: "DELETE" });
    btn.innerHTML = "🤍";
    btn.classList.replace("btn-danger", "btn-outline-danger");
  } else {
    await fetch(API_FAVORITOS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuarioId: usuarioLogado.id, quadrinhoId: quadrinhoId })
    });
    btn.innerHTML = "❤️";
    btn.classList.replace("btn-outline-danger", "btn-danger");
  }
  
  btn.disabled = false;
}

// --- CARROSSEL E LISTAGEM ---
async function carregarCarrossel() {
  const carouselContainer = document.getElementById("carousel-conteudo");
  if (!carouselContainer) return;

  try {
    const resposta = await fetch(API_URL);
    const quadrinhos = await resposta.json();
    carouselContainer.innerHTML = "";

    quadrinhos.forEach((quadrinho, index) => {
      const activeClass = index === 0 ? "active" : "";
      const itemHTML = `
        <div class="carousel-item ${activeClass} h-100">
          <a href="detalhes.html?id=${quadrinho.id}">
            <img src="img/${quadrinho.imagem}" class="d-block w-100" style="height: 100%; object-fit: contain;">
            <div class="carousel-caption d-none d-md-block bg-dark bg-opacity-75 rounded">
              <h5 class="text-warning">${quadrinho.titulo}</h5>
            </div>
          </a>
        </div>`;
      carouselContainer.innerHTML += itemHTML;
    });
  } catch (erro) { console.error(erro); }
}

const containerLista = document.querySelector("#quadrinhos .row");

async function carregarQuadrinhos() {
  if (!containerLista) return;

  containerLista.innerHTML = "<p class='text-center text-warning'>Carregando quadrinhos...</p>";

  try {
    const res = await fetch(API_URL);
    const quadrinhos = await res.json();
    containerLista.innerHTML = "";

    for (const q of quadrinhos) {
      const favorito = await verificarFavorito(q.id);
      const btnClass = favorito ? "btn-danger" : "btn-outline-danger";
      const icon = favorito ? "❤️" : "🤍";

      const card = document.createElement("div");
      card.classList.add("col-md-3");
      card.innerHTML = `
        <div class="card h-100 text-center shadow position-relative">
          <img src="img/${q.imagem}" class="card-img-top" onclick="abrirDetalhes(${q.id})" style="cursor:pointer;">
          <div class="card-body">
            <h5 class="card-title">${q.titulo}</h5>
            <p class="card-text small">${q.descricao}</p>
            
            <button class="btn ${btnClass} btn-sm position-absolute top-0 end-0 m-2 rounded-circle" 
              onclick="toggleFavorito(this, '${q.id}')" title="Favoritar">
              ${icon}
            </button>
          </div>
        </div>
      `;
      containerLista.appendChild(card);
    }
  } catch (err) {
    console.error(err);
    containerLista.innerHTML = `<p class="text-danger text-center">Erro ao carregar.</p>`;
  }
}

// --- PÁGINA DE FAVORITOS ---
async function carregarPaginaFavoritos() {
  const lista = document.getElementById("listaFavoritos");
  if (!lista) return;

  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  
  if (!usuarioLogado) {
    window.location.href = "login.html";
    return;
  }

  try {
    lista.innerHTML = "<p class='text-center text-warning'>Buscando seus favoritos...</p>";

    const resFav = await fetch(`${API_FAVORITOS}?usuarioId=${usuarioLogado.id}`);
    
    if (!resFav.ok) throw new Error("Erro ao conectar com banco de favoritos.");

    const favoritos = await resFav.json();

    if (favoritos.length === 0) {
      lista.innerHTML = `
        <div class="col-12 text-center mt-5">
          <h3 class="text-secondary">Você ainda não tem favoritos 😢</h3>
          <a href="index.html" class="btn btn-warning mt-3">Ir para Quadrinhos</a>
        </div>
      `;
      return;
    }

    lista.innerHTML = "";

    for (const fav of favoritos) {
      const resQ = await fetch(`${API_URL}/${fav.quadrinhoId}`);
      if (resQ.ok) {
        const q = await resQ.json();
        
        lista.innerHTML += `
          <div class="col-md-3">
            <div class="card h-100 text-center shadow border-warning bg-black">
              <div style="position: relative;">
                <img src="img/${q.imagem}" class="card-img-top" onclick="abrirDetalhes(${q.id})" style="cursor:pointer; opacity: 0.9;">
              </div>
              <div class="card-body">
                <h5 class="card-title text-warning">${q.titulo}</h5>
                <button class="btn btn-outline-danger btn-sm mt-2 w-100" onclick="removerFavoritoNaPagina('${fav.id}')">
                  💔 Remover dos Favoritos
                </button>
              </div>
            </div>
          </div>
        `;
      }
    }

  } catch (erro) {
    console.error(erro);
    lista.innerHTML = `<div class="alert alert-danger text-center w-100">${erro.message}</div>`;
  }
}

async function removerFavoritoNaPagina(favoritoId) {
  if(!confirm("Remover dos favoritos?")) return;
  await fetch(`${API_FAVORITOS}/${favoritoId}`, { method: "DELETE" });
  carregarPaginaFavoritos();
}

// --- FUNÇÕES GERAIS ---
function abrirDetalhes(id) {
  window.location.href = `detalhes.html?id=${id}`;
}

// Função usada pelo novo formulário de cadastro
async function salvarNovoQuadrinho(novoQuadrinho) {
  try {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novoQuadrinho)
    });
    alert("Quadrinho cadastrado com sucesso!");
    window.location.href = "index.html"; // Volta para a Home
  } catch (error) {
    console.error(error);
    alert("Erro ao cadastrar.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  verificarLogin();
  carregarCarrossel();
  carregarQuadrinhos();

  if (document.getElementById("listaFavoritos")) {
    carregarPaginaFavoritos();
  }

  // Detecta se estamos na página de cadastro de item e ativa o formulário
  const formPagina = document.getElementById("formCadastroItemPagina");
  if (formPagina) {
    formPagina.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const novoQuadrinho = {
        titulo: document.getElementById("titulo").value,
        ano: document.getElementById("ano").value,
        autor: document.getElementById("autor").value,
        descricao: document.getElementById("descricao").value,
        imagem: document.getElementById("imagem").value,
        editora: "DC Comics"
      };
      
      salvarNovoQuadrinho(novoQuadrinho);
    });
  }
});