//reference:
//https://editor.p5js.org/ml5/sketches/PoseNet_webcam

let song;
let song2;
let video;
let poseNet;
let poses = [];

maxSize = 200;
sizeInc = 2;
var drops = [];
pause = true;
index = 0;

function preload(){
 soundFormats('mp3', 'ogg');
 song = loadSound('rain.mp3');
 song2 = loadSound("raindrop.mp3");
} 

function setup() {
  createCanvas(800, 800);
  const myCanvas = createCanvas(800,800);
  myCanvas.parent("canvas-container");

  video = createCapture(VIDEO);
  video.size(800, 800);
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
  poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();

 //
   r1 = new rainDrop();
}

function modelReady() {
  select('#status').html('Model Loaded');
}

function draw() {
  background(230, 238, 255);
  image(video, 0, 0, 800, 800);
  // fliter(Gray);
  songPlayed();

  noFill();
  for (var i = 0; i < index; i++) {
    drops[i].update();
    stroke(179, 179, 255, 255 * ((maxSize - drops[i].size) / maxSize));
    strokeWeight(5 * ((maxSize - drops[i].size) / maxSize));
    ellipse(drops[i].xpos, drops[i].ypos, drops[i].size);
  }

}
function songPlayed()  {
 // draw a dot where to trig the sound and raindrop 
      push();
      fill((255));
      ellipse(400, 400, 50, 50);
      pop();

// A function to draw ellipses over the detected keypoints
// Loop through all the poses detected
    for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
     //drawing from right hand
      let rightWrist = poses[i].pose.keypoints[10];
      if (rightWrist.score > 0.2) {
        push();
        fill(0, 0, 255);
        noStroke();
        ellipse(rightWrist.position.x, rightWrist.position.y, 30, 30);
        pop();
      }
        
      //sound to play when right wrist touches specific x and y position
      let d = dist(rightWrist.position.x, rightWrist.position.y, 400, 400);
      if (d < 100) {
        push();
        fill(random(0, 204, 0));
        ellipse(400, 400, 50, 50);
        pop();
        //make raindrops
        index++;
        drops.push(new rainDrop());
        socket.emit('mouseHasBeenClicked', name);  

        if(!song.isPlaying() && !song2.isPlaying()){
            song.play();
            song2.play();
        }else{
            song.stop();   
           }
        }          
      }
    }
  }

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