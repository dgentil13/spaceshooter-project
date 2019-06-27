/* eslint-disable func-names */
/* eslint-disable default-case */

// array de asteroids
let asteroids = [];
let laserArr = [];
let enemies = [];
let itemsArr = [];
let getIt = false;
let enterStart = true;

// objeto com audios do jogo
const audio = {

  laser: new Audio('./music/laser5.mp3'),
  laserLarge: new Audio('./music/laser1.mp3'),
  getItem: new Audio('./music/powerUp8.mp3'),
  gameMusic: new Audio('./music/slow-travel.wav'),
  gameOver: new Audio('./music/in-the-wreckage.wav'),
  explosion: new Audio('./music/Torpedo+Explosion.mp3'),

};

// contrução do mapa -----------------------------------------------------------------
const myGameArea = {
  canvas: document.createElement('canvas'),
  frames: 0,
  y: 0,
  speed: -1,
  totalPoints: 0,
  bonusPoints: 0,

  menu() {
    this.canvas.width = 1000;
    this.canvas.height = 800;
    this.context = this.canvas.getContext('2d');
    document
      .getElementById('game-board')
      .insertBefore(
        this.canvas,
        document.getElementById('game-board').childNodes[0],
      );

    this.intervalMenu = setInterval(updateMenu, 1000 / 60);
    resetGame();
  },

  // chama a função update game
  start() {
    this.interval = setInterval(updateGame, 1000 / 60);
    audio.gameMusic.load();
    audio.gameMusic.volume = 0.6;
    audio.gameMusic.play();
  },

  // desenha a tela do canvas
  drawBoard() {
    const starBackground = document.getElementById('background');
    myGameArea.context.drawImage(starBackground, 0, this.y, 1000, 800);

    if (this.speed < 0) {
      myGameArea.context.drawImage(
        starBackground,
        0,
        this.y - this.canvas.height,
        1000,
        800,
      );
    }
  },

  // desenha menu
  drawMenu() {
    const starBackground = document.getElementById('background');
    const ship = document.getElementById('spaceship');

    myGameArea.context.drawImage(starBackground, 0, this.y, 1000, 800);

    if (this.speed < 0) {
      myGameArea.context.drawImage(
        starBackground,
        0,
        this.y - this.canvas.height,
        1000,
        800,
      );
    }

    this.context.font = ' 27px spaceFont';
    this.context.fillStyle = '#f5eedc';
    this.context.fillText('Press enter to start!', 300, 420);

    this.context.font = ' 73px spaceFont';
    this.context.fillStyle = '#cfa629';
    this.context.fillText('Astro Blaster', 150, 200);

    myGameArea.context.drawImage(ship, 450, 250, 100, 100);

    this.context.font = ' 22px spaceFont';
    this.context.fillStyle = '#f5eedc';
    this.context.fillText('HOW TO PLAY:', 405, 540);

    this.context.font = ' 17px spaceFont';
    this.context.fillStyle = '#f5eedc';
    this.context.fillText('use SPACE to shoot', 385, 590);

    this.context.font = ' 17px spaceFont';
    this.context.fillStyle = '#f5eedc';
    this.context.fillText('Arrow keys to move', 385, 630);

    this.context.font = ' 15px spaceFont';
    this.context.fillStyle = 'grey';
    this.context.fillText('TIPS:', 475, 690);

    this.context.font = ' 15px spaceFont';
    this.context.fillStyle = 'grey';
    this.context.fillText('enemy ships take two hit to die', 325, 730);

    this.context.font = ' 15px spaceFont';
    this.context.fillStyle = 'grey';
    this.context.fillText('pink boxes are power ups!', 360, 710);

    this.context.font = ' 15px spaceFont';
    this.context.fillStyle = 'grey';
    this.context.fillText('if you get hit, you stay invincible for a while, but no shooting!', 135, 750);
  },

  // desenha tela game over
  drawGameOver() {
    const starBackground = document.getElementById('background');
    myGameArea.context.drawImage(starBackground, 0, this.y, 1000, 800);

    if (this.speed < 0) {
      myGameArea.context.drawImage(
        starBackground,
        0,
        this.y - this.canvas.height,
        1000,
        800,
      );
    }

    this.context.font = ' 60px spaceFont';
    this.context.fillStyle = '#f5eedc';
    this.context.fillText('GAME OVER!', 290, 350);

    this.context.font = ' 20px spaceFont';
    this.context.fillStyle = '#f5eedc';
    this.context.fillText(`Your score was: ${this.totalPoints}`, 360, 530);
  },

  // parte cima da tela------------------
  drawScore() {
    this.totalPoints = this.bonusPoints;
    this.context.font = ' 20px spaceFont';
    this.context.fillStyle = 'white';
    this.context.fillText(`Score: ${this.totalPoints}`, 40, 50);
  },

  drawLives() {
    this.ship = document.getElementById('spaceship');
    this.shipLife = document.getElementById('shipLife');

    if (player.lives === 4) {
      const life1 = this.context.drawImage(this.ship, 910, 25, 40, 40);

      const life2 = this.context.drawImage(this.ship, 850, 25, 40, 40);

      const life3 = this.context.drawImage(this.ship, 790, 25, 40, 40);
    }

    if (player.lives === 3) {
      const life1 = this.context.drawImage(this.shipLife, 910, 25, 40, 40);

      const life2 = this.context.drawImage(this.ship, 850, 25, 40, 40);

      const life3 = this.context.drawImage(this.ship, 790, 25, 40, 40);
    }

    if (player.lives === 2) {
      const life1 = this.context.drawImage(this.shipLife, 910, 25, 40, 40);

      const life2 = this.context.drawImage(this.shipLife, 850, 25, 40, 40);

      const life3 = this.context.drawImage(this.ship, 790, 25, 40, 40);
    }
    if (player.lives === 1) {
      const life1 = this.context.drawImage(this.shipLife, 910, 25, 40, 40);

      const life2 = this.context.drawImage(this.shipLife, 850, 25, 40, 40);

      const life3 = this.context.drawImage(this.shipLife, 790, 25, 40, 40);
    }
  },

  // background----------------------------
  moveBackground() {
    if (myGameArea.totalPoints < 49) {
      this.speed = -1;
    }
    if (myGameArea.totalPoints > 50) {
      this.speed = -2;
    }
    if (myGameArea.totalPoints > 100) {
      this.speed = -3;
    }
    this.y -= this.speed;
    this.y %= myGameArea.canvas.height;
  },

  // limpa a tela do canvas----------------
  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },

  // stop the game-------------------------
  stop() {
    clearInterval(this.interval);
  },
};

