const apiBaseURL = "https://pokeapi.co/api/v2";
const pokemonPerPage = 20;
const nameHome = $("#NameHome");
const filterTypes = document.querySelector("#FilterTypes");
const getUserName = queryString("userName");
const name = decodeURIComponent(getUserName).replace("%20", " ");
let currentPage = 1;
let loading = false;
nameHome.html(`Hi ${name}`);

window.onload = async () => {
  document.getElementById("Pikachu").style.left = "0px";
  document.getElementById("Pikachu").style.zIndex = "999";

  const pokemons = await handleFetchPokemons();
  buildElements(pokemons);
};

$("#BtnSearch").click(() => {
  $("#Search").toggleClass("custom-search-opened");
  $("#Search").focus();
  $("#labelSearch").toggleClass("opacity-0");
  $("#BtnSearch iconify-icon").toggleClass("text-blue");
});

$("#FormName").submit((event) => {
  event.preventDefault();
  const nameStart = $("#Name");

  nameStart.removeClass("border-error");

  if (nameStart.val() == "") {
    nameStart.addClass("border-error");
  } else {
    const passaValor = function (valor) {
      window.location = "home.html?userName=" + valor;
    };
    const userName = nameStart.val();
    passaValor(userName);
  }
});

const handleFetchPokemons = async (page = 1) => {
  if (loading) return;
  loading = true;

  const offSet = pokemonPerPage * (page - 1);

  const response = await fetch(
    `${apiBaseURL}/pokemon?limit=${pokemonPerPage}&offset=${offSet}`
  );

  const { results } = await response.json();

  loading = false;

  return results;
};

const handleFetchSpecies = async (url) => {
  const response = await fetch(url);

  const results = await response.json();

  return results;
};

const buildElements = async (pokemons) => {
  const base = document.getElementById("base");

  base.innerHTML = "";

  for (const pokemon of pokemons) {
    const cardElement = await createCard(pokemon);
    base.appendChild(cardElement);
  }
};

