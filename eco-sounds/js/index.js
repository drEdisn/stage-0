const audio = new Audio();
let isPlay = false;


const removeActive = (button) => {
  button.forEach(item => item.classList.remove('active'));
}

const buttonActive = () => {
  const button = document.querySelectorAll('.button');
  const play = document.querySelector('.play__svg');

  button.forEach((item) => {
    item.addEventListener('click', () => {
      removeActive(button); 
      item.classList.add('active');
      switchBg(item);
      playAudio(item);
      isPlay = true;
      play.classList.add('pause');
    })
  })
}

const switchBg = (button) => {
  const bg = document.querySelector('.bg__image');
  bg.style.backgroundImage = `url(./images/img/${button.dataset.bg}.jpg)`;
}

const preloadImages = () => {
  const arrImage = ['forest', 'drozd', 'javoronok', 'slavka', 'solovey', 'zarynka'];
  arrImage.forEach((image) => {
    const img = new Image();
    img.src = `./images/img/${image}.jpg`
  })
}

const playAudio = (item) => {
  audio.src = `./audio/${item.dataset.bg}.mp3`
  audio.currentTime = 0;
  audio.play();
}

const pauseAudio = () => {
  audio.pause();
}

const buttonAudio = () => {
  const play = document.querySelector('.play__svg');
  play.addEventListener('click', () => {
    let active = document.querySelector('.active');
    play.classList.toggle('pause');
    if (!isPlay) {
      playAudio(active);
      isPlay = true;
    }else {
      pauseAudio();
      isPlay = false;
    }
  })
}

buttonAudio();
preloadImages();
buttonActive();