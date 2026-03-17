let allPokemons = [];

async function fetchPokemons() {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
  const data = await response.json();
  allPokemons = data.results;
  console.log("Pokémons carregados:", allPokemons); // deve mostrar os 151
}
fetchPokemons();

function showSuggestions(searchValue) {
  const list = document.getElementById("autocomplete-list");
  list.innerHTML = "";

  if (!searchValue) return;

  const suggestions = allPokemons
    .filter(pokemon =>
      pokemon.name.toLowerCase().includes(searchValue.toLowerCase())
    )
    .slice(0, 5);

  console.log("Sugestões:", suggestions); // debug

  suggestions.forEach(pokemon => {
    const li = document.createElement("li");
    li.textContent = pokemon.name;
    li.addEventListener("click", () => {
      document.getElementById("search-bar").value = pokemon.name;
      list.innerHTML = "";
      onSearchedTextEntered(pokemon.name); // sua função de busca
    });
    list.appendChild(li);
  });
}

document.getElementById("search-bar").addEventListener("input", (event) => {
  showSuggestions(event.target.value);
});
