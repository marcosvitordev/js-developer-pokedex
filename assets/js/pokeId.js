const overlay = document.getElementById("overlay");
const pokemonDetail = document.getElementById("pokemonDetail");
let currentPokemonId = 1;

// Animação de fade
const fadeAnimation = [
  { opacity: 0 },
  { opacity: 1 },
];
const fadeTiming = {
  duration: 350,
  iterations: 1,
};
let animation;
let isVisible = false;

/**
 * Renderiza o modal do Pokémon com os detalhes fornecidos
 */
function renderPokemonModal(pokemon) {
  return `
    <div class="modal ${pokemon.type}">
      <span class="close" onclick="closePokemonDetail()">&times;</span>
      <span class="name">${pokemon.name}</span>
      <span class="number">#${pokemon.number}</span>
      <div class="info">
        <div class="row">
          <i class="fa fa-arrow-left" aria-hidden="true" onclick="navigatePokemon(-1)" id="previous"></i>
          <img src="${pokemon.photo}" alt="${pokemon.name}">
          <i class="fa fa-arrow-right" aria-hidden="true" onclick="navigatePokemon(1)" id="next"></i>
        </div>
        <div class="detail">
          <ol class="types row">
            ${pokemon.types
      .map((type) => `<li class="type ${type}">${type}</li>`)
      .join("")}
          </ol>
        </div>
        <div class="about">
          <div class="title"><hr> Sobre <hr></div>
          <p>Altura: ${pokemon.altura}</p>
          <p>Peso: ${pokemon.peso}</p>
          <ul class="stats-container">
            <div class="title"><hr> Status <hr></div>
            ${Object.entries(pokemon.stats)
      .map(
        ([statName, statValue]) => `
                  <li class='stats'>
                    <p>${statName}</p>
                    <p>${statValue.base_stat}</p>
                    <span class='progress-bar dark'>
                      <span style="width: ${statValue.base_stat > 100
            ? 100
            : statValue.base_stat
          }%" class='progress ${pokemon.type}'></span>
                    </span>
                  </li>`
      )
      .join("")}
          </ul>
        </div>
      </div>
    </div>
  `;
}

/**
 * Exibe o modal com o conteúdo do Pokémon
 */
function showModal(content) {
  overlay.style.display = "block";
  pokemonDetail.style.display = "block";
  pokemonDetail.innerHTML = content;

  // Ativar animação de fade
  animation = pokemonDetail.animate(fadeAnimation, fadeTiming);
}

/**
 * Oculta o modal com animação
 */
function closePokemonDetail() {
  if (isVisible) {
    animation.reverse();
    animation.addEventListener("finish", () => {
      overlay.style.display = "none";
      pokemonDetail.style.display = "none";
      isVisible = false;
    });
  }
}

/**
 * Mostra os detalhes de um Pokémon por ID
 */
async function showPokemonDetail(pokemonId) {
  try {
    const data = await pokeApi.getPokemonByID(pokemonId);
    currentPokemonId = pokemonId;
    const content = renderPokemonModal(data);
    showModal(content);

    // Adiciona evento para fechar clicando fora do modal
    overlay.addEventListener("click", closePokemonDetail);
    isVisible = true;
  } catch (error) {
    console.error("Erro ao carregar Pokémon:", error);
  }
}

/**
 * Navega entre os Pokémons (próximo ou anterior)
 */
function navigatePokemon(direction) {
  const totalPokemons = 151; // Total de Pokémons da geração 1
  currentPokemonId += direction;

  // Lógica de navegação cíclica
  if (currentPokemonId > totalPokemons) currentPokemonId = 1;
  if (currentPokemonId < 1) currentPokemonId = totalPokemons;

  showPokemonDetail(currentPokemonId);
}