// clase da nave (player) -------------------------------------------------------------
class SpaceShip {
  constructor(width, height, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    // speed
    this.speedX = 0;
    this.speedY = 0;
    this.ship = document.getElementById('spaceship');
    this.fire = document.getElementById('fire');
    this.explosion = document.getElementById('explosion');

    this.thrust = false;
    this.exploding = false;

    this.collision = false;
    this.lives = 4;
  }

  // desenha a nave no mapa
  drawSpaceship() {
    if (this.exploding === false) {
      myGameArea.context.drawImage(
        this.ship,
        this.x,
        this.y,
        this.width,
        this.height,
      );
    } else if (this.exploding === true) {
      myGameArea.context.drawImage(
        this.explosion,
        this.x,
        this.y,
        this.width,
        this.height,
      );
    }
  }

  // desenha o foguinho da arrow up
  drawFire() {
    if (this.thrust === true && this.exploding === false) {
      myGameArea.context.drawImage(this.fire, this.x + 23, this.y + 65, 35, 40);
      myGameArea.context.drawImage(this.fire, this.x + 13, this.y + 65, 35, 40);
    } else {
      this.thrust = false;
    }
  }

  // posição de movimento da nave, sem incremento de velocidade.
  newPos() {
    if (this.exploding === false) {
      this.x += this.speedX;
      this.y += this.speedY;
    } else {
      this.x += 0;
      this.y += 0;
    }
  }

  // crash
  left() {
    return this.x;
  }

  right() {
    return this.x - 10 + this.width;
  }

  top() {
    return this.y;
  }

  bottom() {
    return this.y - 10 + this.height;
  }

  // recebe obstaculo e recebe a propria instancia em q eles estao
  crashWith(asteroid) {
    const crash = this.bottom() < asteroid.y
      || this.top() > asteroid.y - 10 + asteroid.height
      || this.right() < asteroid.x
      || this.left() > asteroid.x - 10 + asteroid.width;
    if (!crash) {
      return !crash;
    }
  }
}
// instancia a classe da nave e passa os valores dela.
const player = new SpaceShip(70, 80, 460, 700);

//  ASTEROIDS--------------------------------------------------------------------------
class Asteroids {
  constructor(width, height, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
  }

