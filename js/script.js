//* Get all DOM *//
const searchButton = document.querySelector("#search-button");
const inputKeyword = document.querySelector("#search-input");
const modalTitle = document.querySelector("#animeModalTitle");
const animeContainer = document.querySelector("#anime-list");
const loading = document.querySelector("#loading-screen");
const resultTitle = document.querySelector('#recomendation-title')

//* Fetch function *//
const fetchAnime = async (query) => {
  const response = await fetch(`https://api.jikan.moe/v4/${query}`)
  const animes = await response.json()
  return animes
}

const pluralize = (count, noun, suffix = 's') =>
  `${count} ${noun}${count !== 1 ? suffix : ''}`;

//* Update UI Function *//
const updateUI = (animes, keyword, isRecommended = false) => {
  let cards = "";
  animes.forEach((a) => (cards += showCard(a, isRecommended)))
  loading.innerHTML = "";
  animeContainer.innerHTML = cards;
  resultTitle.innerHTML = isRecommended 
    ? `Recommendation anime for this season (${pluralize(animes.length, 'result')})`
    : `Search of anime '${keyword}' (${pluralize(animes.length, 'result')})`
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
    loading.innerHTML = loadingSpinner;
    resultTitle.innerHTML = ''
    animeContainer.innerHTML = "";
    const animes = await fetchAnime(`anime?q=${inputKeyword.value}`)
    updateUI(animes.data, inputKeyword.value);
  } catch (err) {
    alert(err);
    resultTitle.innerHTML = 'No anime found'
  }
});

//* Event press ENTER *//
inputKeyword.addEventListener("keyup", async (e) => {
  if (e.code.match('Enter')) {
    try {
      loading.innerHTML = loadingSpinner;
      resultTitle.innerHTML = ''
      animeContainer.innerHTML = "";
      if (!inputKeyword.value.length) {
        const animes = await fetchAnime('recommendations/anime')
        const animeData = [].concat.apply([], animes.data.map(anime => anime.entry))
        updateUI(animeData, '', true)
      } else {
        const animes = await fetchAnime(`anime?q=${inputKeyword.value}`)
        updateUI(animes.data, inputKeyword.value)
      }
    } catch (err) {
      alert(err)
      resultTitle.innerHTML = 'No anime found'
    }
  }
});

//* Fetch anime when DOM loaded *//
addEventListener('DOMContentLoaded', async () => {
  try {
    loading.innerHTML = loadingSpinner;
    animeContainer.innerHTML = '';
    const animes = await fetchAnime('seasons/now')

    //? Logic to extract recommendation anime data ?// 
    // const animeData = [].concat.apply([], animes.data.map(anime => anime.entry))
    // const uniqueAnimeData = Array.from(new Set(animeData.map(anime => anime.mal_id))).map(id => animeData.find(anime => anime.mal_id === id))

    updateUI(animes.data, '', true)
  } catch (err) {
    alert(err)
  }
})

//* Event binding for all click in document *//
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("modal-detail-button")) {
    const malId = e.target.dataset.mal_id;
    let animeDetail = await fetchAnime(`anime/${malId}`);
    updateUIDetail(animeDetail.data);
  }

  if (
    e.target.id.match('close-modal-btn') ||
    e.target.id.match('top-close-modal-btn') ||
    e.target.closest(".modal")
  ) stopVideo()
});

//* Event binding for all key typed in document *//
document.addEventListener('keyup', (e) => {
  if (e.code.match('Escape')) stopVideo()
})

const stopVideo = () => {
  const iframe = document.querySelector('#ytplayer')
  iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*')
}

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

let showCard = (a, isRecommended = false) => {
  const episodes = a.episodes ?? 'unknown'
  if (isRecommended) {
    return /*html*/ `
    <div class="col-6 col-sm-3 mb-4">
      <div class="card h-100">
        <img 
          src="${a.images.jpg.large_image_url}" 
          class="card-img-top" 
          alt="${a.title}" 
          height="370"
          style="object-fit: cover;"
        />
        <div class="card-body">
          <h5 class="card-title">${a.title}</h5>
        </div>
        <div class="card-footer">
          <a 
            href="#" 
            class="btn btn-primary modal-detail-button" 
            data-toggle="modal" 
            data-target="#animeDetailModal" 
            data-mal_id="${a.mal_id}"
          >
            Show Detail
          </a>
        </div>
      </div>
    </div>`;
  } else {
    return /*html*/ `
    <div class="col-6 col-sm-3 mb-4">
      <div class="card h-100">
        <img 
          src="${a.images.jpg.large_image_url}" 
          class="card-img-top" 
          alt="${a.title}" 
          height="370"
          style="object-fit: cover;"
        />
        <div class="card-body">
          <h5 class="card-title">${a.title}</h5>
          <h6 class="card-subtitle mb-2 text-muted">Episode : ${episodes}</h6>
        </div>
        <div class="card-footer">
          <a 
            href="#" 
            class="btn btn-primary modal-detail-button" 
            data-toggle="modal" 
            data-target="#animeDetailModal" 
            data-mal_id="${a.mal_id}"
          >
            Show Detail
          </a>
        </div>
      </div>
    </div>`;
  }
};

let showAnimeDetail = (a) => {
  const episodes = a.episodes ?? 'unknown'
  const rating = a.rating ?? 'none'
  return /*html*/ `
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-3">
        <img src="${a.images.jpg.image_url}" alt="" class="img-fluid">
      </div>
      <div class="col-md">
        <ul class="list-group">
          <li class="list-group-item">
            <h4>Japanese Title : ${a.title_japanese}</h4>
          </li>
          <li class="list-group-item"><strong>Type : </strong>${a.type}</li>
          <li class="list-group-item"><strong>Episode : </strong>${episodes}</li>
          <li class="list-group-item"><strong>Status : </strong>${a.status}</li>
          <li class="list-group-item"><strong>Rating : </strong>${rating}</li>
          <li class="list-group-item"><strong>Synopsis : </strong>${a.synopsis}</li>
          <li class="list-group-item"><div class="embed-responsive embed-responsive-16by9">
          <iframe class="embed-responsive-item" id="ytplayer" src="${a.trailer.embed_url}" allowfullscreen />
        </ul>
      </div>
    </div>
  </div>`;
};
