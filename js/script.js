//* Get all DOM *//
const searchButton = document.querySelector("#search-button");
const inputKeyword = document.querySelector("#search-input");
const modalTitle = document.querySelector("#animeModalTitle");
const animeContainer = document.querySelector("#anime-list");
const loading = document.querySelector("#loading-screen");

//* Retrieve data from API Jikan MOE *//
let getAnime = (keyword) => {
  loading.innerHTML = loadingSpinner;
  animeContainer.innerHTML = "";
  return fetch(`https://api.jikan.moe/v4/search/anime?q=${keyword}`)
    .then((res) => {
      if (!res.ok) {
        throw Error(res.statusText);
      }
      return res.json();
    })
    .then((res) => {
      if (res.results.length === 0) {
        loading.innerHTML = "";
        throw new Error("Anime not Found !");
      }
      return res.results;
    });
};

let getAnimeDetail = (malId) => {
  return fetch(`https://api.jikan.moe/v3/anime/${malId}`)
    .then((res) => {
      if (!res.ok) {
        throw Error(res.statusText);
      }
      return res.json();
    })
    .then((res) => res);
};

//* Update UI Function *//
const updateUI = (animes) => {
  let cards = "";
  animes.forEach((a) => (cards += showCard(a)));
  loading.innerHTML = "";
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
  try {
    let animes = await getAnime(inputKeyword.value);
    updateUI(animes);
  } catch (err) {
    alert(err);
  }
});

//* Event press ENTER *//
inputKeyword.addEventListener("keyup", async (e) => {
  if (e.keyCode === 13) {
    try {
      let animes = await getAnime(inputKeyword.value);
      updateUI(animes);
    } catch (err) {
      alert(err);
    }
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

const loadingSpinner = /*html*/ `
<div class="spinner-grow text-success" role="status">
  <span class="sr-only">Loading...</span>
</div>
<div class="spinner-grow text-danger" role="status">
  <span class="sr-only">Loading...</span>
</div>
<div class="spinner-grow text-warning" role="status">
  <span class="sr-only">Loading...</span>
</div>
<h1 className="h3">Loading...</h1>
`;

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
