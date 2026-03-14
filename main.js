const url = "https://pokeapi.co/api/v2/pokemon?limit=50&offset=0"
const pokemonlist = document.getElementById("lista-pokemon")

function convertPokemonToLi({ id, name, types, sprites }) {
  const tipo = types[0].type.name;
  const imagem = sprites?.other?.dream_world?.front_default || sprites?.front_default || "";
  const numero = id;
    return `
    <li class="pokemon ${tipo}">
      <span class="numero">#${numero}</span>
      <img src="${imagem}" alt="${name}">
      <p class="nome">${name}</p>
    </li>
  `;
}

async function getPokemonDetails(pokemon) {
    const response = await fetch(pokemon.url)
    return await response.json()
}

async function loadPokemons() {
    try {
        const response = await fetch(url)
        const jsonresponse = await response.json()
        const list = jsonresponse.results

        const details = await Promise.all(list.map(getPokemonDetails))

        pokemonlist.innerHTML = details.map(convertPokemonToLi).join("")
    } catch (error) {
        console.log(error)
    }
}

loadPokemons()