const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Ukuran canvas
canvas.width = 400;
canvas.height = 400;

// Variabel permainan
let snake = [{ x: 10, y: 10 }];
let direction = { x: 1, y: 0 };
let food = { x: 5, y: 5 };
let boxSize = 20;
let gameOver = false;
let snakeLength = 1;

// Daftar gambar makanan
const foodImages = [
    'images/apple.png',
    'images/carrot.png',
    'images/banana.png'
];
let foodImage = new Image();
foodImage.src = foodImages[0];

// Fungsi menggambar ular
function drawSnake() {
    snake.forEach((segment, i) => {
        ctx.fillStyle = 'lime';
        ctx.shadowColor = 'rgba(0, 255, 0, 0.7)';
        ctx.shadowBlur = 10;

        ctx.fillRect(segment.x * boxSize, segment.y * boxSize, boxSize, boxSize);

        // Reset shadow agar tidak mengganggu gambar lain
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';
    });
}


// Fungsi menggambar makanan
function drawFood() {
    ctx.drawImage(foodImage, food.x * boxSize, food.y * boxSize, boxSize, boxSize);
}

// Fungsi menggerakkan ular
function moveSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        snakeLength++;
        placeFood();
    } else {
        snake.pop();
    }
}

// Fungsi menempatkan makanan acak + pilih gambar baru
function placeFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / boxSize)),
        y: Math.floor(Math.random() * (canvas.height / boxSize)),
    };

    const randomIndex = Math.floor(Math.random() * foodImages.length);
    foodImage.src = foodImages[randomIndex];
}

// Fungsi cek tabrakan
function checkCollision() {
    const head = snake[0];

    if (head.x < 0 || head.y < 0 || head.x >= canvas.width / boxSize || head.y >= canvas.height / boxSize) {
        gameOver = true;
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver = true;
        }
    }
}

// Fungsi tampilan Game Over
function drawGameOver() {
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    
    const text1 = 'Haha kalah🤣';
    const text2 = 'Panjang Ulo: ' + snakeLength;
    const text3 = 'Tekan Enter/Refresh untuk mengulang';
    
    const text1Width = ctx.measureText(text1).width;
    const text2Width = ctx.measureText(text2).width;
    const text3Width = ctx.measureText(text3).width;

    ctx.fillText(text1, (canvas.width - text1Width) / 2, canvas.height / 2 - 20);
    ctx.fillText(text2, (canvas.width - text2Width) / 2, canvas.height / 2 + 20);
    ctx.fillText(text3, (canvas.width - text3Width) / 2, canvas.height / 2 + 60);
}

// Game loop utama
function gameLoop() {
    if (gameOver) {
        drawGameOver();
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    moveSnake();
    checkCollision();
    drawFood();
    drawSnake();
    setTimeout(gameLoop, 200);
}

// Reset game
function resetGame() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 1, y: 0 };
    food = { x: 5, y: 5 };
    snakeLength = 1;
    gameOver = false;
    placeFood();
    gameLoop();
}

// Kontrol keyboard
document.addEventListener('keydown', (e) => {
    if (gameOver && e.key === 'Enter') {
        resetGame();
    }
    switch (e.key) {
        case 'ArrowUp':
        case 'w':
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
        case 's':
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
        case 'a':
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
        case 'd':
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
    }
});

// Kontrol tombol virtual
document.getElementById('up').addEventListener('click', () => direction = { x: 0, y: -1 });
document.getElementById('down').addEventListener('click', () => direction = { x: 0, y: 1 });
document.getElementById('left').addEventListener('click', () => direction = { x: -1, y: 0 });
document.getElementById('right').addEventListener('click', () => direction = { x: 1, y: 0 });

// Mulai permainan
placeFood();
gameLoop();
