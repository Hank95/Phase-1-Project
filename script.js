const API_KEY = "5dd59b3fb5f3ddffe05ee3a3306f88ff";
let logInID = 1;
// fetch(
//   `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&primary_release_year=2021&sort_by=popularity.desc`
// )
//   .then((res) => res.json())
//   .then((json) => console.log(json));

// fetch(`https://api.themoviedb.org/3/movie/744?api_key=${API_KEY}`)
//   .then((res) => res.json())
//   .then((json) => console.log(json));

function findMovie(movie) {
  fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${movie}&sort_by=vote_average.desc`
  )
    .then((res) => res.json())
    .then((json) => {
      console.log(json);
      json.results.forEach((movie) => renderMovie(movie));
    });
}
const content = document.querySelector("#content");

function renderMovie(movie) {
  console.log(movie.original_title);
  const container = document.createElement("div");
  container.className = "container";
  const divImage = document.createElement("div");
  divImage.className = "image";
  const image = document.createElement("img");
  image.src = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;
  divImage.append(image);
  const divDetails = document.createElement("div");
  divDetails.className = "details";
  const movieTitle = document.createElement("h2");
  movieTitle.textContent = movie.original_title;
  const movieDescription = document.createElement("h3");
  movieDescription.textContent = "Description:";
  const movieDescriptionContent = document.createElement("p");
  movieDescriptionContent.textContent = movie.overview;
  divDetails.append(movieTitle, movieDescription, movieDescriptionContent);
  const actionDiv = document.createElement("div");
  actionDiv.className = "action-div";
  const listButtonDiv = document.createElement("div");
  listButtonDiv.className = "list-button";
  const listButton = document.createElement("button");
  listButton.textContent = "Add to Watch List";
  listButton.className = "list-button";
  listButton.type = "button";
  listButtonDiv.append(listButton);
  actionDiv.append(listButtonDiv);
  container.append(divImage, divDetails, actionDiv);

  content.append(container);

  listButton.addEventListener("click", (e) => {
    e.preventDefault();
    addToList(movie, e, logInID);
    renderMyList(logInID);
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
      }).then(renderMyList(logInID));
    });
}

function currentMovies() {
  fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc`
  )
    .then((res) => res.json())
    .then((json) => json.results.forEach((newMovie) => renderMovie(newMovie)));
}
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
  currentTitle.innerText = "Popular";
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
  myListTitle.innerText = "My List";
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
  const movieInfoDiv = document.createElement("div");
  movieInfoDiv.className = "movie-info";
  const h3 = document.createElement("h3");
  const dateP = document.createElement("p");
  const ratingP = document.createElement("p");
  const watchedP = document.createElement("p");
  h3.textContent = movie.original_title;
  dateP.textContent = movie.dateAdded;
  ratingP.textContent = `${movie.vote_average}/10`;
  watchedP.textContent = "Watched: yes/no";

  movieInfoDiv.append(h3, dateP, ratingP, watchedP);

  movieDiv.append(img, movieInfoDiv);

  listContainer.append(movieDiv);
}

const mainTitle = document.querySelector("#main-title");

mainTitle.addEventListener("click", () => {
  window.location.reload();
});
