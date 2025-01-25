const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
class SnakePart{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}
let snakeParts = [];
let tailLen = 1;
let speed = 8;

let tileCount = 20;
let tileSize = canvas.width / tileCount - 2;
let headX = 10;
let headY = 10;
let xV = 0;
let yV = 0;

let score = 0;
let lastRenderTime = 0;
let isGameStarted = false;

let appleX = 5;
let appleY = 5;
let slowApple = generateApplePosition();
let slowAppleX = slowApple.x;
let slowAppleY = slowApple.y;
let drawSlowApple = false;
let shortApple = generateApplePosition();
let shortAppleX = shortApple.x;
let shortAppleY = shortApple.y;
let drawShortApple = false;

ctx.fillStyle = 'black';
ctx.fillRect(0, 0, canvas.width, canvas.height);

function startGame(currentTime) {
    if (lastRenderTime === 0) {
        lastRenderTime = currentTime;
    }

    const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000;
    if (secondsSinceLastRender < 1 / speed) {
        requestAnimationFrame(startGame);
        return;
    }

    lastRenderTime = currentTime;

    snakePosition();
    let lose = isOver();
    if (lose) {
        document.body.addEventListener('keydown', playAgain);
        return;
    }

    checkColli();
    let win = isWin();
    if (win) {
        return;
    }

    clearScreen();
    drawApple();
    drawSnake();
    drawScore();

    requestAnimationFrame(startGame);
}

function snakePosition() {
    headX = headX + xV;
    headY = headY + yV;

    snakeParts.push(new SnakePart(headX, headY));

    while (snakeParts.length > tailLen) {
        snakeParts.shift();
    }
}

function drawSnake() {
    ctx.fillStyle = 'green';
    for (let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i];
        ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
    }

    ctx.fillStyle = 'orange';
    ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
}

function isOver() {
    const hitWall = headX < 0 || headX >= tileCount || headY < 0 || headY >= tileCount;
    const hitSelf = snakeParts.some((part, index) => index !== snakeParts.length - 1 && part.x === headX && part.y === headY);
    
    if (hitWall || hitSelf) {
        ctx.fillStyle = "white";
        ctx.font = "50px Poppins";
        ctx.fillText("Game Over!", canvas.width / 6.5, canvas.height / 2);
        ctx.font = "40px Poppins";
        ctx.fillText("再玩一次?", canvas.width / 3.5, canvas.height / 2 + 50);
        ctx.font = "25px Poppins";
        ctx.fillText("按空白鍵", canvas.width / 2.7, canvas.height / 2 + 100);
        return true;
    }
    return false;
}


function playAgain(event) {
    if (event.key == ' ') {
        document.body.removeEventListener('keydown', playAgain);
        location.reload();
    }
}

function clearScreen() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function checkColli() {
    if (appleX === headX && appleY === headY) {
        let newApple = generateApplePosition();
        appleX = newApple.x;
        appleY = newApple.y;
        tailLen++;
        score++;
        if (score > 5 && score % 2 === 0) {
            speed++;
        }
        drawSlowApple = Math.random() < 0.5;
        drawShortApple = Math.random() < 0.3;
    }
    if (slowAppleX === headX && slowAppleY === headY) {
        let newApple = generateApplePosition();
        slowAppleX = newApple.x;
        slowAppleY = newApple.y;
        speed = Math.max(speed - 3, 1);
    }
    if (shortAppleX === headX && shortAppleY === headY) {
        let newApple = generateApplePosition();
        shortAppleX = newApple.x;
        shortAppleY = newApple.y;
        tailLen = Math.max(tailLen - 2, 1);
        drawShortApple = Math.random() < 0.3;
    }
}

function isWin() {
    let win = false;
    if (score == 25) {
        win = true;
    }
    if (win) {
        ctx.fillStyle = "white";
        ctx.font = "50px Poppins";
        ctx.fillText("你贏了!", canvas.width / 3.3, canvas.height / 2)
    }
    return win;
}

function drawApple() {
    drawSingleApple("red", appleX, appleY);
    if (drawSlowApple) {
        drawSingleApple("yellow", slowAppleX, slowAppleY);
    }
    if (drawShortApple) {
        drawSingleApple("blue", shortAppleX, shortAppleY);
    }
}

function drawSingleApple(color, x, y) {
    ctx.fillStyle = color;
    ctx.fillRect(x * tileCount, y * tileCount, tileSize, tileSize);
}

function generateApplePosition() {
    let position;
    do {
        position = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
    } while (
        snakeParts.some(part => part.x === position.x && part.y === position.y) ||
        (position.x === headX && position.y === headY)
    );
    return position;
}

function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "10px Poppins";
    ctx.fillText("Score: " + score, canvas.width - 50, 10);
}
requestAnimationFrame(startGame);



document.body.addEventListener('keydown', event => {
    switch (event.key) {
        case "ArrowLeft":
            if (xV !== 1) {
                xV = -1;
                yV = 0;
            }
            break;
        case "ArrowUp":
            if (yV !== 1) {
                xV = 0;
                yV = -1;
            }
            break;
        case "ArrowRight":
            if (xV !== -1) {
                xV = 1;
                yV = 0;
            }
            break;
        case "ArrowDown":
            if (yV !== -1) {
                xV = 0;
                yV = 1;
            }
            break;
    }
});


document.getElementById('up').addEventListener('click', function() {
    if (yV == 1) return;
    yV = -1;
    xV = 0;
});
document.getElementById('down').addEventListener('click', function() {
    if (yV == -1) return;
    yV = 1;
    xV = 0;
});
document.getElementById('left').addEventListener('click', function() {
    if (xV == 1) return;
    yV = 0;
    xV = -1;
});
document.getElementById('right').addEventListener('click', function() {
    if (xV == -1) return;
    yV = 0;
    xV = 1;
})
