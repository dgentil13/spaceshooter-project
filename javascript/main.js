/* eslint-disable func-names */
/* eslint-disable default-case */
function startGame() {
  myGameArea.start();
}

// array de asteroids
const asteroids = [];
const laserArr = [];

// contrução do mapa -----------------------------------------------------------------
const myGameArea = {
  canvas: document.createElement('canvas'),
  frames: 0,
  y: 0,
  speed: -1,

  start() {
    this.canvas.width = 1000;
    this.canvas.height = 800;
    this.context = this.canvas.getContext('2d');
    document
      .getElementById('game-board')
      .insertBefore(
        this.canvas,
        document.getElementById('game-board').childNodes[0],
      );
    // chama a função update game
    this.interval = setInterval(updateGame, 15);
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
  // parte cima da tela --------
  drawScore() {
    // const points = Math.floor(this.frames / 5);
    this.context.font = ' 20px spaceFont';
    this.context.fillStyle = 'white';
    this.context.fillText('Score: ', 40, 50);
  },

  // ----------------------------
  moveBackground() {
    this.y -= this.speed;
    this.y %= myGameArea.canvas.height;
  },

  // limpa a tela do canvas
  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
    this.thrust = false;
  }

  // desenha a nave no mapa
  drawSpaceship() {
    myGameArea.context.drawImage(
      this.ship,
      this.x,
      this.y,
      this.width,
      this.height,
    );
  }

  // desenha o foguinho da arrow up
  drawFire() {
    if (this.thrust === true) {
      myGameArea.context.drawImage(this.fire, this.x + 23, this.y + 65, 35, 40);
      myGameArea.context.drawImage(this.fire, this.x + 13, this.y + 65, 35, 40);
    }
  }

  // posição de movimento da nave, sem incremento de velocidade.
  newPos() {
    this.x += this.speedX;
    this.y += this.speedY;
  }
}

// instancia a classe da nave e passa os valores dela.
const player = new SpaceShip(70, 80, 460, 700);

// classe dos asteroids --------------------------------------------------------------------------
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
  for (let i = 0; i < asteroids.length; i += 1) {
    asteroids[i].y += 0.5;
    asteroids[i].drawAsteroid();
  }
  myGameArea.frames += 0.5;
  if (myGameArea.frames % 160 === 0) {
    const y = 0;
    const x = Math.floor(Math.random() * myGameArea.canvas.width);
    asteroids.push(new Asteroids(40, 40, x, y));
  }
}

// Tiros ----------------------------------------------------------------------

class Rockets {
  constructor(x, y) {
    this.x = x + 26;
    this.y = y - 40;
    this.shoot = true;
    this.laser = document.getElementById('laser');
  }

  drawLaser() {
    myGameArea.context.drawImage(this.laser, this.x, this.y, 15, 25);
  }

  // eslint-disable-next-line class-methods-use-this
  newPosLaser() {
    for (let i = 0; i < laserArr.length; i += 1) {
      laserArr[i].y -= 3;
    }
  }
}

const lasers = new Rockets();

function shootLaser() {
  if (lasers.shoot === true) {
    laserArr.push(new Rockets(player.x, player.y));
  }

  lasers.shoot = false;
}
// --------------------------------------------------------------------------------------

function updateGame() {
  myGameArea.clear();
  player.newPos();
  myGameArea.drawBoard();
  myGameArea.moveBackground();
  player.drawSpaceship();
  createAsteroids();
  for (let i = 0; i < laserArr.length; i += 1) {
    laserArr[i].drawLaser();
  }
  lasers.newPosLaser();
  player.drawFire();
  myGameArea.drawScore();
}

// callback para o jogo começar
myGameArea.start();

// movimento baseado no teclado -----------------------------------------------------------
document.onkeydown = function (e) {
  switch (e.keyCode) {
    case 38: // up arrow
      player.speedY = -3;
      player.thrust = true;
      break;
    case 40: // down arrow
      player.speedY = 3;
      break;
    case 37: // left arrow
      player.speedX = -3;
      player.ship = document.getElementById('shipSide');

      break;
    case 39: // right arrow
      player.speedX = 3;
      break;
    case 32: // space bar
      shootLaser();
      lasers.shoot = false;
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
      break;
    case 32:
      lasers.shoot = true;
      break;
  }
};
