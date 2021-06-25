let API_KEY;
let logInID;
let userNom;

// // API search examples
// fetch(
//   `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&primary_release_year=2021&sort_by=popularity.desc`
// )
//   .then((res) => res.json())
//   .then((json) => console.log(json));

// fetch(
//   `https://api.themoviedb.org/3/movie/2280/credits?api_key=${API_KEY}&language=en-US`
// )
//   .then((res) => res.json())
//   .then((json) => console.log(json));

//
const listContainer = document.querySelector("#list-container");
const content = document.querySelector("#content");
const searchForm = document.querySelector("#search-form");
const theList = document.querySelector("#the-list");
const current = document.querySelector("#current");
const title = document.querySelector("#title");
const mainTitle = document.querySelector("#main-title");
const randomSection = document.getElementById("random-section");
const aboutBtn = document.getElementById("about");
const aboutSection = document.querySelector("#about-section");
const randomizerBtn = document.getElementById("random-button");

function findMovie(movie) {
  fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${movie}&sort_by=popularity.desc`
  )
    .then((res) => res.json())
    .then((json) => {
      // console.log(json);
      json.results.forEach((movie) => renderMovie(movie));
    });
}

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
    listButton.textContent = "Added!";
    addToList(movie, e, logInID);
  });
}
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
  ratingP.className = "ratingP";
  watchedP.textContent = "Seen it?";
  movieInfoDiv.append(dateP, h3, watchedP);

  movieDiv.append(deleteButton, img, movieInfoDiv, watched, ratingP);
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
function deleteMovie(movie, e) {
  console.log(movie);
  fetch(`http://localhost:3000/profile/${logInID}`)
    .then((res) => res.json())
    .then((json) => {
      const list = json.myList;
      let removeIndex = list.map((item) => item.id).indexOf(movie.id);
      list.splice(removeIndex, 1);
      patchList(list);
    });
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

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function randomMovies() {
  const randomNum = getRandomInt(500);
  const randomElement = getRandomInt(20);

  fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&page=${randomNum}`
  )
    .then((res) => res.json())
    .then((json) => {
      const featuredFilm = json.results[`${randomElement}`];
      renderMovie(featuredFilm);
    });
}

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

function renderMyList(logInID) {
  const myListTitle = document.createElement("h2");
  myListTitle.innerText = "MY LIST";
  title.append(myListTitle);
  fetch(`http://localhost:3000/profile/${logInID}`)
    .then((res) => res.json())
    .then((json) => json.myList.forEach((movie) => movieCard(movie)));
}
function renderRandom() {
  randomSection.classList.remove("hidden");
  randomMovies();
}

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  content.innerHTML = "";
  listContainer.innerHTML = "";
  aboutSection.className = "hidden";
  randomSection.classList.add("hidden");

  console.log(e.target.search.value);
  findMovie(e.target.search.value);
});

current.addEventListener("click", () => {
  content.innerHTML = "";
  listContainer.innerHTML = "";
  title.innerHTML = "";
  aboutSection.className = "hidden";
  randomSection.className = "hidden";

  const currentTitle = document.createElement("h2");
  currentTitle.innerText = "POPULAR";
  title.append(currentTitle);

  currentMovies();
});

theList.addEventListener("click", (e) => {
  content.innerHTML = "";
  listContainer.innerHTML = "";
  title.innerHTML = "";
  aboutSection.className = "hidden";
  randomSection.className = "hidden";
  renderMyList(logInID);
});
document.addEventListener("DOMContentLoaded", (e) => {
  renderRandom();
});

mainTitle.addEventListener("click", () => {
  // window.location.reload();
  content.innerHTML = "";
  listContainer.innerHTML = "";
  const landingTitle = document.querySelector("#title h2");
  landingTitle.innerHTML = "WELCOME TO THE WATCH LIST!";
  aboutSection.className = "hidden";
  title.append(landingTitle);

  renderRandom();
});

randomizerBtn.addEventListener("click", () => {
  // window.location.reload();
  content.innerHTML = "";
  randomMovies();
});

// about section
aboutBtn.addEventListener("click", () => {
  content.innerHTML = "";
  title.innerHTML = "";
  listContainer.innerHTML = "";
  aboutSection.classList.remove("hidden");
  const aboutTitle = document.createElement("h2");
  aboutTitle.innerText = "ABOUT";
  title.append(aboutTitle);
  randomSection.className = "hidden";
});

// /// My List yes/no switches
const switchers = [...document.querySelectorAll(".switcher")];
switchers.forEach((item) => {
  item.addEventListener("click", function () {
    switchers.forEach((item) =>
      item.parentElement.classList.remove("is-active")
    );
    this.parentElement.classList.add("is-active");
  });
});

// Login Functionality, its a mess
const formLogIn = document.querySelector(".form-login");
const formSignUp = document.querySelector(".form-signup");
const logInEmail = document.querySelector("#login-email");
const logInPassword = document.querySelector("#login-password");
const signUpEmail = document.querySelector("#signup-email");
const signUpPassword = document.querySelector("#signup-password");
const signUpPasswordConfirm = document.querySelector(
  "#signup-password-confirm"
);
const loginPage = document.querySelector("#loginPage");
const mainPage = document.querySelector("#main");

formLogIn.addEventListener("submit", (e) => {
  e.preventDefault();

  fetch(`http://localhost:3000/profile`)
    .then((res) => res.json())
    .then((json) => {
      json.forEach((user) => {
        console.log(typeof user.userName);
        console.log(user.apiKey);
        if (
          logInEmail.value === user.userName &&
          logInPassword.value === user.apiKey
        ) {
          logInID = user.id;
          API_KEY = user.apiKey;
          userNom = user.userName;

          renderContent();
        }
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
let newUserID = 8;
formSignUp.addEventListener("submit", (e) => {
  e.preventDefault();
  if (signUpPassword.value === signUpPasswordConfirm.value) {
    fetch("http://localhost:3000/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: signUpEmail.value,
        apiKey: signUpPassword.value,
        myList: [],
      }),
    });
    newUserID++;
    logInID = newUserID;
    API_KEY = signUpPassword.value;
    userNom = signUpEmail.value;

    renderContent();
  } else alert("Please check passwords and try again");
});

const logOut = document.querySelector("#logOut-div");

logOut.addEventListener("click", () => {
  window.location.reload();
});

function renderContent() {
  loginPage.classList.add("hidden");
  main.classList.remove("hidden");
  document.styleSheets[1].removeRule([0]);
  const uname = document.createElement("h4");
  uname.innerText = userNom;
  logOut.append(uname);
  renderRandom();
}
