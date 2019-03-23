// constants
let ship_x = 10
let ship1_y = 450
let ship2_y = 0
let ship_size = 50
let playerOneImg = 'img/player1.png'
let playerTwoImg = 'img/player2.png'
let enemyImg= 'img/enemy1.png'
let bulletImg = 'img/lazer.png'
var playerOne;
var playerTwo;
var enemies;
var enemyCountRow = 4;
var enemyRows = 4
var p1Kill = 0;
var p2Kill = 0;
var b = [];


function launchGame() {
  playerOne = new Component(playerOneImg, ship_size, ship_size, ship_x, ship1_y);
  playerTwo = new Component(playerTwoImg, ship_size, ship_size,ship_x, ship2_y);

  enemies = [enemyCountRow * enemyRows];
  gameScreen.start();
  enemyWidth = gameScreen.ctx.canvas.clientWidth/(enemyCountRow);
  x = 0;

  for (var i = 0; i < enemyRows; i++) {
    for (var j = 0; j < enemyCountRow; j++) {
      enemies[x] = new Enemy(enemyImg);
      enemies[x].x = j*enemyWidth+enemyWidth/enemyCountRow;
      enemies[x].y = 200+i*50;
      if(i%2 == 0){
        enemies[x].dir = 'left'
      }else{
        enemies[x].dir = 'right'
      }
      x++;
    }
  }


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

function Bullet(x, y, shooter){
  this.x = x;
  this.y = y;
  this.shotBy = shooter;
  this.bullet_image = new Image();
  this.bullet_image.src = bulletImg;
  this.update = function(){
    if(y>0 && this.shotBy == "one")this.y -= 1;
    if(y<400 && this.shotBy == "two")this.y += 1;
    ctx = gameScreen.ctx;
    ctx.drawImage(this.bullet_image, this.x, this.y, 10, 50);
  }
}

function Enemy(image, width){
  this.x;
  this.y;
  this.ship_image = new Image();
  this.ship_image.src = image;
  this.imageWidth = 50;
  this.imageHeight = 50;
  this.dir = 'left';
  this.inc = 0
  this.change = false;
  this.dead = false;
  this.update = function (){
    if(!this.dead){
    for (var i = 0; i < b.length; i++) {
      let lzr = b[i];
      if((lzr.x>this.x && lzr.x < this.x+this.imageWidth) && (lzr.y<this.y && lzr.y>this.y-this.imageHeight/2)){
        this.dead = true;
        if(lzr.shotBy == 'one'){
          lzr.y = -1000;
          p1Kill++;
        }
          else {
            lzr.y = 1000;
            p2Kill++;
          }
        break;
      }
    }
    this.inc++;
      if(this.inc>50){
        if ((this.x>=500-this.imageWidth || this.x<=0) && !this.change) {
          this.y -= this.imageWidth/2;
          if(this.dir == 'left'){
            this.dir = "right"
          }else{
            this.dir = 'left'
          }
          this.change = true;
        }else{
          if(this.dir == "right"){
            this.x += this.imageWidth/4;
          }else{
            this.x-= this.imageWidth/4;
          }
          this.change = false;
        }
        this.inc = 0;
      }
      ctx = gameScreen.ctx;
      ctx.drawImage(this.ship_image,this.x,this.y,this.imageWidth,this.imageHeight);

  }
}

}
// first component: the player's ship
function Component(image, width, height, x, y) {
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.speed = 0;
  this.ship_image = new Image();
  this.ship_image.src = image;
  this.update = function() {
    ctx = gameScreen.ctx;
    ctx.drawImage(this.ship_image, this.x, this.y, this.width, this.height);
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
    for (var i = 0; i < enemies.length; i++) {
      enemies[i].update();
    }
    for (var i = 0; i < b.length; i++) {
      b[i].update();
    }
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
          break;
        case ' ':
          b[b.length] = new Bullet (playerOne.x+playerOne.width/2,playerOne.y-playerOne.height/2, "one");
          break;
        case 'k':
          b[b.length] = new Bullet (playerTwo.x+playerTwo.width/2,playerTwo.y+playerTwo.height/2, "two");
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
