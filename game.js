const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Responsif ukuran canvas
canvas.width = 400;
canvas.height = 400;

// Variabel permainan
let snake = [{ x: 10, y: 10 }]; // Posisi awal ular
let direction = { x: 1, y: 0 }; // Arah gerakan awal (kanan)
let food = { x: 5, y: 5 }; // Posisi makanan awal
let boxSize = 20; // Ukuran kotak
let gameOver = false; // Status permainan
let snakeLength = 1; // Panjang ular

// Fungsi menggambar ular
function drawSnake() {
    ctx.fillStyle = 'lime';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * boxSize, segment.y * boxSize, boxSize, boxSize);
    });
}

// Fungsi menggambar makanan
function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * boxSize, food.y * boxSize, boxSize, boxSize);
}

// Menggerakkan ular
function moveSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);

    // Jika makan makanan
    if (head.x === food.x && head.y === food.y) {
        snakeLength++;
        placeFood();
    } else {
        snake.pop();
    }
}

// Menempatkan makanan secara acak
function placeFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / boxSize)),
        y: Math.floor(Math.random() * (canvas.height / boxSize)),
    };
}

// Mengecek tabrakan
function checkCollision() {
    const head = snake[0];

    // Tabrakan dinding
    if (head.x < 0 || head.y < 0 || head.x >= canvas.width / boxSize || head.y >= canvas.height / boxSize) {
        gameOver = true;
    }

    // Tabrakan dengan tubuh
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver = true;
        }
    }
}

// Menampilkan teks "Game Over" dan panjang ular
function drawGameOver() {
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    
    // Mengukur lebar teks untuk memusatkan teks
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

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Membersihkan canvas
    moveSnake();
    checkCollision();
    drawFood();
    drawSnake();
    setTimeout(gameLoop, 200); // Kecepatan permainan
}

// Reset permainan
function resetGame() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 1, y: 0 };
    food = { x: 5, y: 5 };
    snakeLength = 1;
    gameOver = false;
    placeFood();
    gameLoop();
}

// Kontrol dengan keyboard
document.addEventListener('keydown', (e) => {
    if (gameOver && e.key === 'Enter') {
        resetGame(); // Reload permainan
    }
    switch (e.key) {
        case 'ArrowUp':
        case 'w':
            if (direction.y === 0) direction = { x: 0, y: -1 }; // Atas
            break;
        case 'ArrowDown':
        case 's':
            if (direction.y === 0) direction = { x: 0, y: 1 }; // Bawah
            break;
        case 'ArrowLeft':
        case 'a':
            if (direction.x === 0) direction = { x: -1, y: 0 }; // Kiri
            break;
        case 'ArrowRight':
        case 'd':
            if (direction.x === 0) direction = { x: 1, y: 0 }; // Kanan
            break;
    }
});

// Kontrol tombol virtual
document.getElementById('up').addEventListener('click', () => direction = { x: 0, y: -1 });
document.getElementById('down').addEventListener('click', () => direction = { x: 0, y: 1 });
document.getElementById('left').addEventListener('click', () => direction = { x: -1, y: 0 });
document.getElementById('right').addEventListener('click', () => direction = { x: 1, y: 0 });

// Efek tombol virtual ditekan
const buttons = document.querySelectorAll('#controls button');
buttons.forEach(button => {
    button.addEventListener('mousedown', () => {
        button.style.backgroundColor = 'red'; // Warna saat ditekan
    });
    button.addEventListener('mouseup', () => {
        button.style.backgroundColor = '#555'; // Warna default
    });
    button.addEventListener('mouseleave', () => {
        button.style.backgroundColor = '#555'; // Warna default saat keluar
    });
});

// Memulai permainan
placeFood();
gameLoop();