  drawAsteroid() {
    const asteroid1 = document.getElementById('asteroid1');

    myGameArea.context.drawImage(
      asteroid1,
      this.x,
      this.y,
      this.width,
      this.height,
    );
  }
}

// cria os asteroid em posições aleatórias no eixo x
function createAsteroids() {
  let speedy = 1.5;

  if (myGameArea.totalPoints > 50) {
    speedy = 2;
  }

  if (myGameArea.totalPoints > 100) {
    speedy = 2.5;
  }

  if (myGameArea.totalPoints > 200) {
    speedy = 3;
  }

  for (let i = 0; i < asteroids.length; i += 1) {
    asteroids[i].y += speedy;
    asteroids[i].drawAsteroid();
  }

  if (myGameArea.frames % 130 === 0) {
    const y = 0;
    const x = Math.floor(Math.random() * (990 - 20) + 20);
    asteroids.push(new Asteroids(40, 40, x, y));
  }

  if (myGameArea.totalPoints > 50) {
    if (myGameArea.frames % 120 === 0) {
      const y = 0;
      const x = Math.floor(Math.random() * (990 - 20) + 20);
      asteroids.push(new Asteroids(40, 40, x, y));
    }
  }

  if (myGameArea.totalPoints > 100) {
    if (myGameArea.frames % 110 === 0) {
      const y = 0;
      const x = Math.floor(Math.random() * (990 - 20) + 20);
      asteroids.push(new Asteroids(40, 40, x, y));
    }
  }
}

// INIMIGOS -----------------------------------------------------------------
class Enemies {
  constructor(width, height, x, y, enemyLife) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.enemy = document.getElementById('enemy1');
    this.enemyLife = enemyLife;
  }

  drawEnemy() {
    myGameArea.context.drawImage(
      this.enemy,
      this.x,
      this.y,
      this.width,
      this.height,
    );
  }
}

function createEnemy() {
  let speedy = 1;

  if (myGameArea.totalPoints > 50) {
    speedy = 2;
  }
  if (myGameArea.totalPoints > 100) {
    speedy = 3;
  }
  if (myGameArea.totalPoints > 200) {
    speedy = 4;
  }
  for (let i = 0; i < enemies.length; i += 1) {
    enemies[i].y += speedy;
    enemies[i].drawEnemy();
  }

  if (myGameArea.frames % 2000 === 0) {
    const y = 0;
    const x = Math.floor(Math.random() * (940 - 60) + 60);
    enemies.push(new Enemies(70, 80, x, y, 2));
  }
  if (myGameArea.totalPoints > 50) {
    if (myGameArea.frames % 900 === 0) {
      const y = 0;
      const x = Math.floor(Math.random() * (940 - 60) + 60);
      enemies.push(new Enemies(70, 80, x, y, 2));
    }
  }
  if (myGameArea.totalPoints > 100) {
    if (myGameArea.frames % 600 === 0) {
      const y = 0;
      const x = Math.floor(Math.random() * (940 - 60) + 60);
      enemies.push(new Enemies(70, 80, x, y, 2));
    }
  }
}

const enemiesNew = new Enemies();
// TIROS ----------------------------------------------------------------------

class Rockets {
  constructor(x, y, getIt) {
    this.x = x + 26;
    this.y = y - 40;
    this.shoot = true;
    this.laser = document.getElementById('laser');
    this.laserLarge = document.getElementById('laserLarge');
  }

