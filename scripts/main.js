// constants
let ship_x = 10
let ship1_y = 450
let ship2_y = 0
let ship_size = 50
let barrier_size = 10
let playerOneImg = 'img/player1.png'
let playerTwoImg = 'img/player2.png'
let enemyImg= 'img/enemy1.png'
let bulletImg = 'img/lazer.png'
let barrierBlockImg = 'img/barrierBlockImg.png'
var playerOne;
var playerTwo;
var enemies;
var enemiesRemaining = 16;
var barriers;
var enemyCountRow = 4;
var enemyRows = 4;
var p1Kill = 0;
var p2Kill = 0;
var p1Lives = 5;
var p2Lives = 5;
var roundsLeft = 5;
var b = [];
//
function launchGame() {
  playerOne = new Component(playerOneImg, ship_size, ship_size, ship_x+240, ship1_y, "one");
  playerTwo = new Component(playerTwoImg, ship_size, ship_size,ship_x+240, ship2_y, "two");

  enemies = [enemyCountRow * enemyRows];
  gameScreen.start();
  enemyWidth = gameScreen.ctx.canvas.clientWidth/(enemyCountRow);
  var starty = gameScreen.ctx.canvas.clientHeight;
  x = 0;

// Create enemies

  for (var i = 0; i < enemyRows; i++) {
    for (var j = 0; j < enemyCountRow; j++) {
      enemies[x] = new Enemy(enemyImg);
      if(i%2 == 0){
        enemies[x].dir = 'left'
      }else{
        enemies[x].dir = 'right'
      }
      if(i<enemyRows/2){
        enemies[x].updown = 'up';
        enemies[x].x = j*enemyWidth+enemyWidth/enemyCountRow;
        enemies[x].y = starty/2-(i+1)*50;
      }else{
        enemies[x].updown = 'down';
        enemies[x].x = j*enemyWidth+enemyWidth/enemyCountRow;
        enemies[x].y = starty/2+(i-2)*50;

      }
      x++;
    }
  }

  barriers = new Array(12);
  for(var i=0; i<6;i++){
    barriers[i] = new Barrier(ship_x+i*83, 0+90)
  }
  for (var i = 6; i <12 ; i++) {
    barriers[i] = new Barrier(ship_x+(i-6)*83, 500-75)
  }

  alert("Get ready to attack...");

}

function BarrierBlock(x, y){
  this.x = x;
  this.y = y;

  this.barrier_image = new Image();
  this.barrier_image.src = barrierBlockImg;
  this.hit = false;
  this.update = function(){
    if(!this.hit){
      for (var i = 0; i < b.length; i++) {
        //var tempy = b[i].shotBy.equals("two") ?
        var tempy = b[i].shotBy == "one" ? 25 : 25;
        if(b[i].x<=this.x+10
          && b[i].x>this.x
          && b[i].y+tempy < this.y+10
          && b[i].y+tempy > this.y){
            this.hit = true;
            b[i].hit = true;
          }
      }
      ctx = gameScreen.ctx;
      ctx.drawImage(this.barrier_image, this.x, this.y, barrier_size, barrier_size);
    }
  }

}

