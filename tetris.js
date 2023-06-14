document.addEventListener('DOMContentLoaded', () => {

    // Define canvas and block sizes 
    const canvas = document.getElementById('tetrisBoard');
    const ctx = canvas.getContext('2d');
    const blockSize = 30;
    const scoreElement = document.getElementById('score');
    canvas.width = 10 * blockSize;
    canvas.height = 20 * blockSize;

    let score = 0;

    // Define game board and Tetris piece shapes 
    const board = [];
    for (let i = 0; i < 20; i++) {
        board[i] = new Array(10).fill(0);
    } const shapes = [[[1, 1, 1], [0, 1, 0]], [[2, 2], [2, 2]], [[5, 5, 5, 5]], [[6, 6, 6], [0, 0, 6]], [[7, 7, 7], [7, 0, 0]]]; 
    //Removed s and z pieces for simplicity [[0, 3, 3], [3, 3, 0]], [[4, 4, 0], [0, 4, 4]], Re



    // Draw game board and Tetris piece functions 
    function drawBoard() {
        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 10; j++) {
                drawBlock(j, i, board[i][j]);
            }
        }
    }

    function drawPiece(piece, x, y) {
        piece.forEach((row, i) => {
            row.forEach((block, j) => {
                if (block) {
                    drawBlock(x + j, y + i, block);
                }
            });
        });
    }

    function drawBlock(x, y, type) {
        const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFFFFF'];
        ctx.fillStyle = colors[type];
        ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
        ctx.strokeRect(x * blockSize, y * blockSize, blockSize, blockSize);
    }

    // Move and rotate Tetris piece functions 
    function movePieceDown() {
        currentPieceY++;
        if (pieceCollides()) {
            currentPieceY--;
            addPieceToBoard();
            removeCompletedRows();
            newPiece();
        }
    }

    function rotatePiece() {
        const rotatedPiece = [];
        for (let i = 0;
            i < currentPiece[0].length;
            i++) {
            const newRow = [];
            for (let j = currentPiece.length - 1;
                j >= 0;
                j--) {
                newRow.push(currentPiece[j][i]);
            } rotatedPiece.push(newRow);
        } if (!pieceCollides(rotatedPiece)) {
            currentPiece = rotatedPiece;
        }
    }


    // Handle user input function 
    document.addEventListener('keydown', event => {
        if (event.keyCode === 37) {

            //left arrow 
            currentPieceX--;
            if (pieceCollides()) {
                currentPieceX++;
            }
        } else if (event.keyCode === 39) {

            //right arrow 
            currentPieceX++;
            if (pieceCollides()) {
                currentPieceX--;
            }
        } else if (event.keyCode === 40) {
            //down arrow 
            movePieceDown();

        } else if (event.keyCode === 38) {
            // up arrow 
            rotatePiece();
        }
        redraw();
    });



    // Add new Tetris piece to board function 
    function addPieceToBoard() {
        currentPiece.forEach((row, i) => {
            row.forEach((block, j) => {
                if (block) {
                    board[currentPieceY + i][currentPieceX + j] = block;
                }
            });
        });
    }


    // Remove completed rows function 
    function removeCompletedRows() {
        let completedRows = 0;
        for (let i = 0; i < 20; i++) {
            if (board[i].every(block => block !== 0)) {
                board.splice(i, 1);
                board.unshift(new Array(10).fill(0));
                completedRows++;
            }
        }

        // update the score
        score += completedRows * 100 + (Math.max(completedRows, 1) - 1) * 50;
        scoreElement.textContent = score;
    }


    // Game loop function 
    function gameLoop() {
        redraw();
        movePieceDown();
        setTimeout(gameLoop, 750);
    }

    function redraw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBoard();
        drawPiece(currentPiece, currentPieceX, currentPieceY);
    }

    // Start game loop and new piece function 
    function newPiece() {
        currentPiece = shapes[Math.floor(Math.random() * shapes.length)];
        currentPieceX = 3;
        currentPieceY = 0;
        if (pieceCollides()) {
            gameOver();
        }
    }

    function gameOver() {
        const playerName = prompt('Game over! Enter your name:');
        const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
        highScores.push({ name: playerName, score: score });
        localStorage.setItem('highScores', JSON.stringify(highScores));
        alert('Score saved!');
        location.reload();
    }

    function pieceCollides(piece = currentPiece, x = currentPieceX, y = currentPieceY) {
        return piece.some((row, i) => {
            return row.some((block, j) => {
                if (block && (y + i >= 20 || x + j < 0 || x + j >= 10 || board[y + i][x + j])) {
                    return true;
                }
            });
        });
    }

    let currentPiece, currentPieceX, currentPieceY;

    newPiece();
    gameLoop();

});