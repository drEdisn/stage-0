import cons from '../js/console.js';

let ismove = true;
let score = 0;
let win = false;
let clickMoveKey = true;
const audio = new Audio();
let isPlay = true;


const keyEvent = () => {
  document.addEventListener('keyup', (key) => {
    switch(key.keyCode){
      case 40: moveDown(40); break;
      case 39: moveRight(39); break;
      case 38: moveUp(38); break;
      case 37: moveLeft(37); break;
    }
  })
}

const isTouchMove = () => {
  let arrEnd = [];
  let arrStart = [];
  document.addEventListener('touchend', (Touch) => { 
    arrEnd = [];
    arrEnd.push(Touch.changedTouches[0].pageX);
    arrEnd.push(Touch.changedTouches[0].pageY);
    if (Math.abs(Math.abs(arrStart[0]) - Math.abs(arrEnd[0])) > Math.abs(Math.abs(arrStart[1]) - Math.abs(arrEnd[1]))){
      if (arrStart[0] > arrEnd[0]){moveLeft(37)}else {moveRight(39)}
    }else{
      if (arrStart[1] > arrEnd[1]){moveUp(38)}else {moveDown(40)}
    }
  })
  document.addEventListener('touchstart', (Touch) => { 
    arrStart = [];
    arrStart.push(Touch.targetTouches[0].pageX);
    arrStart.push(Touch.targetTouches[0].pageY);
  })
}

const preload = () => {
  const imgArray = ['pause_circle', 'volume_down'];
  let img = new Image();
  imgArray.forEach(i => img.src = `./images/${i}.svg`);
}

const random = (max) => {
  return Math.round(Math.random() * max);
}

const createElement = (x, y) => {
  const container = document.querySelector('.tile__container');
  const newElement = document.createElement('span');
  newElement.classList.add('cell-active__item');
  let value = random(4);
  newElement.textContent = `${value == 0 || value == 1 || value == 2 || value == 3 ? 2 : 4}`;
  newElement.style.top = `${y}px`;
  newElement.style.left = `${x}px`;
  return container.append(newElement);
}

const addElement = () => {
  let check = false;
  let arr = elementPosition();
  do{ 
    let x = random(3)*120;
    let y = random(3)*120;
    
    if (arr.every((val) => {return val[0] !== x || val[1] !== y})){
      createElement(x, y);
      check = true;
    }else{
      check = false;
    }
  }while (check == false)
}

const itemSortArray = () => {
  const item = document.querySelectorAll('.cell-active__item');
  let itemArray = [];
  let sortArray = [];
  item.forEach((i) => itemArray.push(i));

  for (let y = 0; y <= 360; y+= 120){
    for (let x = 0; x <= 360; x+= 120){
      let itemOne = itemArray.find(i => i.offsetLeft === x && i.offsetTop === y);
      typeof itemOne !== 'undefined' ? sortArray.push(itemOne) : false;
    }
  }

  return sortArray;
}

const elementPosition = () => {
  const elements = itemSortArray();
  let elementsInfo = [];
  elements.forEach((item) => {elementsInfo.push([item.offsetLeft, item.offsetTop, item.innerText])})
  return elementsInfo;
}

const slideUp = (arr, move) => {
  const item = itemSortArray();
  ismove = move;
  for (let i = 0; i < item.length; i++){
    while (item[i].style.top !== '0px' & !(arr.some((el) => {return el[0] == +item[i].style.left.replace(/[^+\d]/g, '') && el[1] == +item[i].style.top.replace(/[^+\d]/g, '') - 120}))){
      item[i].style.top = `${+item[i].style.top.replace(/[^+\d]/g, '') - 120}px`;
      ismove = true;
      arr = elementPosition();
    }   
  }
}

const slideDown = (arr, move) => {
  const item = itemSortArray();
  ismove = move;
  for (let i = item.length - 1; i >= 0; i--){
    while (item[i].style.top !== '360px' & !(arr.some((el) => {return el[0] == +item[i].style.left.replace(/[^+\d]/g, '') && el[1] == +item[i].style.top.replace(/[^+\d]/g, '') + 120}))){
      item[i].style.top = `${+item[i].style.top.replace(/[^+\d]/g, '') + 120}px`;
      ismove = true;
      arr = elementPosition();
    }      
  }
}

