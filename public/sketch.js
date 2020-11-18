//Open and connect socket
let socket = io();
const messageContainer = document.getElementById('message-container')

//user's name
const name = prompt('What is your name?')
appendMessage('You joined')
socket.emit('new-user', name)

let mySound;

maxSize = 200;
sizeInc = 2;
var drops = [];
pause = true;
index = 0;

function preload() {
  soundFormats('mp3', 'ogg');
  mySound = loadSound('raindrop.mp3');
}

function setup() {
  numDrops = 50;
  createCanvas(800, 800);
  r1 = new rainDrop();

  //Listen for confirmation of connection
  socket.on('user-connected', name => {
    appendMessage(`${name} connected`)
  })

  socket.on('user-disconnected', name => {
    appendMessage(`${name} disconnected`)
  })

  socket.on('mousehasclicked', name => {
    appendMessage(`${name} created a raindrop！`)
  })
}

function draw() {
  //console.log(index);
  background(230, 238, 255);
  // background(255, 255, 255);
  noFill();
  for (var i = 0; i < index; i++) {
    drops[i].update();
    stroke(179, 179, 255, 255 * ((maxSize - drops[i].size) / maxSize));
    strokeWeight(5 * ((maxSize - drops[i].size) / maxSize));
    ellipse(drops[i].xpos, drops[i].ypos, drops[i].size);
  }
}
//rain drop dissapear
function rainDrop() {

  this.xpos = random(width);
  this.ypos = random(height);
  this.size = 0;
  this.kill = false;
  this.delay = random(1, 50);
  this.maxSize = random(100, 200);
  this.sizeInc = random(1, 3);

  this.update = function () {
    if (this.delay >= 0) {
      this.delay -= 1;
    }
    else {
      this.size += this.sizeInc;

      if (this.size > this.maxSize) {
        this.kill = true;
      }
    }
  }
}

function mousePressed() {
  index++;
  drops.push(new rainDrop());
  socket.emit('mouseHasBeenClicked', name);

  if (mySound.isPlaying()) {
    mySound.pause();
  } else {
    mySound.play();
  }
}
function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
}