const createCard = async (pokemonData) => {
  const pokemon = await handleGetPokemonByUrl(pokemonData.url);
  const [firstType, secondType] = pokemon.types.map((type) => type.type.name);
  const normalizedFirstType = firstType.toLowerCase();
  const itemId = pokemon.id;
  const imageURL =
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";
  const imageLink = imageURL + itemId + ".png";

  const column = document.createElement("div");
  const card = document.createElement("div");
  const cardBody = document.createElement("div");
  const cardRow = document.createElement("div");
  const cardColumnInfo = document.createElement("div");
  const cardColumnImage = document.createElement("div");
  const cardBadgeFirst = document.createElement("div");
  const cardBadgeSecond = document.createElement("div");
  const nameArea = document.createElement("h5");
  const imageArea = document.createElement("img");
  const firstTypeArea = document.createElement("p");
  const descriptionArea = document.createElement("p");
  const idArea = document.createElement("div");
  const pokeId = document.createElement("p");

  column.className = "col-12 col-md-6 col-lg-4 col-xl-3 my-3 card-holder";
  card.className = "card border-0 shadow";
  cardBody.className = "card-body rounded-3";
  cardRow.className = "row d-flex justify-content-end";
  cardColumnInfo.className = "col-6";
  cardColumnImage.className = "col-6 d-flex justify-content-end";
  cardBadgeFirst.className = "badge-types";
  cardBadgeSecond.className = "badge-types";
  nameArea.className = "text-white text-start fw-bold mb-4 txt-uppercase";
  firstTypeArea.className =
    "text-white text-center mb-0 fw-semibold txt-uppercase";

  idArea.className = "text-white fw-bold";
  imageArea.className = "card-image";
  imageArea.src = imageLink;

  cardColumnImage.innerHTML = ` <img src="img/pokeball.png" alt="Pokeball background" class="card-pokeball">`;
  nameArea.innerHTML = pokemon.name;
  descriptionArea.innerHTML = pokemon.desc;
  pokeId.innerHTML = `#${pokemon.id}`;
  firstTypeArea.innerHTML = firstType;

  column.appendChild(card);
  card.appendChild(cardBody);
  cardBody.appendChild(cardRow);
  cardRow.appendChild(cardColumnInfo);
  cardColumnInfo.appendChild(nameArea);
  cardColumnInfo.appendChild(cardBadgeFirst);
  cardBadgeFirst.appendChild(firstTypeArea);
  if (secondType) {
    const secondTypeArea = document.createElement("p");
    secondTypeArea.className =
      "text-white text-center mb-0 fw-semibold txt-uppercase";
    secondTypeArea.innerHTML = secondType;

    cardColumnInfo.appendChild(cardBadgeSecond);
    cardBadgeSecond.appendChild(secondTypeArea);
  }
  cardColumnImage.appendChild(imageArea);
  cardRow.appendChild(cardColumnImage);
  cardColumnImage.appendChild(idArea);
  idArea.appendChild(pokeId);
  cardBody.classList.add(`bg-${normalizedFirstType}-color`);

  card.addEventListener("click", async () => {
    const species = await handleFetchSpecies(pokemon.species.url);
    const specieDescription = species.flavor_text_entries[7].flavor_text;
    const firstEggGroup =
      species.egg_groups[0].name.charAt(0).toUpperCase() +
      species.egg_groups[0].name.slice(1);
    const modalTitle = document.getElementById("modalTitle");
    const modalBody = document.getElementById("modal-body");
    const modalDescription = document.getElementById("description");
    const pokemonHeight = document.getElementById("height");
    const pokemonWeight = document.getElementById("weight");
    const eggGroups = document.getElementById("eggGroups");
    const eggCycle = document.getElementById("eggCycle");
    const pokeImageHolder = document.getElementById("pokeImageHolder");
    const pokeId = document.getElementById("pokeId");
    const pokeImage = document.createElement("img");
    const baseStat = document.getElementById("baseStats");
    baseStat.innerHTML = "";

    pokeImageHolder.innerHTML = "";

    pokemon.stats.forEach((stats) => {
      const statRow = document.createElement("div");
      const statNameColumn = document.createElement("div");
      const statValueColumn = document.createElement("div");
      const statProgressBarColumn = document.createElement("div");
      const statName = document.createElement("p");
      const statValue = document.createElement("p");

      statRow.className = "row mb-3";
      statNameColumn.className = "col-4";
      statValueColumn.className = "col-2";
      statProgressBarColumn.className = "col d-flex align-items-center";
      statName.className = "mb-0";
      statValue.className = "mb-0 fw-semibold";
      statProgressBarColumn.innerHTML = `
        <div class="progress w-100" role="progressbar" aria-valuenow="${stats.base_stat}" aria-valuemin="0" aria-valuemax="100">
          <div class="progress-bar bg-${normalizedFirstType}-color" id="progressBar" style="width: ${stats.base_stat}%"></div>
        </div>
      `;
      statName.innerHTML =
        stats.stat.name.charAt(0).toUpperCase() +
        stats.stat.name.slice(1).replace("-", " ");
      statValue.innerHTML = stats.base_stat;
      baseStat.appendChild(statRow);
      statRow.appendChild(statNameColumn);
      statNameColumn.appendChild(statName);
      statRow.appendChild(statValueColumn);
      statValueColumn.appendChild(statValue);
      statRow.appendChild(statProgressBarColumn);
    });

    modalBody.classList.add(`bg-${normalizedFirstType}-color`);
    modalTitle.classList.add("txt-uppercase");
    modalTitle.innerHTML = pokemon.name;
    modalDescription.innerHTML = specieDescription;
    pokemonHeight.innerHTML = pokemon.height + "cm";
    pokemonWeight.innerHTML = pokemon.weight + "kg";
    eggGroups.innerHTML = firstEggGroup;
    eggCycle.innerHTML = firstEggGroup;
    if (species.egg_groups.length > 1) {
      const secondEggGroup =
        species.egg_groups[1].name.charAt(0).toUpperCase() +
        species.egg_groups[1].name.slice(1);
      eggGroups.innerHTML = firstEggGroup + ", " + secondEggGroup;
      eggCycle.innerHTML = firstEggGroup + ", " + secondEggGroup;
    }
    pokeImage.src = imageLink;
    pokeImage.style = "height: 15rem; margin: auto;";
    pokeId.innerHTML = `#${pokemon.id}`;

    pokeImageHolder.appendChild(pokeImage);
    $("#modalDetails").modal("show");
  });

  return column;
};

const handleNextPage = async () => {
  currentPage += 1;

  const pokemons = await handleFetchPokemons(currentPage);

  buildElements(pokemons);
};

const handlePreviousPage = async () => {
  if (currentPage <= 1) return;

  currentPage -= 1;

  const pokemons = await handleFetchPokemons(currentPage);

  buildElements(pokemons);
};

const handleGetPokemonByUrl = async (url) => {
  const response = await fetch(url);
  return await response.json();
};

function queryString(parameter) {
  let loc = location.search.substring(1, location.search.length);
  let param_value = false;
  let params = loc.split("&");
  for (let i = 0; i < params.length; i++) {
    param_name = params[i].substring(0, params[i].indexOf("="));
    if (param_name == parameter) {
      param_value = params[i].substring(params[i].indexOf("=") + 1);
    }
  }
  if (param_value) {
    return param_value;
  } else {
    return undefined;
  }
}

document.querySelector("#Search").addEventListener("keyup", function () {
  let filtro = document.querySelector("#Search").value.toLowerCase();
  let itens = document.querySelectorAll("#base > .card-holder");

  itens.forEach(function (item) {
    let texto = item.querySelector("h5").textContent.toLowerCase();
    if (texto.includes(filtro)) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });
});

filterTypes.addEventListener("click", function (e) {
  const selectedType = e.target.textContent.toLowerCase();
  const cards = document.querySelectorAll("#base .card-holder");

  for (let card of cards) {
    const type = card.querySelector(".badge-types:first-of-type").textContent;

    if (type === selectedType) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  }
});