const slideRight = (arr, move) => {
  const item = itemSortArray();
  ismove = move;
  for (let i = item.length - 1; i >= 0; i--){
    while (item[i].style.left !== '360px' & !(arr.some((el) => {return el[0] == +item[i].style.left.replace(/[^+\d]/g, '') + 120 && el[1] == +item[i].style.top.replace(/[^+\d]/g, '')}))){
      item[i].style.left = `${+item[i].style.left.replace(/[^+\d]/g, '') + 120}px`;
      ismove = true;
      arr = elementPosition();
    }      
  }
}

const slideLeft = (arr, move) => {
  const item = itemSortArray();
  ismove = move;
  for (let i = 0; i < item.length; i++){
    while (item[i].style.left !== '0px' & !(arr.some((el) => {return el[0] == +item[i].style.left.replace(/[^+\d]/g, '') - 120 && el[1] == +item[i].style.top.replace(/[^+\d]/g, '')}))){
      item[i].style.left = `${+item[i].style.left.replace(/[^+\d]/g, '') - 120}px`;
      ismove = true;
      arr = elementPosition();
    }      
  }
}

const createMergeElement = (merge, del) => {
  merge.textContent = `${+merge.textContent + +del.textContent}`;
  scoreCounter(+merge.textContent);
  merge.classList.toggle('merge');
  merge.textContent === '2048' && win === false ? endGame('win') : false;

  if (+merge.textContent.length == 3){
    merge.style.fontSize = '40px';
  }else if (+merge.textContent.length == 4){
    merge.style.fontSize = '30px';
  }else if (+merge.textContent.length == 5){
    merge.style.fontSize = '20px';
  }
  merge.style.backgroundColor = `${random(255)}`;
  merge.style.filter = `drop-shadow(0 0 5px rgba(${random(255)}, ${random(255)}, ${random(255)}, 1)) drop-shadow(0 0 7px rgba(${random(255)}, ${random(255)}, ${random(255)}, 1))`
  del.remove();
  
}

const mergeCells = (key) => {
  let elementInfo = elementPosition();
  let itemArr = itemSortArray();

  switch (key){
    case 40: 
      for (let  j = itemArr.length - 1; j >= 0; j--){
        elementInfo = elementPosition();
        if (elementInfo.some(i => i[0] == itemArr[j].offsetLeft && i[1] == itemArr[j].offsetTop + 120 && i[2] === itemArr[j].innerText)){
          let mergedElement = elementInfo.find(i => i[0] == itemArr[j].offsetLeft && i[1] == itemArr[j].offsetTop + 120 && itemArr[j].innerText === i[2]);
          let giveMerge = itemArr.find(i => i.offsetLeft === mergedElement[0] && i.offsetTop === mergedElement[1] && i.innerText === mergedElement[2])
          createMergeElement(giveMerge, itemArr[j]); 
          ismove = true;
        }
      }
      slideDown(elementPosition(), ismove);   
      break;
    case 38:   
      itemArr.forEach((item) => {
        elementInfo = elementPosition();
        if (elementInfo.some(i => i[0] == item.offsetLeft && i[1] == item.offsetTop - 120 && i[2] === item.innerText)){
          let mergedElement = elementInfo.find(i => i[0] == item.offsetLeft && i[1] == item.offsetTop - 120 && item.innerText === i[2]);
          let giveMerge = itemArr.find(i => i.offsetLeft === mergedElement[0] && i.offsetTop === mergedElement[1] && i.innerText === mergedElement[2])
          createMergeElement(giveMerge, item);
          ismove = true;
        }
      })
      slideUp(elementPosition(), ismove);
      break;
    case 37:   
      itemArr.forEach((item) => {
        elementInfo = elementPosition();
        if (elementInfo.some(i => i[0] == item.offsetLeft - 120 && i[1] == item.offsetTop && i[2] === item.innerText)){
          let mergedElement = elementInfo.find(i => i[0] == item.offsetLeft - 120 && i[1] == item.offsetTop && item.innerText === i[2]);
          let giveMerge = itemArr.find(i => i.offsetLeft === mergedElement[0] && i.offsetTop === mergedElement[1] && i.innerText === mergedElement[2])
          createMergeElement(giveMerge, item);   
          ismove = true;
        }
      })
      slideLeft(elementPosition(), ismove);
      break;
    case 39: 
      for (let  j = itemArr.length - 1; j >= 0; j--){
        elementInfo = elementPosition();
        if (elementInfo.some(i => i[0] == itemArr[j].offsetLeft + 120 && i[1] == itemArr[j].offsetTop && i[2] === itemArr[j].innerText)){
          let mergedElement = elementInfo.find(i => i[0] == itemArr[j].offsetLeft + 120 && i[1] == itemArr[j].offsetTop && itemArr[j].innerText === i[2]);
          let giveMerge = itemArr.find(i => i.offsetLeft === mergedElement[0] && i.offsetTop === mergedElement[1] && i.innerText === mergedElement[2])
          createMergeElement(giveMerge, itemArr[j]);             
          ismove = true;
        }
      }
      slideRight(elementPosition(), ismove);  
      break;
  }
}

