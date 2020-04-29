// ? Get all DOM
const searchButton = document.querySelector('#search-button');
const inputKeyword = document.querySelector('#search-input');

// ? Function retrieve data from API
function searchAnime() {
  fetch(`https://api.jikan.moe/v3/search/anime?type=anime&q=${inputKeyword.value}`)
    .then(response => response.json())
    .then(response => {
      const anime = response.results;
      let cards = '';
      anime.forEach(a => cards += showCard(a));
      const animeContainer = document.querySelector('#anime-list');
      animeContainer.innerHTML = cards;
      inputKeyword.value = '';

      // ? Ketika tonbol detail di-klik 
      const modalDetailButton = document.querySelectorAll('.modal-detail-button');
      modalDetailButton.forEach(btn => {
        btn.addEventListener('click', function () {
          const malId = this.dataset.mal_id;
          fetch(`https://api.jikan.moe/v3/anime/${malId}`)
            .then(response => response.json())
            .then(a => {
              const animeDetail = showAnimeDetail(a);
              const modalBody = document.querySelector('.modal-body');
              modalBody.innerHTML = animeDetail;

              // ? Ganti title modal
              const modalTitle = document.querySelector('#animeModalTitle');
              modalTitle.innerHTML = `${a.title}`;
            })
        });
      });
    });
};


// ?  Fetch to anime API (Jikan 時間) onclick button search
searchButton.addEventListener('click', () => {
  searchAnime();
});

// ? Fetch to anime API (Jikan 時間) when press ENTER
$('#search-input').on('keyup', (e) => {
  if (e.keyCode === 13) {
    searchAnime();
  }
})


function showCard(a) {
  return /*html*/ `<div class="col-md-4">
                    <div class="card mb-3">
                      <img src="${a.image_url}" class="card-img-top" alt="...">
                      <div class="card-body">
                        <h5 class="card-title">${a.title}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">Episode : ${a.episodes}</h6>
                        <a href="#" class="btn btn-primary modal-detail-button" data-toggle="modal" data-target="#animeDetailModal" data-mal_id="${a.mal_id}" >Show Detail</a>
                      </div>
                    </div>
                  </div>`
}

function showAnimeDetail(a) {
  return /*html*/ `<div class="container-fluid">
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
                  </div>`
}