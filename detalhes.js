let nome = null;

async function carregarDetalhes(nomePokemon) {
  nome = nomePokemon;
  document.getElementById("pokemon-detalhes").innerHTML = "<p>Carregando...</p>";

  const [pokemonRes, especieRes] = await Promise.all([
    fetch(`https://pokeapi.co/api/v2/pokemon/${nome}`),
    fetch(`https://pokeapi.co/api/v2/pokemon-species/${nome}`)
  ]);

  const data       = await pokemonRes.json();
  const especieData = await especieRes.json();

  const numero      = data.id;
  const altura      = (data.height / 10).toFixed(1) + "m";
  const peso        = (data.weight / 10).toFixed(1) + "kg";
  const tipos       = data.types.map(t => `<span class="tipo-badge ${t.type.name}">${capitalize(t.type.name)}</span>`).join("");
  const habilidades = data.abilities.map(a => `<span>${capitalize(a.ability.name)}</span>`).join("");
  const imagem      = data.sprites.other["official-artwork"].front_default;

  document.getElementById("pokemon-detalhes").innerHTML = `
    <div id="coluna-esquerda">
      <div class="foto-circulo">
        <img src="${imagem}" alt="${data.name}" class="foto-principal">
      </div>
      <p class="numero">#${numero}</p>
      <h1>${capitalize(data.name)}</h1>
      <div class="tipos">${tipos}</div>
    </div>

    <div id="coluna-direita">
      <div class="stats-linha">
        <div class="stat-item">
          <span class="stat-label">Altura</span>
          <span class="stat-valor">${altura}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Peso</span>
          <span class="stat-valor">${peso}</span>
        </div>
        <div class="stat-item habilidades">
          <span class="stat-label">Habilidades</span>
          <span class="stat-valor">${habilidades}</span>
        </div>
      </div>

      <div id="evolucoes">
        <h2>Evoluções</h2>
        <div class="evolucoes-lista" id="evolucoes-lista"></div>
      </div>
    </div>
  `;

  const evoRes  = await fetch(especieData.evolution_chain.url);
  const evoData = await evoRes.json();
  await mostrarEvolucoes(evoData.chain);
}

async function mostrarEvolucoes(chain) {
  const lista = document.getElementById("evolucoes-lista");
  let numeroEvo = 1;

  async function percorrer(node) {
    const nomePoke = node.species.name;
    const res      = await fetch(`https://pokeapi.co/api/v2/pokemon/${nomePoke}`);
    const data     = await res.json();
    const imagem   = data.sprites.other["official-artwork"].front_default;
    const n        = numeroEvo++;

    const card = document.createElement("div");
    card.className = "evolucao-item";
    card.innerHTML = `
      <img src="${imagem}" alt="${nomePoke}">
      <span class="evo-numero">#${n}</span>
      <span class="evo-nome">${capitalize(nomePoke)}</span>
    `;
    lista.appendChild(card);

    for (const evo of node.evolves_to) {
      await percorrer(evo);
    }
  }

  await percorrer(chain);
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}