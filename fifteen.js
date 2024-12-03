window.addEventListener('DOMContentLoaded', (event) => {
    const container = document.getElementById('puzzle-container');
    const emptySpace = { x: 3, y: 3 }; // Bottom right corner as the empty space
    let tiles = [];

    function isMovable(tile) {
        const x = parseInt(tile.style.left, 10) / 100;
        const y = parseInt(tile.style.top, 10) / 100;
        return (x === emptySpace.x && Math.abs(y - emptySpace.y) === 1) ||
               (y === emptySpace.y && Math.abs(x - emptySpace.x) === 1);
    }

    function updateMovableTiles() {
        tiles.forEach(tile => {
            if (isMovable(tile)) {
                tile.classList.add('movablepiece');
            } else {
                tile.classList.remove('movablepiece');
            }
        });
    }

    function moveTile(tile) {
        const x = parseInt(tile.style.left, 10) / 100;
        const y = parseInt(tile.style.top, 10) / 100;

        if (isMovable(tile)) {
            tile.style.top = `${emptySpace.y * 100}px`;
            tile.style.left = `${emptySpace.x * 100}px`;
            emptySpace.x = x;
            emptySpace.y = y;
            updateMovableTiles();

            // Check if the game has been won after this move
            if (checkWin()) {
                showWinningNotification();
            }
        }
    }

    function shuffleTiles() {
        for (let i = 0; i < 300; i++) {
            const movableTiles = tiles.filter(tile => isMovable(tile));
            if (movableTiles.length === 0) {
                continue;
            }
            const randomIndex = Math.floor(Math.random() * movableTiles.length);
            const randomTile = movableTiles[randomIndex];
            moveTile(randomTile);
        }
        updateMovableTiles(); // Update movable tiles after shuffling
        if (checkWin()) { // If in a rare case the shuffle results in a win, shuffle again
            shuffleTiles();
        }
    }

    function checkWin() {
        for (let i = 0; i < tiles.length; i++) {
            const tile = tiles[i];
            const x = parseInt(tile.style.left, 10) / 100;
            const y = parseInt(tile.style.top, 10) / 100;
            if (x !== (i % 4) || y !== Math.floor(i / 4)) {
                return false; // The tile is not in its correct position
            }
        }
        return true; // All tiles are in correct positions
    }

    function showWinningNotification() {
        const winningMessage = document.createElement('div');
        winningMessage.textContent = 'Congratulations! You solved the puzzle!';
        winningMessage.className = 'winning-message';
        container.appendChild(winningMessage);
    }

    // Initialize the board
    for (let i = 0; i < 15; i++) {
        const tile = document.createElement('div');
        tile.id = 'tile' + (i + 1);
        tile.classList.add('tile');
        tile.textContent = (i + 1).toString();
        tile.style.left = `${(i % 4) * 100}px`;
        tile.style.top = `${Math.floor(i / 4) * 100}px`;
        tile.style.backgroundImage = 'url(background.jpg)';
        tile.style.backgroundPosition = `-${(i % 4) * 100}px -${Math.floor(i / 4) * 100}px`;
        tile.addEventListener('click', () => moveTile(tile));
        tile.addEventListener('mouseenter', () => {
            if (isMovable(tile)) {
                tile.classList.add('movablepiece');
            }
        });
        tile.addEventListener('mouseleave', () => {
            tile.classList.remove('movablepiece');
        });
        tiles.push(tile);
        container.appendChild(tile);
    }

    // Add the empty tile for visual completeness (optional)
    const emptyTile = document.createElement('div');
    emptyTile.id = 'tile16';
    emptyTile.classList.add('tile');
    emptyTile.style.left = `${emptySpace.x * 100}px`;
    emptyTile.style.top = `${emptySpace.y * 100}px`;
    emptyTile.style.pointerEvents = 'none'; 
    container.appendChild(emptyTile);

    // Set up the shuffle button
    const shuffleButton = document.getElementById('shuffle-button');
    shuffleButton.addEventListener('click', () => {
        shuffleTiles();
        updateMovableTiles(); // Update movable tiles after shuffling
    });

    // Initial update of movable tiles
    updateMovableTiles(); 
});

