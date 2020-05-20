//* Get all DOM *//
const searchButton = document.querySelector("#search-button");
const inputKeyword = document.querySelector("#search-input");
const modalTitle = document.querySelector("#animeModalTitle");
const animeContainer = document.querySelector("#anime-list");

//* Retrieve data from API Jikan MOE *//
let getAnime = (keyword) => {
  return fetch(`https://api.jikan.moe/v3/search/anime?type=anime&q=${keyword}`)
    .then((response) => response.json())
    .then((response) => response.results);
};

let getAnimeDetail = (malId) => {
  return fetch(`https://api.jikan.moe/v3/anime/${malId}`)
    .then((response) => response.json())
    .then((response) => response);
};


//* Update UI Function *//
const updateUI = (animes) => {
  let cards = "";
  animes.forEach((a) => (cards += showCard(a)));
  animeContainer.innerHTML = cards;
  inputKeyword.value = "";
};

const updateUIDetail = (a) => {
  const animeDetail = showAnimeDetail(a);
  const modalBody = document.querySelector(".modal-body");
  modalBody.innerHTML = animeDetail;
  modalTitle.innerHTML = `${a.title}`;
};


//* onclick button search *//
searchButton.addEventListener("click", async () => {
  let animes = await getAnime(inputKeyword.value);
  updateUI(animes);
});

//* Event press ENTER *//
inputKeyword.addEventListener("keyup", async (e) => {
  if (e.keyCode === 13) {
    let animes = await getAnime(inputKeyword.value);
    updateUI(animes);
  }
});

//* Get Anime Detail when "Show Detail" is clicked with event binding *//
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("modal-detail-button")) {
    const malId = e.target.dataset.mal_id;
    let animeDetail = await getAnimeDetail(malId);
    updateUIDetail(animeDetail);
  }
});


let showCard = (a) => {
  return /*html*/ `
  <div class="col-md-4">
    <div class="card mb-3">
      <img src="${a.image_url}" class="card-img-top" alt="...">
      <div class="card-body">
        <h5 class="card-title">${a.title}</h5>
        <h6 class="card-subtitle mb-2 text-muted">Episode : ${a.episodes}</h6>
        <a href="#" class="btn btn-primary modal-detail-button" data-toggle="modal" data-target="#animeDetailModal" data-mal_id="${a.mal_id}" >Show Detail</a>
      </div>
    </div>
  </div>`;
};

let showAnimeDetail = (a) => {
  return /*html*/ `
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-3">
        <img src="${a.image_url}" alt="" class="img-fluid">
      </div>
      <div class="col-md">
        <ul class="list-group">
          <li class="list-group-item">
            <h4>Japanese Title : ${a.title_japanese}</h4>
          </li>
          <li class="list-group-item"><strong>Type : </strong>${a.type}</li>
          <li class="list-group-item"><strong>Episode : </strong>${a.episodes}</li>
          <li class="list-group-item"><strong>Status : </strong>${a.status}</li>
          <li class="list-group-item"><strong>Rating : </strong>${a.rating}</li>
          <li class="list-group-item"><strong>Synopsis : </strong>${a.synopsis}</li>
          <li class="list-group-item"><div class="embed-responsive embed-responsive-16by9">
          <iframe class="embed-responsive-item" src="${a.trailer_url}" allowfullscreen></iframe>
        </div></li>
        </ul>
      </div>
    </div>
  </div>`;
};