const scoreCounter = (add) => {
  const scoreElement = document.querySelector('.score');
  scoreElement.textContent = `${score += add}`;
}

const moveUp = (key) => {
  slideUp(elementPosition(), false);
  mergeCells(key);
  if (ismove === true){
    addElement();
  }
  if (itemSortArray().length === 16 && ismove === false){if(checkOver() === true && clickMoveKey === true){clickMoveKey = false; endGame('over')}}
}

const moveDown = (key) => {
  slideDown(elementPosition(), false);
  mergeCells(key);
  if (ismove === true){
    addElement();
  }
  if (itemSortArray().length === 16 && ismove === false){if(checkOver() === true && clickMoveKey === true){clickMoveKey = false; endGame('over')}}
}

const moveRight = (key) => {
  slideRight(elementPosition(), false);
  mergeCells(key);
  if (ismove === true){
    addElement();
  }
  if (itemSortArray().length === 16 && ismove === false){if(checkOver() === true && clickMoveKey === true){clickMoveKey = false; endGame('over')}}
}

const moveLeft = (key) => {
  slideLeft(elementPosition(), false);
  mergeCells(key);
  if (ismove === true){
    addElement();
  }
  if (itemSortArray().length === 16 && ismove === false){if(checkOver() === true && clickMoveKey === true){clickMoveKey = false; endGame('over')}}
}

const initEvent = () => {
  document.querySelector('.body').classList.add('hidden');
  const child = document.querySelectorAll('.cell-active__item');
  child.forEach(i => i.remove());
  addElement();
  score = 0;
  win = false;
  clickMoveKey = true;
  document.querySelector('.score').textContent = '0';
}

const init = () => {
  const start = document.querySelector('.game');
  start.addEventListener('click', () => {
    initEvent();
    start.textContent = 'NEW GAME';
  })
}

const checkOver = () => {
  let elementInfo = elementPosition();
  let itemArr = itemSortArray();

  itemArr.forEach((item) => {
    if (elementInfo.some(i => i[0] == item.offsetLeft && i[1] == item.offsetTop - 120 && i[2] === item.innerText)){
      return false;
    }else if (elementInfo.some(i => i[0] == item.offsetLeft - 120 && i[1] == item.offsetTop && i[2] === item.innerText)){
      return false;
    }
  })
  for (let  j = itemArr.length - 1; j >= 0; j--){
    if (elementInfo.some(i => i[0] == itemArr[j].offsetLeft + 120 && i[1] == itemArr[j].offsetTop && i[2] === itemArr[j].innerText)){
      return false;
    }else if (elementInfo.some(i => i[0] == itemArr[j].offsetLeft && i[1] == itemArr[j].offsetTop + 120 && i[2] === itemArr[j].innerText)){
      return false;
    }
  }

  return true;
}

const isEndEvent = (over, overlay, play) => {
  const button = document.querySelector('.audio__play');
  button.classList.remove('audio__pause');
  over.classList.remove('over__on');
  overlay.classList.remove('on');
  play.style.display = 'none';
  audio.src = `./audio/melody.mp3`;
  isPlay = true;
}

const restart = (over, overlay, play) => {
  const restart = document.querySelector('.restart');
  restart.addEventListener('click', () => {
    initEvent();
    isEndEvent(over, overlay, play);
  })
}

const play = (over, overlay, play) => {
  play.addEventListener('click', () => {
    clickMoveKey = true; 
    win = true;
    isEndEvent(over, overlay, play);
  })
}

