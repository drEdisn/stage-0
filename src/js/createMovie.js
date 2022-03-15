export default function createMovie(data, i, main) {
  const div = document.createElement('div');
  const image = document.createElement('div');
  const title = document.createElement('h3');
  const rate = document.createElement('span');
  const overview = document.createElement('div');
  const overtitle = document.createElement('h3');
  div.classList.add('movie');
  overview.classList.add('movie__overview');
  image.classList.add('movie__image');
  title.classList.add('movie__title');
  rate.classList.add('movie__rate');
  overview.textContent = `${data.results[i].overview}`;
  overtitle.textContent = 'Overview';
  image.style.backgroundImage = `url(https://image.tmdb.org/t/p/w500/${data.results[i].poster_path})`;
  title.textContent = `${data.results[i].title}`;
  rate.textContent = `${data.results[i].vote_average}`;
  rate.style.color = `${data.results[i].vote_average <= 5 ? `#FF0000` : data.results[i].vote_average >= 8 ? `#03910a` : `rgb(207, 135, 0)`}`;
  overview.append(overtitle);
  div.append(image, title, rate, overview);
  return main.append(div);
}