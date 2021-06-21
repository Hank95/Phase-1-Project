fetch(
  "https://api.themoviedb.org/3/movie/550?api_key=5dd59b3fb5f3ddffe05ee3a3306f88ff"
)
  .then((res) => res.json())
  .then((json) => console.log(json));
