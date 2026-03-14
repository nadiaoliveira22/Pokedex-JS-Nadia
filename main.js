const url = "https://pokeapi.co/api/v2/pokemon?limit=50&offset=0"
const pokemonlist = document.getElementById("lista-pokemon")

function convertPokemonToLi(pokemon){
    console.log(pokemon.types[0].type.name)
    return `
        <li class="pokemon ${pokemon.types[0].type.name}">
            <p class="nome">${pokemon.name}</p>
            <img src="${pokemon.sprites.other.dream_world.front_default}" alt="Bulbasaur">
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