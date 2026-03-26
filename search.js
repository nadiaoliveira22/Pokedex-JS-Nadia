let allPokemons = [];

async function fetchPokemons() {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
  const data = await response.json();
  allPokemons = data.results;
  console.log("Pokémons carregados:", allPokemons);
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

  console.log("Sugestões:", suggestions);

  suggestions.forEach(pokemon => {
    const li = document.createElement("li");
    li.textContent = pokemon.name;
    li.addEventListener("click", () => {
    document.getElementById("search-bar").value = pokemon.name;
    list.innerHTML = "";
    abrirDetalhes(pokemon.name);
    });
    
    list.appendChild(li);
  });
}

document.getElementById("search-bar").addEventListener("input", (event) => {
  indiceSelecionado = -1;
  showSuggestions(event.target.value);
});

let indiceSelecionado = -1;

document.getElementById("search-bar").addEventListener("keydown", (event) => {
  const itens = document.querySelectorAll("#autocomplete-list li");

  if (event.key === "ArrowDown") {
    indiceSelecionado = Math.min(indiceSelecionado + 1, itens.length - 1);
    atualizarDestaque(itens);
  }

  if (event.key === "ArrowUp") {
    indiceSelecionado = Math.max(indiceSelecionado - 1, 0);
    atualizarDestaque(itens);
  }

  if (event.key === "Enter" && indiceSelecionado >= 0) {
    const selecionado = itens[indiceSelecionado];
    document.getElementById("search-bar").value = selecionado.textContent;
    document.getElementById("autocomplete-list").innerHTML = "";
    indiceSelecionado = -1;
    abrirDetalhes(selecionado.textContent);
  }

  if (event.key === "Escape") {
    document.getElementById("autocomplete-list").innerHTML = "";
    indiceSelecionado = -1;
  }
});

function atualizarDestaque(itens) {
  itens.forEach((item, i) => {
    item.style.backgroundColor = i === indiceSelecionado ? "#e0e0e0" : "";
    item.style.cursor = "pointer";
  });
}
