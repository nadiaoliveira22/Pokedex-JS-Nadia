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

async function getPokemonDetails(pokemon){
    return await fetch(pokemon.url)
    .then(async(response) => await response.json())
}

fetch(url)
    .then((response) => response.json())
    .then((jsonresponse) => jsonresponse.results)
    .then((list) => list.map(getPokemonDetails))
    .then((details) => Promise.all(details))
    .then((newList) => pokemonlist.innerHTML = newList.map(convertPokemonToLi).join(""))
    .catch((error) => console.log(error));
 