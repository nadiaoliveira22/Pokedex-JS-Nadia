const API_URL = "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0";
const listaPokemon = document.getElementById("lista-pokemon");
const itensPorPagina = 20;

let paginaAtual = 1;
let todosPokemons = [];

function criarItemPokemon({ id, name, types, sprites }) {
  const tipo = types[0].type.name;
  const imagem = sprites?.other?.dream_world?.front_default || sprites?.front_default || "";
  return `
    <li class="pokemon ${tipo}">
      <span class="numero">#${id}</span>
      <img src="${imagem}" alt="${name}">
      <p class="nome">${name}</p>
    </li>
  `;
}

async function buscarDetalhes(pokemon) {
  const resposta = await fetch(pokemon.url);
  return resposta.json();
}

function mostrarPokemons() {
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const pagina = todosPokemons.slice(inicio, fim);

  listaPokemon.innerHTML = pagina.map(criarItemPokemon).join("");
  atualizarPaginacao();
}

function atualizarPaginacao() {
  const totalPaginas = Math.ceil(todosPokemons.length / itensPorPagina);
  const div = document.getElementById("paginacao");

  let html = `<button id="btnAnterior" ${paginaAtual === 1 ? "disabled" : ""}>Anterior</button>`;

  html += criarBotaoPagina(1, paginaAtual === 1);

  if (paginaAtual > 3) html += `...`;

  const inicio = Math.max(2, paginaAtual - 1);
  const fim = Math.min(totalPaginas - 1, paginaAtual + 1);
  for (let i = inicio; i <= fim; i++) {
    html += criarBotaoPagina(i, i === paginaAtual);
  }

  if (paginaAtual < totalPaginas - 2) html += `...`;

  if (totalPaginas > 1) html += criarBotaoPagina(totalPaginas, paginaAtual === totalPaginas);

  html += `<button id="btnProxima" ${paginaAtual === totalPaginas ? "disabled" : ""}>Próxima</button>`;

  div.innerHTML = html;
  adicionarEventos(totalPaginas);
}

function criarBotaoPagina(numero, ativo) {
  return `<button class="page-btn ${ativo ? "active" : ""}" data-page="${numero}">${numero}</button>`;
}

function adicionarEventos(totalPaginas) {
  document.getElementById("btnAnterior")?.addEventListener("click", () => {
    if (paginaAtual > 1) {
      paginaAtual--;
      mostrarPokemons();
    }
  });

  document.getElementById("btnProxima")?.addEventListener("click", () => {
    if (paginaAtual < totalPaginas) {
      paginaAtual++;
      mostrarPokemons();
    }
  });

  document.querySelectorAll(".page-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      paginaAtual = parseInt(btn.dataset.page);
      mostrarPokemons();
    });
  });
}

async function iniciar() {
  const resposta = await fetch(API_URL);
  const dados = await resposta.json();
  todosPokemons = await Promise.all(dados.results.map(buscarDetalhes));
  mostrarPokemons();
}

iniciar();