  // desenha laser
  drawLaser() {
    if (getIt === false) {
      myGameArea.context.drawImage(this.laser, this.x, this.y, 15, 25);
    } else {
      myGameArea.context.drawImage(this.laserLarge, this.x, this.y, 25, 40);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  newPosLaser() {
    for (let i = 0; i < laserArr.length; i += 1) {
      laserArr[i].y -= 4;
    }
  }

  left() {
    return this.x;
  }

  right() {
    return this.x - 20 + this.width;
  }

  top() {
    return this.y;
  }

  bottom() {
    return this.y - 20 + this.height;
  }

  // recebe obstaculo e recebe a propria instancia em q eles estao
  crashWith(asteroid) {
    return !(
      this.bottom() < asteroid.y
      || this.top() > asteroid.y - 10 + asteroid.height
      || this.right() < asteroid.x
      || this.left() > asteroid.x - 10 + asteroid.width
    );
  }
}

const lasers = new Rockets();
// função para chamar o tiro
function shootLaser() {
  if (
    player.exploding === false
    && player.collision === false
    && laserArr.length < 5
  ) {
    laserArr.push(new Rockets(player.x, player.y, getIt));
    if (getIt === false) {
      audio.laser.load();
      audio.laser.volume = 0.7;
      audio.laser.play();
    }
    if (getIt === true) {
      audio.laserLarge.load();
      audio.laserLarge.play();
    }
  }

  lasers.shoot = false;
}

// items -------------------------------------------------------------------
class Items {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.item = document.getElementById('item');
  }

  // desenha item
  drawItem() {
    myGameArea.context.drawImage(
      this.item,
      this.x,
      this.y,
      this.width,
      this.height,
    );
  }
}

// cria item
function createItems() {
  let speedy = 2;

  if (myGameArea.totalPoints > 50) {
    speedy = 3;
  }
  if (myGameArea.totalPoints > 100) {
    speedy = 4;
  }
  if (myGameArea.totalPoints > 200) {
    speedy = 5;
  }
  for (let i = 0; i < itemsArr.length; i += 1) {
    itemsArr[i].y += speedy;
    itemsArr[i].drawItem();
  }
  if (myGameArea.frames % 2000 === 0) {
    const y = 0;
    const x = Math.floor(Math.random() * (940 - 60) + 60);
    itemsArr.push(new Items(x, y, 50, 30));
  }
}

// o que acontece quando vc pega o item/ pegar o item
function getItem() {
  for (let i = 0; i < itemsArr.length; i += 1) {
    if (
      itemsArr[i].x > player.x
      && player.x + player.width > itemsArr[i].x + itemsArr[i].width
      && itemsArr[i].y + itemsArr[i].height >= player.y
      && itemsArr[i].y <= player.y + player.height
    ) {
      itemsArr.splice(i, 1);

      audio.getItem.load();
      audio.getItem.play();

      getIt = true;

      setTimeout(() => {
        getIt = false;
      }, 3000);
    }
  }
}

// remove laser posicao fora da tela
function removeLaser() {
  for (let i = 0; i < laserArr.length; i += 1) {
    if (laserArr[i].y < 0) {
      laserArr.splice(i, 1);
    }
  }
}

// remove asteroid posição fora da tela
function removeAsteroid() {
  for (let i = 0; i < asteroids.length; i += 1) {
    if (asteroids[i].y > 800) {
      asteroids.splice(i, 1);
    }
  }
}
// --------------------------------------------------------------------------------------
// COLLISION SPACESHIP - ASTEROID.
function checkCollision() {
  let crashed = false;
  asteroids.forEach((asteroid, index) => {
    if (player.crashWith(asteroid) && player.exploding === false) {
      crashed = true;
      asteroids.splice(index, 1);
    }
  });

  if (crashed && player.exploding === false) {
    player.exploding = true;
    player.lives -= 1;
    audio.explosion.load();
    audio.explosion.volume = 0.4;
    audio.explosion.play();
    if (myGameArea.totalPoints >= 50) {
      myGameArea.bonusPoints -= 50;
    } else { myGameArea.bonusPoints = 0; }
    setTimeout(() => {
      player.exploding = false;
      player.collision = true;
    }, 2000);
  }

  enemies.forEach((enemy, index) => {
    if (player.crashWith(enemy) && player.exploding === false) {
      crashed = true;
      enemies.splice(index, 1);
    }
  });

  if (crashed && player.exploding === false) {
    player.exploding = true;
    player.lives -= 1;
    audio.explosion.load();
    audio.explosion.play();

    if (myGameArea.totalPoints >= 50) {
      myGameArea.bonusPoints -= 50;
    } else { myGameArea.bonusPoints = 0; }

    setTimeout(() => {
      player.exploding = false;
      player.collision = true;
    }, 2000);
  }

  // check collision do tiro com o asteroid
  for (let i = 0; i < asteroids.length; i += 1) {
    for (let j = 0; j < laserArr.length; j += 1) {
      if (
        laserArr[j].x >= asteroids[i].x
        && laserArr[j].x <= asteroids[i].x + asteroids[i].width
        && (laserArr[j].y <= asteroids[i].y + asteroids[i].height
          && laserArr[j].y >= asteroids[i].y)
      ) {
        asteroids.splice(i, 1);
        laserArr.splice(j, 1);
        myGameArea.bonusPoints += 5;
      }
    }
  }

  // check collision tiro com nave inimiga
  for (let i = 0; i < enemies.length; i += 1) {
    for (let j = 0; j < laserArr.length; j += 1) {
      if (
        laserArr[j].x >= enemies[i].x
        && laserArr[j].x <= enemies[i].x + enemies[i].width
        && (laserArr[j].y <= enemies[i].y + enemies[i].height
          && laserArr[j].y >= enemies[i].y)
      ) {
        enemies[i].enemyLife -= 1;
        // enemies.splice(i, 1);
        laserArr.splice(j, 1);
      }
    }
  }
  for (let i = 0; i < enemies.length; i += 1) {
    if (enemies[i].enemyLife === 0) {
      myGameArea.bonusPoints += 30;
      enemies.splice(i, 1);
    }
  }
}

// reset -----------------------------------------------------------------------------
function resetGame() {
  asteroids = [];
  laserArr = [];
  enemies = [];
  itemsArr = [];
  myGameArea.bonusPoints = 0;
  myGameArea.totalPoints = 0;
  player.lives = 4;
  player.collision = false;
  player.x = 460;
  player.y = 600;
}
// game over --------------------------------------------------------------------------
function checkGame() {
  // stop game
  if (player.lives === 0) {
    audio.gameMusic.pause();
    audio.gameOver.load();
    audio.gameOver.play();
    myGameArea.stop();
    myGameArea.drawGameOver();
    setTimeout(() => {
      audio.gameOver.pause();
      document.getElementById('menuMusic').play();
      myGameArea.menu();
      enterStart = true;
    }, 5000);
  }
}
function collisionTest() {
  if (player.collision === true) {
    player.ship = document.getElementById('shipBlack');
    player.collision = true;
    setTimeout(() => {
      player.collision = false;
      player.ship = document.getElementById('spaceship');
    }, 2500);
  } else {
    checkCollision();
  }
}

// BOUNDARIES--------------------------------------------------------
function boundaries() {
  if (player.y >= 730) {
    player.y -= 5;
  } else if (player.x >= 950) {
    player.x -= 5;
  } else if (player.y <= 0) {
    player.y += 5;
  } else if (player.x <= 0) {
    player.x += 5;
  }
}

// UPDATE--------------------------------------------------------------------------------
function updateMenu() {
  lasers.shoot = false;
  myGameArea.drawMenu();
  myGameArea.moveBackground();
}

function updateGame() {
  myGameArea.clear();
  player.newPos();
  myGameArea.drawBoard();
  myGameArea.drawLives();
  myGameArea.moveBackground();
  player.drawSpaceship();
  createItems();
  createAsteroids();
  createEnemy();
  for (let i = 0; i < laserArr.length; i += 1) {
    laserArr[i].drawLaser();
  }
  myGameArea.frames += 4;
  lasers.newPosLaser();
  player.drawFire();
  myGameArea.drawScore();
  boundaries();
  collisionTest();
  checkGame();
  removeLaser();
  removeAsteroid();
  getItem();
}

// callback para o jogo começar
myGameArea.menu();

// movimento baseado no teclado ----------------------------------------------------------
document.onkeydown = function (e) {
  switch (e.keyCode) {
    case 38: // up arrow
      player.speedY = -4;
      player.thrust = true;
      break;
    case 40: // down arrow
      player.speedY = 4;
      break;
    case 37: // left arrow
      player.speedX = -4;
      player.ship = document.getElementById('shipSide');
      break;
    case 39: // right arrow
      player.speedX = 5;
      player.ship = document.getElementById('shipSide2');
      break;
    case 32: // space bar
      if (lasers.shoot === true) {
        shootLaser();
      }
      break;
    case 13:
      if (enterStart === true) {
        document.getElementById('menuMusic').pause();
        myGameArea.start();
        clearInterval(myGameArea.intervalMenu);
      }
      enterStart = false;
      break;
  }
};
// velocidade vai para zero quando a tecla não está pressionada
document.onkeyup = function (e) {
  switch (e.keyCode) {
    case 38: // up arrow
      player.speedY = 0;
      player.thrust = false;
      break;
    case 40: // down arrow
      player.speedY = 0;
      break;
    case 37: // left arrow
      player.speedX = 0;
      player.ship = document.getElementById('spaceship');
      break;
    case 39: // right arrow
      player.speedX = 0;
      player.ship = document.getElementById('spaceship');
      break;
    case 32:
      lasers.shoot = true;
      break;
  }
};