function Barrier(x, y){
  this.x = x
  this.y = y
  this.Barrier = new Array(12);
  for (var i = 0; i < this.Barrier.length; i++) {
    if(i<4)  this.Barrier[i] = new BarrierBlock(x+i*10,y);
    if(i>=4 && i<8)  this.Barrier[i] = new BarrierBlock(x+(i-4)*10,y-10);
    if(i>=8) this.Barrier[i] = new BarrierBlock(x+(i-8)*10,y-20);
  }

  this.update = function(){
    for (var i = 0; i < this.Barrier.length; i++) {
      this.Barrier[i].update();
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
  this.hit = false;
  this.update = function(){
    if(this.hit)return 0;
    if(y>0 && this.shotBy == "one")this.y -= 2;
    if(y<400 && this.shotBy == "two")this.y += 2;
    ctx = gameScreen.ctx;
    ctx.drawImage(this.bullet_image, this.x, this.y, 2, 50);
  }
}


function Enemy(image, width){
  this.x;
  this.y;
  this.ship_image = new Image();
  this.ship_image.src = image;
  this.imageWidth = ship_size;
  this.imageHeight = ship_size;
  this.dir = 'left';
  this.inc = 0
  this.change = false;
  this.dead = false;
  this.updown;
  this.update = function () {
    if(!this.dead) {
    for (var i = 0; i < b.length; i++) {
      let lzr = b[i];
      //if the lazer is active within the ships boundaries, that is a hit
      if((lzr.x>this.x && lzr.x < this.x+this.imageWidth)
          && (lzr.y<this.y && lzr.y>this.y-this.imageHeight/2)
          && (!lzr.hit)) {
        this.dead = true;
        enemiesRemaining--;
        if(lzr.shotBy == 'one'){
          lzr.hit = true;
          lzr.y = -1000; //move far off screen and deactivate bullet
          p1Kill++;
          document.getElementById('scorep1').innerHTML = "Player 1: " + p1Kill;
        }
        else {
          lzr.y = 1000; // move far off screen and deactivate bullet
          lzr.hit = true;
          p2Kill++;
          document.getElementById('scorep2').innerHTML = "Player 2: " + p2Kill;
        }
        break;
      }
    }
    this.inc++;
    //Move the enemies every 50 refreshes
      if(this.inc>25){
        if ((this.x>=500-this.imageWidth || this.x<=0) && !this.change) {
          //descides whether the ship was moving up or down
          if(this.updown == 'up')this.y -= this.imageWidth/2;
          else this.y += this.imageWidth/2;
          if(this.dir == 'left'){
            this.dir = "right"
          }else{
            this.dir = 'left'
          }
          this.change = true; //if changed, allow show to move over so it doesnt get moved down again
        }else{
          //moves the ship right or left accordingly
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

      // if the enemy hits the player's zone, cause damage and despawn
      if(this.y >= ship1_y) {
        this.despawn;
        this.dead = true;
        p1Lives--;
        document.getElementById('healthp1').innerHTML = "Player 1 HP: " + p1Lives;
        enemiesRemaining--;
      }
      if(this.y <= ship2_y) {
        this.despawn;
        this.dead = true;
        p2Lives--;
        document.getElementById('healthp2').innerHTML = "Player 2 HP: " + p2Lives;
        enemiesRemaining--;
      }
  }

}
  this.despawn = function() {
    ctx = gameScreen.ctx;
    ctx.drawImage(this.ship_image,this.x,this.y,this.imageWidth,this.imageHeight);
  }
}
// first component: the player's ship
function Component(image, width, height, x, y, player) {
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.speed = 0;
  this.ship_image = new Image();
  this.ship_image.src = image;
  this.player = player
  this.update = function() {
    //check to see if hit
    for (var i = 0; i < b.length; i++) {
      var tempy = b[i].shotBy == "one" ? 50 : 0;
      if(b[i].x<this.x+this.width
        && b[i].x>this.x
        && b[i].y< this.y+this.height/2
        && b[i].y> this.y){
          if(this.player == "one") {
            p1Lives--;
            document.getElementById('healthp1').innerHTML = "Player 1 HP: " + p1Lives;
          }
          else{
             p2Lives--;
             document.getElementById('healthp2').innerHTML = "Player 2 HP: " + p2Lives;
           }
          b[i].x = 1000;
          b[i].hit = true;
        }
    }

    if(!((this.player == 'one' && p1Lives<=0)||(this.player == 'two' && p2Lives<=0))){
      ctx = gameScreen.ctx;
      ctx.drawImage(this.ship_image, this.x, this.y, this.width, this.height);
    }
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
    for (var i = 0; i < barriers.length; i++) {
      barriers[i].update();
    }

    for (var i = 0; i < b.length; i++) {
      b[i].update();
    }
    for (var i = 0; i < enemies.length; i++) {
      enemies[i].update();
    }

    if(enemiesRemaining == 0 || (p1Lives == 0 || p2Lives == 0)) {
        if(roundsLeft > 1) {
          nextRound();
        } else {
          endGame();
        }
    }
}

function endGame() {
  if(p1Kill > p2Kill) {
    alert("Player 1 wins!!!");
  } else if(p2Kill > p1Kill) {
    alert("Player 2 wins!!!");
  } else {
    alert("Tie!");
  }
  gameScreen.clear();
}

function nextRound() {
  alert("Next round coming up!");
  roundsLeft--;
  // reset the health of players
  p1Lives = 5;
  p2Lives = 5;
  document.getElementById('healthp1').innerHTML = "Player 1 HP: " + p1Lives;
  document.getElementById('healthp2').innerHTML = "Player 2 HP: " + p2Lives;
  enemiesRemaining = 16;
  gameScreen.clear();

  // spawn new enemies
  enemies = [enemyCountRow * enemyRows];
  enemyWidth = gameScreen.ctx.canvas.clientWidth/(enemyCountRow);
  var starty = gameScreen.ctx.canvas.clientHeight;
  x = 0;
  for (var i = 0; i < enemyRows; i++) {
    for (var j = 0; j < enemyCountRow; j++) {
      enemies[x] = new Enemy(enemyImg);
      if(i%2 == 0){
        enemies[x].dir = 'left'
      }else{
        enemies[x].dir = 'right'
      }
      if(i<enemyRows/2){
        enemies[x].updown = 'up';
        enemies[x].x = j*enemyWidth+enemyWidth/enemyCountRow;
        enemies[x].y = starty/2-(i+1)*50;
      }else{
        enemies[x].updown = 'down';
        enemies[x].x = j*enemyWidth+enemyWidth/enemyCountRow;
        enemies[x].y = starty/2+(i-2)*50;

      }
      x++;
    }
  }
}

// move ship
function handleInput(event) {
  const key = event.key;
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
          // TODO: change spacebar to s key, matching player 2's controls
        case 's':
          if(event.type == 'keyup') b[b.length] = new Bullet (playerOne.x+playerOne.width/2,playerOne.y-playerOne.height/2, "one");
          break;
        case 'k':
          if(event.type == 'keyup') b[b.length] = new Bullet (playerTwo.x+playerTwo.width/2,playerTwo.y+playerTwo.height/2, "two");
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
