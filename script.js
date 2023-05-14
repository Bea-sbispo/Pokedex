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
    return;
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

  const [firstType, secondType] = pokemon.types.map((type) => type.type.name);

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

  const normalizedFirstType = firstType.toLowerCase();
  cardBody.classList.add(`bg-${normalizedFirstType}-color`);

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
  var loc = location.search.substring(1, location.search.length);
  var param_value = false;
  var params = loc.split("&");
  for (i = 0; i < params.length; i++) {
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
  console.log("banana");
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

  console.log(cards);

  for (let card of cards) {
    const type = card.querySelector(".badge-types:first-of-type").textContent;
    console.log(type);

    if (type === selectedType) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  }
});
