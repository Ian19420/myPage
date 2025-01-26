const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');


let tileCount = 20;
let speed = 15;
let gravity = 0.5;
let jumpVelocity = -2;
let appleSpeed = 0.5;
let appleCount = 5;

let tileSize = canvas.width / tileCount - 2;
let score = 0;
let headX = 0;
let headY = tileCount - 1;
let xV = 0;
let yV = 0;
let jumpTimes = 2;
let lastRenderTime = 0;
let isGameOver = false;

class Apple {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = tileSize;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(
            this.x * tileCount + tileCount / 2,
            this.y * tileCount + tileCount / 2,
            this.size / 2,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }
    fall() {
        this.y += appleSpeed;
        if (this.y >= tileCount) {
            this.resetPosition();
        }
    }
    resetPosition() {
        this.x = Math.floor(Math.random() * tileCount);
        this.y = Math.random() * -tileCount;
        this.color = "red";
    }
}
let apples = Array.from({ length: appleCount }, () =>
    new Apple(Math.floor(Math.random() * tileCount), Math.random() * -tileCount, "red")
);

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
    if (isGameOver) {
        return;
    }
    updatePosition();
    updateApples();
    check();
    clearScreen();
    drawPerson();
    drawApples();
    applyGravity();
    if (isOver()) {
        isGameOver = true;
        document.body.addEventListener('keydown', playAgain);
        return;
    }
    drawScore();

    requestAnimationFrame(startGame);
}

function updatePosition() {
    if(isOnGround()) {
        headX += xV;
        xV *= 0.9;
    } else {
        headX += xV;
    }
    headY += yV;

    if (headX < 0) headX = 0;
    if (headX >= tileCount) headX = tileCount - 1;
    if (headY >= tileCount) {
        headY = tileCount - 1;
        yV = 0;
        jumpTimes = 2;
    }
}
function jump() {
    if(jumpTimes > 0){
        yV = jumpVelocity;
        jumpTimes--;
    }
}
function applyGravity() {
    if (!isOnGround()) {
        yV += gravity;
    } else {
        yV = 0;
        headY = tileCount - 1;
        jumpTimes = 2;
    }
}

function isOnGround() {
    return headY >= tileCount - 1 - 0.1;
}
function isOver() {
    const playerCenterX = headX * tileCount + tileSize / 2;
    const playerCenterY = headY * tileCount + tileSize / 2;
    for (let apple of apples) {
        const appleCenterX = apple.x * tileCount + apple.size / 2;
        const appleCenterY = apple.y * tileCount + apple.size / 2;
        const distance = Math.sqrt(
            Math.pow(playerCenterX - appleCenterX, 2) + 
            Math.pow(playerCenterY - appleCenterY, 2)
        );
        if (distance < tileSize * 0.75) {
            ctx.fillStyle = "black";
            ctx.font = "50px Poppins";
            ctx.fillText("Game Over!", canvas.width / 6.5, canvas.height / 2);
            ctx.font = "20px Poppins";
            ctx.fillText("scores: " + score, canvas.width / 2.5, canvas.height / 2 + 20);
            ctx.font = "40px Poppins";
            ctx.fillText("再玩一次?", canvas.width / 3.5, canvas.height / 2 + 70);
            ctx.font = "25px Poppins";
            ctx.fillText("按 R 重玩", canvas.width / 2.7, canvas.height / 2 + 100);
            return true;
        }
    }
    return false;
}
function resetGame() {
    isGameOver = false;
    score = 0;
    headX = 0;
    headY = tileCount - 1;
    xV = 0;
    yV = 0;
    jumpTimes = 0;
    apples = Array.from({ length: appleCount }, () =>
        new Apple(Math.floor(Math.random() * tileCount), Math.random() * -tileCount, "red")
    );
    clearScreen();
    requestAnimationFrame(startGame);
}
function playAgain(event) {
    if (event.key === 'R') {
        resetGame();
    }
}

function updateApples() {
    apples.forEach(apple => apple.fall());
}

function check() {
    apples.forEach(apple => {
        const playerLeftX = headX * tileCount;
        const playerRightX = playerLeftX + tileSize;
        const playerBottomY = (headY + 1) * tileCount;

        const appleLeftX = apple.x * tileCount;
        const appleRightX = appleLeftX + apple.size;
        const appleTopY = apple.y * tileCount;

        const isAboveApple =
            playerBottomY < appleTopY &&
            playerRightX > appleLeftX &&
            playerLeftX < appleRightX;

        if (isAboveApple ) {
            apple.color = "orange";
            score++;
            setTimeout(() => {
                apple.resetPosition();
            }, 300);
        }
    });
}

function drawPerson() {
    ctx.fillStyle = "black";
    ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
}

function drawApples() {
    apples.forEach(apple => apple.draw());
}

function drawScore() {
    ctx.fillStyle = "black";
    ctx.font = "10px Poppins";
    ctx.fillText(`Score: ${score}`, 10, 20);
}

function clearScreen() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
function playAgain(event) {
    if (event.key == 'R') {
        location.reload();
    }
}
document.body.addEventListener('keydown', event => {
    switch (event.key) {
        case "ArrowLeft":
            xV = -1;
            break;
        case "ArrowRight":
            xV = 1;
            break;
        case " ":
            jump();
            break;
    }
});
document.getElementById('up').addEventListener('click', function() {
    if (isOnGround()) {
        jump();
    }
});
document.getElementById('left').addEventListener('click', function() {
    xV = -0.7;
});
document.getElementById('right').addEventListener('click', function() {
    xV = 0.7;
})
requestAnimationFrame(startGame);
