let gameID = null;

const gamecanvas = document.getElementById("gamecanvas");
const context = gamecanvas.getContext("2d");
const FRAMEES_PER_SECOND = 60;

const keyW = 87;
const keyS = 83;
const keyUp = 38;
const keyDown = 40;
const keyEnter = 13;

const PADDLE_HEIGHT = gamecanvas.height / 5;
const PADDLE_WIDTH = 5;
let paddleP1 = {
    'x': 10,
    'y': 0
}
let paddleP2 = {
    'x': gamecanvas.width - 15,
    'y': 0
};

const ball = {
    'x': gamecanvas.width / 2,
    'y': gamecanvas.height / 2
}
let ballSpeed = {
    'x': 1,
    'y': 1
}

const WINNING_SCORE = 3;
const score = {
    'P1': 0,
    'P2': 0
}

function drawAll() {
    drawBoard();
    drawPaddles();
    drawBall();
    drawScore();
}

function drawBoard() {
    drawRect("black", 0, 0, gamecanvas.width, gamecanvas.height);
    for (let i = 0; i < gamecanvas.height; i += 10) {
        drawRect("white", gamecanvas.width / 2 - 1, i, 2, 5);
    }
}

function drawPaddles() {
    drawRect('white', paddleP1.x, paddleP1.y, PADDLE_WIDTH, PADDLE_HEIGHT);
    drawRect('white', paddleP2.x, paddleP2.y, PADDLE_WIDTH, PADDLE_HEIGHT);
}

function drawBall() {
    context.fillStyle = "white";
    context.beginPath();
    context.arc(ball.x, ball.y, 2, 0, 2 * Math.PI, true);
    context.fill();
}

function drawRect(color, x, y, sizeX, sizeY) {
    context.fillStyle = color;
    context.fillRect(x, y, sizeX, sizeY);
}

function drawScore() {
    context.fillText(`${score.P1}    ${score.P2}`, gamecanvas.width / 2 - 12, 10);
}

function moveBall() {
    ball.x += ballSpeed.x;
    ball.y += ballSpeed.y;

    detectHit();

    if (horizontalyOutOfBounds()) {
        calculateScore();
        resetBall();
    }

    if (verticalyOutOfBounds()) {
        changeBallDirectionY();
    }
}

function calculateScore() {
    (ball.x < 0) ? score.P2++ : score.P1++;
    if (score.P1 === WINNING_SCORE) {
        resetScore();
        showWinningScreeen('P1');
    } else if (score.P2 === WINNING_SCORE) {
        resetScore();
        showWinningScreeen('P2');
    }
}
function resetScore() {
    score.P1 = 0;
    score.P2 = 0;
}

function showWinningScreeen(player) {
    clearInterval(gameID);
    setTimeout(() => {
        drawRect("black", 0, 0, gamecanvas.width, gamecanvas.height);
        context.fillStyle = "white";
        context.fillText(`${player} WON! Press ENTER to play again!`, 25, gamecanvas.height / 2);
        gameID = null;
    }, 100);
}

function detectHit() {
    if (ball.x === paddleP1.x + PADDLE_WIDTH && ball.y > paddleP1.y && ball.y < paddleP1.y + PADDLE_HEIGHT) {
        changeBallDirection(0.05 * (ball.y - paddleP1.y + PADDLE_HEIGHT / 2));
    }
    if (ball.x === paddleP2.x && ball.y > paddleP2.y && ball.y < paddleP2.y * PADDLE_HEIGHT) {
        changeBallDirection(0.05 * (ball.y - paddleP2.y + PADDLE_HEIGHT / 2));
    }
}

function resetBall() {
    ball.x = gamecanvas.width / 2;
    ball.y = gamecanvas.height / 2;
    ballSpeed.y = 1;
}

function changeBallDirection(y) {
    ballSpeed.x = -ballSpeed.x;
    ballSpeed.y = y;
}

function changeBallDirectionY() {
    ballSpeed.y = -ballSpeed.y;
}

function verticalyOutOfBounds() {
    return ball.y > gamecanvas.height || ball.y < 0;
}

function horizontalyOutOfBounds() {
    return ball.x > gamecanvas.width || ball.x < 0;
}

function movePaddles(e) {
    let paddleOffset = gamecanvas.height / 20;
    if (e.keyCode === keyW && paddleP1.y > 0) {
        paddleP1.y -= paddleOffset;
    } else if (e.keyCode === keyS && paddleP1.y < gamecanvas.height - PADDLE_HEIGHT) {
        paddleP1.y += paddleOffset;
    } else if (e.keyCode === keyUp && paddleP2.y > 0) {
        paddleP2.y -= paddleOffset;
    } else if (e.keyCode === keyDown && paddleP2.y < gamecanvas.height - PADDLE_HEIGHT) {
        paddleP2.y += paddleOffset;
    } else if (gameID === null && e.keyCode === keyEnter) {
        startGame();
    }
}

function startGame() {
    gameID = setInterval(() => { moveBall(); drawAll(); }, 1000 / FRAMEES_PER_SECOND);
}

function showStartMenu(){
    drawRect("black", 0, 0, gamecanvas.width, gamecanvas.height);
    context.fillStyle = "white";
    context.fillText(`Press ENTER to play!`, 25, gamecanvas.height / 2);
}

window.onload = () => {
    document.addEventListener('keydown', e => movePaddles(e));
    showStartMenu();
}
