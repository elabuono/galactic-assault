// constants
let ship_x = 10
let ship1_y = 450
let ship2_y = 0
let ship_size = 50
var playerOne;

function launchGame() {
  playerOne = new component(ship_size, ship_size, ship_x, ship1_y);
  playerTwo = new component(ship_size, ship_size,ship_x, ship2_y);
  gameScreen.start();
}

// utilize canvas from html, set interval for components
var gameScreen = {
  canvas : document.getElementById('gamescreen'),
  start : function() {
    this.canvas.width = 500;
    this.canvas.height = 500;
    this.ctx = this.canvas.getContext('2d');
    this.interval = setInterval(updateGameScreen)
    document.addEventListener('keydown', handleInput)
    document.addEventListener('keyup', handleInput)
  },
  clear : function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop : function() {
    clearInterval(this.interval)
  }
}

// first component: the player's ship
function component(width, height, x, y) {
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.speed = 0;
  ship_image = new Image();
  ship_image.src = 'img/ship.png';
  this.update = function() {
    ctx = gameScreen.ctx;
    ctx.drawImage(ship_image, this.x, this.y, this.width, this.height);
  },
  this.movePos = function() {
    if(this.x >= 10 && this.speed > 0) {
      if(this.x < 440) {
        this.x += this.speed;
      }
    }
    if(this.x <= 440 && this.speed < 0) {
      if(this.x > 10) {
        this.x += this.speed;
      }
    }
  }
}

// interval updates to game screen
function updateGameScreen() {
    gameScreen.clear();
    playerOne.movePos();
    playerOne.update();
    playerTwo.movePos();
    playerTwo.update();
}

// move ship
// TODO: require holding down button rather than just constant movement
function handleInput(event) {
  const key = event.key
  if(event.type == 'keyup' && (key == 'a' || key == 'd')) playerOne.speed = 0;
    else if (event.type == 'keyup' && (key == 'j' || key == 'l')) playerTwo.speed = 0;
    else{
      switch (key) {
        case 'a':
          playerOne.speed = -1;
          break;
        case 'd':
          playerOne.speed = 1;
          break;
        case 'j':
          playerTwo.speed = -1;
          break;
        case 'l':
          playerTwo.speed = 1;
        default:
          break;
      }
    }
}

// design a basic movement scheme for the image to move side to side
function ship_movement() {
  ctx.clearRect(ship_x, ship1_y, canvas.width, canvas.height)
  ctx.clearRect(ship_x, ship2_y, canvas.width, canvas.height)
  ship_image = new Image();
  ship_image.src = 'img/ship.png';
  ctx.drawImage(ship_image, ship_x, ship1_y, ship_size, ship_size)
  ctx.drawImage(ship_image, ship_x, ship2_y, ship_size, ship_size)
  requestAnimationFrame(ship_movement)
}

// initialize ship location
//requestAnimationFrame(ship_movement)
//ship_movement()
