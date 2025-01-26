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

let apples = {
    normal: { x: 5, y: 5, draw: true },
    slow: { x: 6, y: 19, draw: true, can: false },
    short: { x: 7, y: 10, draw: true, can: false },
    speed: { x: 19, y: 19, draw: true, can: false }
};

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
    checkColliSpecial();
    checkColliNormal();
    clearScreen();
    NormalPosition();
    drawApple("red", apples.normal.x, apples.normal.y, apples.normal.draw);
    SpecialPosition();
    drawApple("yellow", apples.slow.x, apples.slow.y, apples.slow.draw);
    drawApple("#ADD8E6", apples.short.x, apples.short.y, apples.short.draw);
    drawApple('#C8A2C8', apples.speed.x, apples.speed.y, apples.speed.draw);

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
        ctx.font = "20px Poppins";
        ctx.fillText("scores: " + score, canvas.width / 2.5, canvas.height / 2 + 20);
        ctx.font = "40px Poppins";
        ctx.fillText("再玩一次?", canvas.width / 3.5, canvas.height / 2 + 70);
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

function checkColliNormal() {
    if (apples.normal.x === headX && apples.normal.y === headY) {
        apples.normal.draw = false;
        apples.speed.can = !(Math.random() < 0.5);
        apples.short.can = !(Math.random() < 0.5);
        apples.slow.can = !(Math.random() < 0.5);
        tailLen++;
        score++;
        if (score > 5 && score % 2 === 0) {
            speed++;
        }
    }
}
function checkColliSpecial() {
    if (apples.slow.x === headX && apples.slow.y === headY && apples.slow.draw) {
        apples.slow.draw = false;
        speed = Math.max(speed - 1, 1);
    }
    if (apples.short.x === headX && apples.short.y === headY && apples.short.draw) {
        apples.short.draw = false;
        tailLen = Math.max(tailLen - 2, 1);
    }
    if (apples.speed.x === headX && apples.speed.y === headY && apples.speed.draw) {
        apples.speed.draw = false;
        speed += 2;
    }
}
function NormalPosition() {
    if(!apples.normal.draw) {
        let newApple = generateApplePosition();
        apples.normal.x = newApple.x;
        apples.normal.y = newApple.y;
        apples.normal.draw = true;
    }
}
function SpecialPosition() {
    if (apples.slow.can && !apples.slow.draw) {
        let newApple = generateApplePosition();
        apples.slow.x = newApple.x;
        apples.slow.y = newApple.y;
        apples.slow.draw = true;
        apples.slow.can = false;
    }
    if (apples.short.can && !apples.short.draw) { 
        let newApple = generateApplePosition();
        apples.short.x = newApple.x;
        apples.short.y = newApple.y;
        apples.short.draw = true;
        apples.short.can = false;
    }
    if (apples.speed.can && !apples.speed.draw) {
        let newApple = generateApplePosition();
        apples.speed.x = newApple.x;
        apples.speed.y = newApple.y;
        apples.speed.draw = true;
        apples.speed.can = false;
    }
}

function drawApple(color, x, y, can) {
    if(can) {       
        ctx.fillStyle = color;
        ctx.fillRect(x * tileCount, y * tileCount, tileSize, tileSize);
    }
}

function generateApplePosition() {
    let position;
    do {
        position = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
    } while (isApplePositionInvalid(position));
    return position;
}

function isApplePositionInvalid(position) {
    if (snakeParts.some(part => part.x === position.x && part.y === position.y) ||
        (position.x === headX && position.y === headY)) {
        return true;
    }
    return Object.values(apples).some(apple => apple.x === position.x && apple.y === position.y);
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