const gameWinner = (over, overlay) => {
  const playElenemt = document.querySelector('.continue');
  playElenemt.style.display = 'flex';
  restart(over, overlay, playElenemt);
  play(over, overlay, playElenemt);
}

const endGame = (event) => {
  const over = document.querySelector('.window__container');
  const overlay = document.querySelector('.overlay');
  const title = document.querySelector('.text__over');
  const text = document.querySelector('.text__window');
  const result = document.querySelector('.score__result');

  result.textContent = `${score}`;
  scoreTop(score);
  over.classList.add('over__on');
  overlay.classList.add('on');

  if(event === 'over'){
    audio.src = `./audio/loser.mp3`;
    audio.play();
    over.style.filter = 'drop-shadow(0 0 3px rgba(255, 255, 255, 1)) drop-shadow(0 0 7px rgba(255, 0, 0, 0.9))';
    title.textContent = 'GAME OVER';
    title.style.color = 'red';
    text.textContent = 'Click RESTART for a new game';
    restart(over, overlay, document.querySelector('.continue'));
  }else if(event === 'win') {
    audio.src = `./audio/win.mp3`;
    audio.play();
    over.style.filter = 'drop-shadow(0 0 3px rgba(255, 255, 255, 1)) drop-shadow(0 0 7px rgba(0, 107, 5, 0.9))';
    title.textContent = 'YOU WIN';
    title.style.color = 'green';
    text.textContent = 'Click RESTART for a new game or CONTINUE for new high scores';
    gameWinner(over, overlay);
  }
}

const scoreTable = () => {
  const table = document.querySelector('.record__table');
  table.addEventListener('click',  () => table.classList.toggle('move__table'));
}

const scoreTop = (count) => {
  const tableScore = document.querySelector('.top__score');
  const allSpan = document.querySelectorAll('.top__item');
  allSpan.forEach(i => i.remove());
  
  let countArray = [];
  countArray.push(count);
  for (let i = 1; i <= localStorage.length; i++){countArray.push(+localStorage.getItem(i))}
  countArray.sort((a, b) => b - a);

  let topScore = countArray.length > 10 ? countArray.slice(0, 10) : countArray;
  topScore.forEach((item, index) => {localStorage.setItem(`${index+1}`, item)})

  for (let i = 1; i <= localStorage.length; i++){
    const newSpan = document.createElement('span');
    newSpan.classList.add('top__item');
    newSpan.textContent = `${i}. ${+localStorage.getItem(i) === null ? 0 : +localStorage.getItem(i)}`;
    tableScore.append(newSpan);
  }
}

const localStart = () => {
  for (let i = 1; i <= localStorage.length; i++){
    const newSpan = document.createElement('span');
    newSpan.classList.add('top__item');
    newSpan.textContent = `${i}. ${+localStorage.getItem(i) === null ? 0 : +localStorage.getItem(i)}`;
    document.querySelector('.top__score').append(newSpan);
  }
}

const playAudio = () => {
  audio.currentTime = 0;
  audio.play()
}

const pauseAudio = () => {
  audio.pause();
}

const volimeEmentClick = (image, Vaudio) => {
  audio.volume = Vaudio.value / 100;
  if(audio.volume <= 0.3){
    image.classList.add('down__volume');
  }else if (audio.volume > 0.3){
    image.classList.remove('down__volume');
  }
}

const volumeSwitch = () => {
  const volumeAudio = document.querySelector('.volume__audio');
  const volumeImage = document.querySelector('.volume__img');
  volumeAudio.onclick = () => {
    volimeEmentClick(volumeImage, volumeAudio);
  }
  volumeAudio.addEventListener('touchend', () => {
    volimeEmentClick(volumeImage, volumeAudio);
  })
}

const audioCheck = () => {
  const button = document.querySelector('.audio__play');
  let interval;
  audio.src = `./audio/melody.mp3`;
  
  button.addEventListener('click', () => {
    if (isPlay == true){
      button.classList.toggle('audio__pause');
      playAudio();
      interval = setInterval(playAudio, 150000);
      isPlay = false;
    }else if (isPlay == false){
      button.classList.toggle('audio__pause');
      pauseAudio();
      clearInterval(interval);
      isPlay = true;
    }
  })
}

preload();
cons();
volumeSwitch();
audioCheck();
scoreTable();
localStart();
keyEvent();
isTouchMove();
init();
