const API_KEY = "5dd59b3fb5f3ddffe05ee3a3306f88ff";
let logInID = 1;
// fetch(
//   `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&primary_release_year=2021&sort_by=popularity.desc`
// )
//   .then((res) => res.json())
//   .then((json) => console.log(json));

fetch(
  `https://api.themoviedb.org/3/movie/2280/credits?api_key=${API_KEY}&language=en-US`
)
  .then((res) => res.json())
  .then((json) => console.log(json));

function findMovie(movie) {
  fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${movie}&sort_by=vote_average.desc`
  )
    .then((res) => res.json())
    .then((json) => {
      // console.log(json);
      json.results.forEach((movie) => renderMovie(movie));
    });
}
const content = document.querySelector("#content");

function renderMovie(movie) {
  // console.log(movie);
  const container = document.createElement("div");
  container.className = "container";
  const divImage = document.createElement("div");
  divImage.className = "image";
  const image = document.createElement("img");
  image.src = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;
  if (movie.poster_path === null) {
    image.src = "./images/notFoundPic.jpg";
  }
  divImage.append(image);
  const divDetails = document.createElement("div");
  divDetails.className = "details";
  const movieTitle = document.createElement("h2");
  movieTitle.textContent = movie.original_title;
  const movieDescription = document.createElement("h3");
  movieDescription.textContent = "Description:";
  const movieDescriptionContent = document.createElement("p");
  movieDescriptionContent.textContent = movie.overview;
  const releaseDate = document.createElement("h4");
  releaseDate.className = "release-date";
  releaseDate.innerText = `Released: ${movie.release_date}`;
  divDetails.append(
    movieTitle,
    movieDescription,
    movieDescriptionContent,
    releaseDate
  );
  const actionDiv = document.createElement("div");
  actionDiv.className = "action-div";
  const listButtonDiv = document.createElement("div");
  listButtonDiv.className = "list-button";
  const listButton = document.createElement("button");
  listButton.textContent = "Add to Watch List";
  listButton.className = "list-button";
  listButton.type = "button";
  listButtonDiv.append(listButton);
  const ratingDiv = document.createElement("div");
  if (movie.vote_count === 0) {
    ratingDiv.innerText = "No Vote Yet";
    ratingDiv.classList = "ratingDiv noVote";
  } else {
    ratingDiv.innerText = `${movie.vote_average}/10`;
    if (movie.vote_average > 5) {
      ratingDiv.classList = "ratingDiv good-movie";
    } else {
      ratingDiv.classList = "ratingDiv bad-movie";
    }
  }
  actionDiv.append(listButtonDiv, ratingDiv);
  container.append(divImage, divDetails, actionDiv);

  content.append(container);

  listButton.addEventListener("click", (e) => {
    e.preventDefault();
    addToList(movie, e, logInID);
  });
}

function addToList(movie, e, logInID) {
  console.log(movie);
  console.log(e);
  fetch(`http://localhost:3000/profile/${logInID}`)
    .then((res) => res.json())
    .then((json) => {
      const list = json.myList;
      const movieWDate = movie;
      let today = new Date().toLocaleDateString();
      movieWDate.dateAdded = today;
      console.log(movieWDate);
      list.push(movie);
      console.log(list);
      fetch(`http://localhost:3000/profile/${logInID}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          myList: list,
        }),
      });
    });
}

function currentMovies() {
  fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc`
  )
    .then((res) => res.json())
    .then((json) =>
      json.results.forEach((newMovie) => {
        renderMovie(newMovie);
      })
    );
}
function updateMovie(movie, e, update) {
  fetch(`http://localhost:3000/profile/${logInID}`)
    .then((res) => res.json())
    .then((json) => {
      const list = json.myList;
      let index = list.map((item) => item.id).indexOf(movie.id);
      list.splice(index, 1, update);
      patchList(list);
    });
}

// Upcoming movies
// function upcomingMovies() {
//   fetch(
//     `https://api.themoviedb.org/3/movie/744/recommendations?api_key=${API_KEY}&language=en-US&page=1`
//   )
//     .then((res) => res.json())
//     .then(console.log)

// }
// upcomingMovies()

// function getCast() {
//   fetch(
//     `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc`
//   )
//     .then((res) => res.json())
//     .then((json) => json.results.forEach((newMovie) => {

//       const newMovieID = newMovie.id

//       fetch(`https://api.themoviedb.org/3/movie/${newMovieID}/credits?api_key=${API_KEY}&language=en-US`)
//       .then((res) => res.json())
//       .then((json) => json.cast.forEach(filmCast => {

// console.log(filmCast)
//       })

//     );
// }))
// }

// getCast()

///
function patchList(list) {
  fetch(`http://localhost:3000/profile/${logInID}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      myList: list,
    }),
  });
}
// function getCast() {
//   fetch(
//     `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc`
//   )
//     .then((res) => res.json())
//     .then((json) =>
//       json.results.forEach((newMovie) => {
//         const newMovieID = newMovie.id;
//         fetch(
//           `https://api.themoviedb.org/3/movie/${newMovieID}/credits?api_key=${API_KEY}&language=en-US`
//         )
//           .then((res) => res.json())
//           .then((json) =>
//             json.cast.forEach((filmCast) => {
//               console.log(filmCast);
//             })
//           );
//       })
//     );
// }

// getCast();
const searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  content.innerHTML = "";
  listContainer.innerHTML = "";

  console.log(e.target.search.value);
  findMovie(e.target.search.value);
});

const theList = document.querySelector("#the-list");

const current = document.querySelector("#current");
const title = document.querySelector("#title");
current.addEventListener("click", () => {
  content.innerHTML = "";
  listContainer.innerHTML = "";
  title.innerHTML = "";

  const currentTitle = document.createElement("h2");
  currentTitle.innerText = "POPULAR";
  title.append(currentTitle);

  currentMovies();
});

theList.addEventListener("click", (e) => {
  content.innerHTML = "";
  listContainer.innerHTML = "";
  title.innerHTML = "";
  renderMyList(logInID);
});
document.addEventListener("DOMContentLoaded", (e) => {
  currentMovies();
});

function renderMyList(logInID) {
  const myListTitle = document.createElement("h2");
  myListTitle.innerText = "MY LIST";
  title.append(myListTitle);
  fetch(`http://localhost:3000/profile/${logInID}`)
    .then((res) => res.json())
    .then((json) => json.myList.forEach((movie) => movieCard(movie)));
}

const listContainer = document.querySelector("#list-container");
function movieCard(movie) {
  const movieDiv = document.createElement("div");
  movieDiv.className = "movie-div";
  const img = document.createElement("img");
  img.src = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;
  img.className = "list-movie-img";
  const movieInfoDiv = document.createElement("div");
  movieInfoDiv.className = "movie-info";
  const h3 = document.createElement("h3");
  const dateP = document.createElement("p");
  const ratingP = document.createElement("p");
  const watchedP = document.createElement("p");
  const watched = document.createElement("div");
  watched.className = "button b2 button-10";

  // Watched switch
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "checkbox";
  checkbox.name = "checkbox";
  checkbox.checked = !movie.watched;
  const knobs = document.createElement("div");
  knobs.className = "knobs";
  const yesSpan = document.createElement("span");
  yesSpan.innerText = "YES";
  knobs.append(yesSpan);
  const layerDiv = document.createElement("div");
  layerDiv.className = "layer";
  watched.append(checkbox, knobs, layerDiv);
  checkbox.addEventListener("change", (e) => {
    let checkedMovie = movie;
    checkedMovie.watched = !e.target.checked;
    updateMovie(movie, e, checkedMovie);
    if (!e.target.checked) {
      movieDiv.append(sliderContainer);
    } else sliderContainer.remove();
  });

  // Rating Slider
  const sliderContainer = document.createElement("div");
  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = "1";
  slider.max = "10";
  slider.value = `${movie.vote_average}`;
  slider.className = "slider";
  sliderContainer.append(slider);
  slider.addEventListener("input", (e) => {
    ratingP.textContent = `${slider.value}/10`;
  });
  slider.addEventListener("change", (e) => {
    let newVoteMovie = movie;
    newVoteMovie.vote_average = slider.value;
    updateMovie(movie, e, newVoteMovie);
  });

  const deleteButton = document.createElement("a");
  deleteButton.className = "close";
  deleteButton.innerText = "X";
  h3.textContent = movie.original_title;
  dateP.textContent = `Added: ${movie.dateAdded}`;
  ratingP.textContent = `${movie.vote_average}/10`;
  watchedP.textContent = "Watched: yes/no";

  movieInfoDiv.append(dateP, h3, watchedP, watched, ratingP);

  movieDiv.append(deleteButton, img, movieInfoDiv);
  if (!checkbox.checked) {
    movieDiv.append(sliderContainer);
  }

  listContainer.append(movieDiv);

  deleteButton.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    deleteMovie(movie, e);
    e.target.parentNode.remove();
  });
  if (movie.id === 11031) {
    slider.max = "11";
    ratingP.textContent = `${slider.value}/11`;
    slider.addEventListener("input", (e) => {
      ratingP.textContent = `${slider.value}/11`;
    });
  }
}

const mainTitle = document.querySelector("#main-title");

mainTitle.addEventListener("click", () => {
  window.location.reload();
});

// about section
const aboutBtn = document.getElementById("about");

aboutBtn.addEventListener("click", () => {
  content.innerHTML = "";

  const aboutTitle = document.querySelector("div#title h2");
  aboutTitle.innerText = "ABOUT";

  const aboutP = document.getElementById("about-section");
  aboutP.removeAttribute("hidden");

  const tmdbImage = document.createElement("img");
  tmdbImage.id = "tmdb-logo";
  tmdbImage.src = "./images/TMDB_logo.svg";

  content.append(aboutP, tmdbImage);
});
