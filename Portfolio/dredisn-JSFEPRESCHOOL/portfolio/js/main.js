import i18Obj from './translate.js';
  let lang = 'en';
  let theme = 'dark';
//меню для адаптивной версии
const menuActive = () => {
  const openClose = document.querySelector('.burger__menu');
  const menu = document.querySelector('.top__menu');
  const list = document.querySelectorAll('.menu__link');
  const body = document.querySelector('body');
  const overlay = document.querySelector('.ov');

  openClose.addEventListener('click', () => {
    menu.classList.toggle('open');
    openClose.classList.toggle('click'); 
    body.classList.toggle('overflow');
    overlay.classList.toggle('overlay');
  });

  list.forEach((item) => {item.addEventListener('click', () => {
    menu.classList.toggle('open');
    openClose.classList.toggle('click'); 
    body.classList.toggle('overflow');
    overlay.classList.toggle('overlay');
  });})
  
}
//смена темы
const getTheme = () => {
  const switch_btn = document.querySelector('.switch__theme');
  switch_btn.addEventListener('click', () => {lightTeme('light')});
}
//получение необходимой темы
const lightTeme = (t) => {
  const allClassForTheme = ['.body', '.header', '.language__button', '.switch__theme', '.top__image', '.content__button', '.button__item', '.section__title', '.title__line', '.play__svg', '.contacts', '.title__end', '.contact__item', '.item__massager', '.burger__line', '.top__menu'];
  allClassForTheme.forEach((item) => {document.querySelectorAll(item).forEach((item) => {item.classList.toggle(t); item.classList.contains('light') ? theme = 'light' : theme = 'dark'})});
}
//смена языка
const getLanguage = () => {
  const en = document.querySelector('.lgb1');
  const ru = document.querySelector('.lgb2');
  en.addEventListener('click', () => {
    if (en.classList.contains('on')){
      getTranslate('en');    
    }else{ 
      en.classList.toggle('on');
      ru.classList.toggle('on'); 
      getTranslate('en');
    }});    
  ru.addEventListener('click', () => {
    if (ru.classList.contains('on')){
      getTranslate('ru');
    }else{ 
      en.classList.toggle('on'); 
      ru.classList.toggle('on'); 
      getTranslate('ru');
    }});
}
//получение языка
const getTranslate = (lng) => {
  const arr = document.querySelectorAll('[data-i18]');
  arr.forEach((item) => {
    let elem = Object.keys(i18Obj[lng]).find((val) => {return val === item.dataset.i18});

    if (item.placeholder) {
      item.placeholder = i18Obj[lng][elem];
    }else{
      item.textContent = i18Obj[lng][elem];
    }
    const en = document.querySelector('.lgb1');
    const ru = document.querySelector('.lgb2');
    if (en.classList.contains('on')){
      lang = 'en';     
    }else{ 
      lang = 'ru';
    }   
    if (ru.classList.contains('on')){
      lang = 'ru';
    }else{ 
      lang = 'en';
    }
  })
}
//сбор локальных переменных
function setLocalStorage() {
  localStorage.setItem('lang', lang);
  localStorage.setItem('theme', theme);
}
//получение локальных переменных
function getLocalStorage() {
  if(localStorage.getItem('lang')) {
    const lang = localStorage.getItem('lang');
    const en = document.querySelector('.lgb1');
    const ru = document.querySelector('.lgb2');
    if (lang === 'en') {
      getTranslate(lang);
    }else {
      en.classList.toggle('on');
      ru.classList.toggle('on'); 
      getTranslate(lang);
    }

    const theme = localStorage.getItem('theme');
    if (theme === 'light'){
      lightTeme(theme);
    }else{}  
  }
}
//анимация кнопки
const clickBtn = () => {
  const button = document.querySelectorAll('.btn');
  button.forEach((item) => {
    item.addEventListener('click', () => {
    let x = event.offsetX - 10;
    let y = event.offsetY - 10;
    let div = document.createElement('div');
    div.classList.add('circle', 'grow');
    div.style.left = x + 'px';
    div.style.top = y + 'px';
    if (theme === 'light'){div.classList.add('light')}
    item.append(div);
  })});
}
//смена картинок по клику
const switchImagePortfolio = (event) => {
  const allImage = document.querySelectorAll('.photo__item');
  if(event.classList.contains('button__item')) {
    event.classList.add('active');
    allImage.forEach((img, index) => img.src = `./images/${event.dataset.season}/${index + 1}.jpg`);
  }
}
const removeClassButton = (buttons) => {
  buttons.forEach((item) => {item.classList.remove('active')});
}
const clickButtonPortfolio = () => {
  const button = document.querySelectorAll('.button__item');
  button.forEach((item) => {
    item.addEventListener('click', () => {
      removeClassButton(button);
      switchImagePortfolio(item);
    })
  })

}
//кеширование изображений
const preloadImages = () => {
  const seasons = ['winter', 'spring', 'summer'];
  seasons.forEach((item) => {
    for(let i = 1; i <= 6; i++) {
      const img = new Image();
      img.src = `./images/${item}/${i}.jpg`;
    }
  });
}


//вызов функций
window.addEventListener('beforeunload', setLocalStorage);
window.addEventListener('load', getLocalStorage);
menuActive();
getLanguage();
getTheme();
clickBtn();
clickButtonPortfolio();
preloadImages();