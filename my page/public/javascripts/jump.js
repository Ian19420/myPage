const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');


let tileCount = 20;
let speed = 10;
let gravity = 0.5;
let jumpVelocity = -2;
let appleSpeed = 0.5;
let appleCount = 5;

const tileSize = canvas.width / tileCount - 2;
let score = 0;
let headX = 0;
let headY = tileCount - 1;
let xV = 0;
let yV = 0;
let isJumping = false;
let lastRenderTime = 0;
let eat = false;

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
        setTimeout(() => {
            this.x = Math.floor(Math.random() * tileCount);
            this.y = Math.random() * -tileCount;
            this.color = "red"
        }, 300);
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
    updatePosition();
    updateApples();
    check();
    clearScreen();
    drawPerson();
    drawApples();
    applyGravity();
    drawScore();

    requestAnimationFrame(startGame);
}

function updatePosition() {
    headX += xV;
    headY += yV;

    if (headX < 0) headX = 0;
    if (headX >= tileCount) headX = tileCount - 1;
    if (headY >= tileCount) headY = tileCount - 1;
}

function applyGravity() {
    if (!isOnGround()) {
        yV += gravity;
    } else {
        yV = 0;
        isJumping = false;
    }
}

function isOnGround() {
    return headY >= tileCount - 1;
}

function updateApples() {
    apples.forEach(apple => apple.fall());
}

function check() {
    apples.forEach(apple => {
        if (Math.floor(apple.x) === headX && Math.floor(apple.y) > headY) {
            apple.color = "orange";
            score++;
            apple.resetPosition();
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

document.body.addEventListener('keydown', event => {
    switch (event.key) {
        case "ArrowLeft":
            xV = -1;
            break;
        case "ArrowRight":
            xV = 1;
            break;
        case " ":
            if (!isJumping && isOnGround()) {
                yV = jumpVelocity;
                isJumping = true;
            }
            break;
    }
});
document.getElementById('up').addEventListener('click', function() {
    if (!isJumping && isOnGround()) {
        yV = jumpVelocity;
        isJumping = true;
    }
});
document.getElementById('left').addEventListener('click', function() {
    xV = -1;
});
document.getElementById('right').addEventListener('click', function() {
    xV = 1;
})

requestAnimationFrame(startGame);
