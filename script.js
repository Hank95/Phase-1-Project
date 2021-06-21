fetch(
  "https://api.themoviedb.org/3/movie/551?api_key=5dd59b3fb5f3ddffe05ee3a3306f88ff"
)
  .then((res) => res.json())
  .then((json) => console.log(json));

function findMovie(movie) {
  fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=5dd59b3fb5f3ddffe05ee3a3306f88ff&query=${movie}`
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
  container.innerHTML = `<div class="image">
  <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="placeholder" />
</div>
<div class="details">
  <h2>${movie.original_title}</h2>
  <h3>Description</h3>
  <p>${movie.overview}</p>
  <h3>Genre</h3>
  <p>Drama</p>
  <h3>Where To Watch</h3>
  <a href="https://www.netflix.com/">Netflix</a>
</div>
<div class="action-div">
  <div>Likes: 0</div>
  <div><button>Like</button></div>
  <div><button class="comment-button">Comments</button></div>
</div>
</div>
<div class="comments hidden">
<h3>Comments:</h3>
<ul class="comments-list">
  <li>dhsfkljasdkjfhaksdjfklhasdlkfhlasdhfhasdfljkh</li>
  <li>kjhfdskjhfsda</li>
  <li>ihfkjsdhfksd</li>
</ul>
<form class="comment-form" action="submit">
  <input
    type="text"
    name="commment"
    id="comment"
    placeholder="Some whitty remark"
  />
  <input type="submit" value="Post" id="submit" />
</form>
</div>`;

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
