let nome = null;

async function carregarDetalhes(nomePokemon) {
  nome = nomePokemon;

  document.getElementById("pokemon-detalhes").innerHTML = "";

  const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${nome}`);
  const data = await resposta.json();

  document.getElementById("pokemon-detalhes").innerHTML = `
    <h1>${data.name}</h1>
    <img src="${data.sprites.other["official-artwork"].front_default}" alt="${data.name}">
    <p><strong>Altura:</strong> ${data.height}</p>
    <p><strong>Peso:</strong> ${data.weight}</p>
    <p><strong>Tipos:</strong> ${data.types.map(t => t.type.name).join(", ")}</p>
    <p><strong>Habilidades:</strong> ${data.abilities.map(a => a.ability.name).join(", ")}</p>
    <div id="evolucoes"><h2>Evoluções</h2></div>
  `;

  const especieResposta = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${nome}`);
  const especieData = await especieResposta.json();

  const evoResposta = await fetch(especieData.evolution_chain.url);
  const evoData = await evoResposta.json();

  mostrarEvolucoes(evoData.chain);
}

async function mostrarEvolucoes(chain) {
  const evolucoesDiv = document.getElementById("evolucoes");

  const linha = document.createElement("div");
  linha.style.display = "flex";
  linha.style.justifyContent = "center";
  linha.style.gap = "20px";
  linha.style.marginTop = "15px";

  async function percorrer(chain) {
    const nome = chain.species.name;

    const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${nome}`);
    const data = await resposta.json();

    const card = document.createElement("div");
    card.style.textAlign = "center";

    card.innerHTML = `
      <p>${nome}</p>
      <img src="${data.sprites.other["official-artwork"].front_default}" 
           alt="${nome}" 
           style="width:120px; height:auto;">
    `;

    linha.appendChild(card);

    if (chain.evolves_to.length > 0) {
      for (const evo of chain.evolves_to) {
        await percorrer(evo);
      }
    }
  }

  await percorrer(chain);
  evolucoesDiv.appendChild(linha);
}
