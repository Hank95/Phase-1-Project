const API_KEY = "5dd59b3fb5f3ddffe05ee3a3306f88ff";

fetch(
  `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=vote_average.desc`
)
  .then((res) => res.json())
  .then((json) => console.log(json));

fetch(`https://api.themoviedb.org/3/movie/744?api_key=${API_KEY}`)
  .then((res) => res.json())
  .then((json) => console.log(json));

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
  movieDescription.textContent = "Description";
  const movieDescriptionContent = document.createElement("p");
  movieDescriptionContent.textContent = movie.overview;
  divDetails.append(movieTitle, movieDescription, movieDescriptionContent);
  const actionDiv = document.createElement("div");
  actionDiv.className = "action-div";
  const listButtonDiv = document.createElement("div");
  const listButton = document.createElement("button");
  listButton.textContent = "Add to Watch List";
  listButton.className = "list-button";
  listButtonDiv.append(listButton);
  actionDiv.append(listButtonDiv);

  container.append(divImage, divDetails, actionDiv);

  //   container.innerHTML = `<div class="image">
  //   <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="placeholder" />
  // </div>
  // <div class="details">
  //   <h2>${movie.original_title}</h2>
  //   <h3>Description</h3>
  //   <p>${movie.overview}</p>
  //   <h3>Genre</h3>
  //   <p></p>
  //   <h3>Where To Watch</h3>
  //   <a href="https://www.netflix.com/">Netflix</a>
  // </div>
  // <div class="action-div">
  //   <div>Likes: 0</div>
  //   <div><button>Like</button></div>
  //   <div><button class="comment-button">Comments</button></div>
  // </div>
  // </div>
  // <div class="comments hidden">
  // <h3>Comments:</h3>
  // <ul class="comments-list">
  //   <li>dhsfkljasdkjfhaksdjfklhasdlkfhlasdhfhasdfljkh</li>
  //   <li>kjhfdskjhfsda</li>
  //   <li>ihfkjsdhfksd</li>
  // </ul>
  // <form class="comment-form" action="submit">
  //   <input
  //     type="text"
  //     name="commment"
  //     id="comment"
  //     placeholder="Some whitty remark"
  //   />
  //   <input type="submit" value="Post" id="submit" />
  // </form>
  // </div>`;

  content.append(container);
}

const comments = document.querySelector(".comments");
const commentButton = document.querySelector(".comment-button");
let openComments = false;

commentButton.addEventListener("click", (e) => {
  openComments = !openComments;
  if (openComments) {
    comments.classList.add("hidden");
  } else {
    comments.classList.remove("hidden");
  }
});

const searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  content.innerHTML = "";

  console.log(e.target.search.value);
  findMovie(e.target.search.value);
});
