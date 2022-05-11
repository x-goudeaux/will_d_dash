const context = document.querySelector("canvas").getContext("2d");

context.canvas.height = 400;
context.canvas.width = 1220;

var cat = new Image()
cat.src = 'images/will_d_cat.png';

let frameCount = 1;

let obCount = frameCount;

const obXCoors = [];

let gameOver = false;

const player = {

  
  height: 110,
  jumping: true,
  width: 90,
  x: 0,
  xVelocity: 0,
  y: 0,
  yVelocity: 0



};

//displays game over screen
function DisplayGameOver(){
    context.textAlign = 'center';
    context.font = "40px Helvitica";
    context.fillStyle = 'white';
    context.fillText('Game Over :(', context.canvas.width/2, 100);
}


const nextFrame = () => {

  frameCount++;
  
  for (let i = 0; i < obCount; i++) {
    // Randomly generate the x coordinate for the top corner start of the obstacle
    obXCoor = Math.floor(Math.random() * (1165 - 140 + 1) + 140);
    obXCoors.push(obXCoor);
  }

}

const controller = {

  left: false,
  right: false,
  up: false,
  keyListener: function (event) {

    var key_state = (event.type == "keydown") ? true : false;

    switch (event.keyCode) {

      case 37:// left key
        controller.left = key_state;
        break;
      case 38:// up key
        controller.up = key_state;
        break;
      case 39:// right key
        controller.right = key_state;
        break;

    }

  }

};

//function to get cat image
function drawCat(){
  context.drawImage(cat,player.x,player.y,player.width,player.height)
}

const loop = function () {

  if (controller.up && player.jumping == false) {

    player.yVelocity -= 37;
    player.jumping = true;

  }

  if (controller.left) {

    player.xVelocity -= 0.65;

  }

  if (controller.right) {

    player.xVelocity += 0.65;

  }

  player.yVelocity += 0.7;// gravity
  player.x += player.xVelocity;
  player.y += player.yVelocity;
  player.xVelocity *= 0.9;// friction
  player.yVelocity *= 0.9;// friction

  // if player is falling below floor line
  if (player.y > 386 - 16 - player.height) {

    player.jumping = false;
    player.y = 386 - 16 - player.height;
    player.yVelocity = 0;

  }

  // if player is going off the left of the screen
  if (player.x < -25) {

    player.x = -25;

  } else if (player.x > 1220) {// if player goes past right boundary

    player.x = -20;
    nextFrame();

  }

  //collision fields i.e. hit boxes
  var playRect = {x: player.x - 2,y: player.y,w: player.width + 5, h: player.height + 5};
  

  // Creates the backdrop for each frame
  context.fillStyle = "#6ccad6";
  context.fillRect(0, 0, 1220, 400); // x, y, width, height
  context.textAlign = 'right';
  context.font = "30px Helvitica";
  context.fillStyle = 'yellow';
  context.fillText('Level ' + frameCount, context.canvas.width/5, 50);


  //creates collision field for will d cat
  context.fillStyle = "white";
  context.lineWidth = 0.01;
  context.strokeRect(playRect.x,playRect.y,playRect.w,playRect.h);
  
  // Creates will d cat for each frame
  drawCat();
  
  // Create the obstacles for each frame
  // Set the standard obstacle height
  const height = 200 * Math.cos(Math.PI / 6);

  
  obXCoors.forEach((obXCoor) => {

    var obsRect = {x: obXCoor-52,y: 270,w: player.width + 15,h: player.height -5}
    checkCollision(playRect,obsRect);
    context.lineWidth = 0.01;
    context.strokeRect(obsRect.x,obsRect.y,obsRect.w,obsRect.h);
    context.beginPath();
    context.fillStyle = "#E47041";
    context.moveTo(obXCoor, 385); // x = random, y = coor. on "ground"
    context.arc(obXCoor, 322, 50, 0, 2 * Math.PI)
    context.closePath();
    context.fill();
  })

  //collision detection logic

  function checkCollision(rect1,rect2){
    if(rect1.x> rect2.x+rect2.w||rect1.x+rect1.w < rect2.x|| rect1.y>rect2.y+rect2.h||rect1.y + rect1.h < rect2.y){
      gameOver = false;
    }
    else{
      gameOver = true;
    }
  }
  


  // Creates the "ground" for each frame
  context.strokeStyle = "#31805a";
  context.lineWidth = 30;
  context.beginPath();
  context.moveTo(0, 385);
  context.lineTo(1220, 385);
  context.stroke();

  // call update when the browser is ready to draw again
  if(!gameOver) 
    window.requestAnimationFrame(loop)
  else
    DisplayGameOver();
      

};



window.addEventListener("keydown", controller.keyListener)
window.addEventListener("keyup", controller.keyListener);
window.requestAnimationFrame(loop);

