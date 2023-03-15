'use strict';

// Sounds effects
const audio = new Audio('sounds/DanceAround.mp3');
const clap = new Audio('sounds/Clapping.mp3');
const dunDunDunnn = new Audio('sounds/DunDunDunnn.mp3');

const setRandomNumber = () => Math.floor(Math.random() * 20) + 1;
let secretNumber = setRandomNumber();
console.log(secretNumber);
let score = 20;
let playerHighScore = 0;

const inputNumber = document.querySelector('.guess');
const number = document.querySelector('.number');

const displayMessage = (message) => document.querySelector('.message').textContent = message;
const setScore = (score) => document.querySelector('.score').textContent = score;
const setHighScore = (playerHighScore) => document.querySelector('.highscore').textContent = playerHighScore;
const showNumber = (value) => number.textContent = value;

const checkNumber = () => {
    let playerNumber = Number(inputNumber.value);

    // When there is no input
    if (!playerNumber) {
        displayMessage('No number!');

    // When player wins
    } else if (playerNumber === secretNumber) {
        displayMessage('Correct Number!');
        document.querySelector('body').style.backgroundColor = '#60b347';
        document.querySelector('.check').style.display = 'none';
        number.style.width = '30rem';
        showNumber(secretNumber);
        setScore(score);
        clap.play();
        audio.play();
        audio.loop = true;
        if (playerHighScore < score) {
            playerHighScore = score;
        }
        setHighScore(playerHighScore);
        initConfetti();
        render();
        
    // When score is greater than 1
    } else if (score > 1) { 
        displayMessage((playerNumber < secretNumber) ? 'Too low' : 'Too high');
        score--;
        setScore(score);

    // When player lose
    } else {
        displayMessage('You lose...');
        setScore(0);
        document.querySelector('body').style.backgroundColor = '#FD1C03';
        setTimeout(()=>{document.querySelector('body').style.backgroundColor='#222'}, '3000');
        document.querySelector('.check').style = 'display:none';
        showNumber(secretNumber);
        //laugh.play();
        dunDunDunnn.play();
    }
};

const replay = () => {
    // Reset confettiRounds
    confettiRounds = 0;
    // Cancel confetti animation and clear ctx
    window.cancelAnimationFrame(myReq);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    // Stop audio
    audio.pause();
    audio.currentTime = 0;
  
    // Return var to initial values
    secretNumber = setRandomNumber();
    console.log(secretNumber);
    score = 20;

    displayMessage('Start guessing...');
    setScore(score);
    showNumber('?');
    inputNumber.value = '';
    document.querySelector('body').style.backgroundColor = '#222';
    document.querySelector('.check').style.display = 'block';

};

document.querySelector('.check').addEventListener('click', checkNumber);
document.querySelector('.again').addEventListener('click', replay);


//-----------Confetti setting--------------
let confettiRounds = 0;
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let cx = ctx.canvas.width / 2;
let cy = ctx.canvas.height / 2;

const confetti = [];
const confettiCount = 500;
const gravity = 0.5;
const terminalVelocity = 5;
const drag = 0.075;
const colors = [
{ front: 'red', back: 'darkred' },
{ front: 'green', back: 'darkgreen' },
{ front: 'blue', back: 'darkblue' },
{ front: 'yellow', back: 'darkyellow' },
{ front: 'orange', back: 'darkorange' },
{ front: 'pink', back: 'darkpink' },
{ front: 'purple', back: 'darkpurple' },
{ front: 'turquoise', back: 'darkturquoise' }];

//-----------Confetti functions--------------
const resizeCanvas = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  cx = ctx.canvas.width / 2;
  cy = ctx.canvas.height / 2;
};

let randomRange = (min, max) => Math.random() * (max - min) + min;

const initConfetti = () => {
  for (let i = 0; i < confettiCount; i++) {
    confetti.push({
      color: colors[Math.floor(randomRange(0, colors.length))],
      dimensions: {
        x: randomRange(10, 20),
        y: randomRange(10, 30) },

      position: {
        x: randomRange(0, canvas.width),
        y: canvas.height - 1 },

      rotation: randomRange(0, 2 * Math.PI),
      scale: {
        x: 1,
        y: 1 },

      velocity: {
        x: randomRange(-25, 25),
        y: randomRange(0, -50) } });


  }
};

let myReq;
const requestAnimationFrame = window.requestAnimationFrame;

//---------Confetti render-----------
let render = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  confetti.forEach((confetto, index) => {
    let width = confetto.dimensions.x * confetto.scale.x;
    let height = confetto.dimensions.y * confetto.scale.y;

    // Move canvas to position and rotate
    ctx.translate(confetto.position.x, confetto.position.y);
    ctx.rotate(confetto.rotation);

    // Apply forces to velocity
    confetto.velocity.x -= confetto.velocity.x * drag;
    confetto.velocity.y = Math.min(confetto.velocity.y + gravity, terminalVelocity);
    confetto.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random();

    // Set position
    confetto.position.x += confetto.velocity.x;
    confetto.position.y += confetto.velocity.y;

    // Delete confetti when out of frame
    if (confetto.position.y >= canvas.height) confetti.splice(index, 1);

    // Loop confetto x position
    if (confetto.position.x > canvas.width) confetto.position.x = 0;
    if (confetto.position.x < 0) confetto.position.x = canvas.width;

    // Spin confetto by scaling y
    confetto.scale.y = Math.cos(confetto.position.y * 0.1);
    ctx.fillStyle = confetto.scale.y > 0 ? confetto.color.front : confetto.color.back;

    // Draw confetti
    ctx.fillRect(-width / 2, -height / 2, width, height);

    // Reset transform matrix
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  });

  // Fire off another round of confetti
    // if (confetti.length <= 100) { initConfetti();}

  // Fire off 3 rounds of confetti
    if (confetti.length <= 300 && confettiRounds < 3) {
        initConfetti();
        confettiRounds++;
        console.log('confettiRounds: ',confettiRounds);
    } 
    
    myReq = requestAnimationFrame(render);
};

// End confetti animation after 3 rounds
if (confettiRounds === 4) {
    window.cancelAnimationFrame(myReq);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

//----------When window resize----------
window.addEventListener('resize', function () {
  resizeCanvas();
});
