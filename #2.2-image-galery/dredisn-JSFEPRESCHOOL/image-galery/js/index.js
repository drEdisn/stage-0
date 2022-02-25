let startPage = 1;

async function getData(input, page) {
  const res = await fetch(`https://api.unsplash.com/search/photos?query=${input}&page=${page}&per_page=30&client_id=AJw7PDVNp3mvpMsod27jWBymrPpltRwEgSYyI-0EbEg`);
  const data = await res.json();
  showData(data);
  clickPage(data.total_pages);
};

const showData = (data) => {
  const container = document.querySelector('.main__container');
  data.results.map((item) => {
    const image_content = document.createElement('div');
    const image = document.createElement('div');    
    const download = document.createElement('a');
    const close_image = document.createElement('div');
    image_content.classList.add('content__image');
    image.classList.add('image');
    image.style.backgroundImage = `url(${item.urls.regular})`;
    download.setAttribute('href', `${item.urls.regular}`);
    download.setAttribute('download', '');
    image_content.append(image, close_image,download);
    return container.append(image_content);
  })
  clickImage();
}

const getImage = () => {
  const input = document.querySelector('.search__item');
  deleteImage();
  localStorage.setItem('search', input.value);
  input.value === '' ? getData('spring', 1) : getData(input.value, 1);
}

const deleteImage = () => {
  const allImage = document.querySelectorAll('.content__image');
  allImage.forEach((item) => {item.remove()});
}

const clickPage = (totalPage) => {
  const pageButton = document.querySelectorAll('.page__item');
  pageButton[1].onclick = () => {if (startPage == totalPage) {startPage = 1; deleteImage(); start(startPage);}else {deleteImage(); start(++startPage);}}
  pageButton[0].onclick = () => {if (startPage == 1) {startPage = totalPage; deleteImage(); start(startPage);}else {deleteImage(); start(--startPage);}}
};

window.onload = searchData = (key) => { 
  if (key === 'Enter') {getImage()}
  else if (key === 'click'){getImage()}
}

window.onload = clearInput = () => {
  const input = document.querySelector('.search__item');
  const clearButton = document.querySelector('.fa-times-circle');
  clearButton.onclick = () => input.value = '';
}

const addClass = (item) => {
  const body = document.querySelector('.body');
  const overlay = document.querySelector('.ov');
  item.classList.toggle('content__focus');
  item.children[0].classList.toggle('focus');
  body.classList.toggle('overflow');
  overlay.classList.toggle('overlay');
  item.children[1].classList.toggle('close__image');
  item.children[2].classList.toggle('download__button');
}

const clickImage = () => {
  const image = document.querySelectorAll('.content__image');
  image.forEach((item) => {
    item.children[0].onclick = () => item.classList.contains('content__focus') ? false : addClass(item);
    item.children[1].onclick = () => item.classList.contains('content__focus') ? addClass(item) : false;
  })
}

const start = (page) => {
  localStorage.getItem('search') === '' || localStorage.getItem('search') === null ? getData('spring', page) : getData(localStorage.getItem('search'), page)
}

start(startPage);