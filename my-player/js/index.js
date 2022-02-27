let audio = new Audio(`./audio/beyonce.mp3`);
let isPlay = false;
let soundNum = 0;
let interval;

const init = () => {
  const line = document.querySelector('.time__line');
  const current = document.querySelector('.currentTime');
  const durationTime = document.querySelector('.durationTime');
  const play = document.querySelector('.play');
  const back = document.querySelector('.back');
  const next = document.querySelector('.next');

  playAudio(play, line, current);
  timeLine(line, current);
  nextSound(next, play);
  backSound(back, play);
  newAudio(line, current, durationTime);
}

const newAudio = (line, current, durationTime) => {
  audio.onloadeddata = () => {
    line.max = audio.duration;
    line.value = 0;
    current.textContent = `${Math.floor(Math.round(audio.currentTime) / 60)}:${Math.round(audio.currentTime) % 60 < 10 ? '0' + Math.round(audio.currentTime) % 60 : Math.round(audio.currentTime) % 60}`;
    durationTime.textContent = `${Math.floor(Math.round(audio.duration) / 60)}:${Math.round(audio.duration) % 60 < 10 ? '0' + Math.round(audio.duration) % 60 : Math.round(audio.duration) % 60}`;
  };
}

const playAudio = (play, line, current) => {
  play.addEventListener('click', () => {
    play.classList.toggle('pause');
    if (isPlay === false){     
      audio.play();
      isPlay = true;
    }else{
      audio.pause();
      isPlay = false;
    }
    onAudio(line, current, play);
  })
}

const isSoundPlay = (play) => {
  play.classList.add('pause');
  audio.currentTime = 0;
  audio.play();
  isPlay = true;
}

const switchAudio = () => {
  const songAray = ['beyonce', 'dontstartnow'];
  if (songAray.length - 1 > soundNum){
    soundNum += 1;
  }else{
    soundNum -= 1;
  }
  return songAray;
}

const backgroundSound = (arr) => {
  const bg = document.querySelector('.bg__image');
  const sound = document.querySelector('.sound__image');
  const arrImage = [bg, sound];
  arrImage.forEach(i => i.src = `./images/${arr[soundNum]}.png`);
}

const nextSound = (next, play) => {
  next.addEventListener('click', () => {
    let arr = switchAudio();
    audio.src = `./audio/${arr[soundNum]}.mp3`;
    isSoundPlay(play);
    backgroundSound(arr);
    nameSong();
  })
}

const backSound = (back, play) => {
  back.addEventListener('click', () => {
    let arr = switchAudio();
    audio.src = `./audio/${arr[soundNum]}.mp3`;
    isSoundPlay(play);
    backgroundSound(arr);
    nameSong();
  })
}

const nameSong = () => {
  const artist = document.querySelector('.song__title');
  const title = document.querySelector('.song__artist');
  const arr = [['Beyonce', 'Don\'t Hurt Yourself'], ['Dua Lipa', 'Don\'t Start Now']];
  title.textContent = `${arr[soundNum][0]}`;
  artist.textContent = `${arr[soundNum][1]}`;
}

const timeLine = (line, current) => {
  line.addEventListener('click', () => {
    audio.currentTime = line.value;
    current.textContent = `${Math.floor(Math.round(audio.currentTime) / 60)}:${Math.round(audio.currentTime) % 60 < 10 ? '0' + Math.round(audio.currentTime) % 60 : Math.round(audio.currentTime) % 60}`;
  })
}

const onAudio = (line, current, play) => {
  if (!audio.paused){
    interval = setInterval(() => {
      line.value = +line.value + 1;
      current.textContent = `${Math.floor(Math.round(audio.currentTime) / 60)}:${Math.round(audio.currentTime) % 60 < 10 ? '0' + Math.round(audio.currentTime) % 60 : Math.round(audio.currentTime) % 60}`;
      if (+(line.value) >= +(Math.floor(line.max))){
        let arr = switchAudio();
        audio.src = `./audio/${arr[soundNum]}.mp3`;
        isSoundPlay(play);
        backgroundSound(arr);
        nameSong();
      }
    }, 1000)
  }else{
    clearInterval(interval);
  }  
}

init()