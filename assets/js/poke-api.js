const pokeApi = {};

// Função auxiliar para obter stats específicas
function getStat(stats, statName) {
  const stat = stats.find((item) => item.stat.name === statName);
  return stat ? stat.base_stat : null;
}

// Converte detalhes da API em um objeto Pokemon
function convertPokeApiDetailToPokemon(pokeDetail) {
  const pokemon = new Pokemon();
  const { id, name, weight, height, types, stats, sprites } = pokeDetail;

  pokemon.number = id;
  pokemon.name = name;
  pokemon.peso = weight;
  pokemon.altura = height;

  pokemon.types = types.map((typeSlot) => typeSlot.type.name);
  pokemon.type = pokemon.types[0]; // Primeiro tipo como principal

  // Adiciona stats usando a função auxiliar
  pokemon.stats = {
    hp: getStat(stats, "hp"),
    atk: getStat(stats, "attack"),
    def: getStat(stats, "defense"),
    sAtk: getStat(stats, "special-attack"),
    sDef: getStat(stats, "special-defense"),
    spd: getStat(stats, "speed"),
  };

  pokemon.photo = sprites?.other?.["official-artwork"]?.front_default || "";

  return pokemon;
}

// Busca detalhes de um Pokémon pela URL
pokeApi.getPokemonDetail = async (pokemon) => {
  try {
    const response = await fetch(pokemon.url);
    const pokeDetail = await response.json();
    return convertPokeApiDetailToPokemon(pokeDetail);
  } catch (error) {
    console.error("Erro ao buscar detalhes do Pokémon:", error);
    throw error;
  }
};

// Busca lista de Pokémons com limite e offset
pokeApi.getPokemons = async (offset = 0, limit = 5) => {
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

  try {
    const response = await fetch(url);
    const { results } = await response.json();

    // Aguarda todas as requisições de detalhes
    const pokemonsDetails = await Promise.all(
      results.map(pokeApi.getPokemonDetail)
    );

    return pokemonsDetails;
  } catch (error) {
    console.error("Erro ao buscar lista de Pokémons:", error);
    throw error;
  }
};

// Busca detalhes de um Pokémon pelo ID
pokeApi.getPokemonByID = async (pokemonId) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;

  try {
    const response = await fetch(url);
    const pokeDetail = await response.json();
    return convertPokeApiDetailToPokemon(pokeDetail);
  } catch (error) {
    console.error(`Erro ao buscar Pokémon com ID ${pokemonId}:`, error);
    throw error;
  }
};
