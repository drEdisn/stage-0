import createMovie from './createMovie.js';

async function getData(link) {
  const res = await fetch(link);
  const data = await res.json();
  addMovie(data);
}

const addMovie = (data) => {
  const main = document.querySelector('.main');
  const div = document. querySelectorAll('.movie');

  for(let key of div){
    main.removeChild(key);
  }
  for (let i = 0; i < 20; i++){
    createMovie(data, i, main);
  }
}

const getLink = () => {
  const field = document.querySelector('.search__field');
  
  if (field.value === '') {
    return 'https://api.themoviedb.org/3/movie/popular?api_key=6ee2a0135bb529fe48f0d29a4884ea2c';
  }else {
    return `https://api.themoviedb.org/3/search/movie/?api_key=6ee2a0135bb529fe48f0d29a4884ea2c&query=${field.value}`
  }
}

const search = () => {
  const field = document.querySelector('.search__field');
  const find = document.querySelector('.search__find');

  find.addEventListener('click', () => getData(getLink()));
  field.addEventListener('keyup', (key) => {key.code === 'Enter' ? getData(getLink()) : null});
}

const clear = () => {
  const clear = document.querySelector('.fa-times-circle');
  const field = document.querySelector('.search__field');
  clear.onclick = () => field.value = '';
}

getData(getLink());
search();
clear();
