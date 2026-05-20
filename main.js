const API_URL = "https://pokeapi.co/api/v2/pokemon?limit=151";
const listaPokemon = document.getElementById("lista-pokemon");
const itensPorPagina = 24;

let paginaAtual = 1;
let todosPokemons = [];

function mostrarLoading(mostrar) {
  let loadingDiv = document.getElementById("loading");
  if (mostrar && !loadingDiv) {
    loadingDiv = document.createElement("div");
    loadingDiv.id = "loading";
    loadingDiv.innerHTML = `<div class="loading-spinner">
      <div class="pokeball"></div>
      <p>Carregando Pokémon...</p>
    </div>`;
    document.body.appendChild(loadingDiv);
  }
  if (loadingDiv) {
    loadingDiv.style.display = mostrar ? "flex" : "none";
  }
}

function createPokemonCard(pokemon) {
  const imagem = pokemon.sprites.other?.dream_world?.front_default 
              || pokemon.sprites.other?.["official-artwork"]?.front_default 
              || pokemon.sprites.front_default;

  const pokemonCard = document.createElement("div");
  pokemonCard.classList.add("pokemon");
  pokemonCard.innerHTML = `
    <span class="numero">#${pokemon.id}</span>
    <img src="${imagem}" alt="${pokemon.name}">
    <h3>${pokemon.name}</h3>
  `;
  pokemonCard.addEventListener("click", () => {
    if (typeof abrirDetalhes === "function") {
      abrirDetalhes(pokemon.name);
    }
  });
  listaPokemon.appendChild(pokemonCard);
}

async function buscarDetalhes(pokemon) {
  const resposta = await fetch(pokemon.url);
  return resposta.json();
}

function mostrarPokemons() {
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const pagina = todosPokemons.slice(inicio, fim);
  
  listaPokemon.innerHTML = ""; 
  pagina.forEach(createPokemonCard);
  
  atualizarPaginacao();
}

function atualizarPaginacao() {
  const totalPaginas = Math.ceil(todosPokemons.length / itensPorPagina);
  const div = document.getElementById("paginacao");
  
  div.innerHTML = "";

  const btnAnterior = document.createElement("button");
  btnAnterior.textContent = "Anterior";
  btnAnterior.disabled = paginaAtual === 1;
  btnAnterior.addEventListener("click", () => {
    if (paginaAtual > 1) {
      paginaAtual--;
      mostrarPokemons();
    }
  });

  const btnProxima = document.createElement("button");
  btnProxima.textContent = "Próxima";
  btnProxima.disabled = paginaAtual >= totalPaginas;
  btnProxima.addEventListener("click", () => {
    if (paginaAtual < totalPaginas) {
      paginaAtual++;
      mostrarPokemons();
    }
  });

  div.appendChild(btnAnterior);
  
  const btn1 = document.createElement("button");
  btn1.className = `page-btn ${paginaAtual === 1 ? "active" : ""}`;
  btn1.textContent = "1";
  btn1.addEventListener("click", () => { paginaAtual = 1; mostrarPokemons(); });
  div.appendChild(btn1);

  if (paginaAtual > 3 && totalPaginas > 4) {
    const ellipsis = document.createElement("span");
    ellipsis.textContent = "...";
    div.appendChild(ellipsis);
  }

  const inicio = Math.max(2, paginaAtual - 1);
  const fim = Math.min(totalPaginas - 1, paginaAtual + 1);
  for (let i = inicio; i <= fim; i++) {
    const btn = document.createElement("button");
    btn.className = `page-btn ${i === paginaAtual ? "active" : ""}`;
    btn.textContent = i;
    btn.addEventListener("click", () => { paginaAtual = i; mostrarPokemons(); });
    div.appendChild(btn);
  }

  if (paginaAtual < totalPaginas - 2 && totalPaginas > 4) {
    const ellipsis = document.createElement("span");
    ellipsis.textContent = "...";
    div.appendChild(ellipsis);
  }

  if (totalPaginas > 1) {
    const btnTotal = document.createElement("button");
    btnTotal.className = `page-btn ${paginaAtual === totalPaginas ? "active" : ""}`;
    btnTotal.textContent = totalPaginas;
    btnTotal.addEventListener("click", () => { paginaAtual = totalPaginas; mostrarPokemons(); });
    div.appendChild(btnTotal);
  }

  div.appendChild(btnProxima);
}

async function carregarPokemons() {
  mostrarLoading(true);
  try {
    const resposta = await fetch(API_URL);
    const dados = await resposta.json();
    todosPokemons = await Promise.all(dados.results.map(buscarDetalhes));
    mostrarPokemons();
  } catch (erro) {
    console.error("Erro ao carregar:", erro);
    listaPokemon.innerHTML = "<p>Erro ao carregar Pokémon. Tente novamente.</p>";
  } finally {
    mostrarLoading(false);
  }
}

carregarPokemons();