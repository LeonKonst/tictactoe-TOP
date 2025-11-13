// TODO LIST

// create gameStatus, fixed number of games, best of 3, add points after win, switch starting player after every game.

// Player factory
function createPlayer(name, isBot, symbol) {


    // Bot logic was COMPLETELY WRITTEN BY CHATGPT. 
    // 
    const botChooseTile = (boardCopy) => {
        if (!isBot) return null; // only for bots

        const opponentSymbol = symbol === "X" ? "O" : "X";

        // Check if the board is empty -> take center or a corner
        if (boardCopy.flat().every(el => el === null)) {
            return [1, 1]; // take center
        }

        // Minimax algorithm
        const minimax = (boardCopy, depth, isMaximizing) => {
            const winner = checkWinner(boardCopy);
            if (winner === symbol) return 10 - depth;
            if (winner === opponentSymbol) return depth - 10;
            if (boardCopy.flat().every(el => el !== null)) return 0; // tie

            if (isMaximizing) {
                let bestScore = -Infinity;
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        if (!boardCopy[i][j]) {
                            boardCopy[i][j] = symbol;
                            const score = minimax(boardCopy, depth + 1, false);
                            boardCopy[i][j] = null;
                            bestScore = Math.max(score, bestScore);
                        }
                    }
                }
                return bestScore;
            } else {
                let bestScore = Infinity;
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        if (!boardCopy[i][j]) {
                            boardCopy[i][j] = opponentSymbol;
                            const score = minimax(boardCopy, depth + 1, true);
                            boardCopy[i][j] = null;
                            bestScore = Math.min(score, bestScore);
                        }
                    }
                }
                return bestScore;
            }
        };

        let bestMove;
        let bestScore = -Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (!boardCopy[i][j]) {
                    boardCopy[i][j] = symbol;
                    const score = minimax(boardCopy, 0, false);
                    boardCopy[i][j] = null;
                    if (score > bestScore) {
                        bestScore = score;
                        bestMove = [i, j];
                    }
                }
            }
        }

        return bestMove;
    };

    // Helper to evaluate board for a winner
    const checkWinner = (b) => {
        // rows & columns
        for (let i = 0; i < 3; i++) {
            if (b[i][0] && b[i][0] === b[i][1] && b[i][1] === b[i][2]) return b[i][0];
            if (b[0][i] && b[0][i] === b[1][i] && b[1][i] === b[2][i]) return b[0][i];
        }
        // diagonals
        if (b[0][0] && b[0][0] === b[1][1] && b[1][1] === b[2][2]) return b[0][0];
        if (b[0][2] && b[0][2] === b[1][1] && b[1][1] === b[2][0]) return b[0][2];
        return null;
    };

    return { name, isBot, symbol, botChooseTile };
}

const gameState = (function(){
    // count of rounds
    let round;
    // count of games 
    let game;
    // players score
    let score = [];
    // game history 
    let movesHistory = [];

    const init = () => {
        // count of rounds
        round = 0;
        // count of games 
        game = 0;
        // players score
        score = [0, 0];
        // game history 
        movesHistory = [];
    }

    const getMovesHistory = () => movesHistory;

    const pushToMovesHistory = (row, column, player, status) => {
        movesHistory.push({row, column, player, status});
    }

    return {init, getMovesHistory, pushToMovesHistory}
})()

// Game Logic 
const gameController = (function gameLogic(){
    
    let players = []; 
    let activePlayer;

    const init = (player1, player2) =>{
        board.init();
        players = [player1, player2];
        setActivePlayer(player2);
        roundHandler("continue");
    }

    const setActivePlayer = (player) => activePlayer = player;

    const getActivePlayer = () => activePlayer;

    const toggleActivePlayer = () => activePlayer = activePlayer === players[0] ? players[1]: players[0];

    const roundHandler = (status) => {
        let messageToDisplay;
        switch (status){
            case "continue":
                toggleActivePlayer();
                if(getActivePlayer().isBot){
                    let [row, column] = getActivePlayer().botChooseTile(board.getBoard(), getActivePlayer().symbol);
                    let roundObj = playRound(row,column);
                    messageToDisplay = `${getActivePlayer().name} captured tile ${row}, ${column}!`;
                    userInterfaceController.styleWinningTiles(roundObj.winningTiles);
                    roundHandler(roundObj.status);
                }
                break;
            case "win":
                messageToDisplay = `${getActivePlayer().name} won!`;
                // add 1 point to activePlayer.
                break;
            case "tie":
                messageToDisplay = `It's a tie!`;
                break;
        }
        if (messageToDisplay) userInterfaceController.updateDisplay(messageToDisplay);
         
    }

    const onTileClick = (row, column) => {
        if(!getActivePlayer().isBot){    
            let roundObj = playRound(row,column);
            roundHandler(roundObj.status);
            // updateDisplay(roundObj.messageToDisplay);
            userInterfaceController.styleWinningTiles(roundObj.winningTiles);
        } 
    }

    const playRound = (row, column) => {
        let hasPlayed = board.setTile(row, column, getActivePlayer().symbol);
        let roundObj;
        if(hasPlayed){
            roundObj = board.checkForWin(row, column, getActivePlayer().symbol);
            gameState.pushToMovesHistory(row, column, getActivePlayer(),roundObj.status);
            userInterfaceController.changeTile(row,column,getActivePlayer());  
            return roundObj;        
        } else {
            return { status: "continue", winningTiles: "" };
        }
        
    }

    return {init, roundHandler, onTileClick, playRound, getActivePlayer}
})()

const board = ( function (){
    let board = [];
    const size = 3;

    const init = () => {
        board = Array.from({ length: size }, () => Array(size).fill(null));
    };

    const getBoard = () => board.map(row => [...row]);

    const setTile = (row, column, value) => {
    
        // Check if tile is already captured.
        if(board[row][column]!==null){
            return false;
        }
        board[row][column] = value;
        return true;
    }; 

    const checkForWin = (row, column, symbol) =>{
        
        const rowCheck = checkWinOnRows(row, symbol);
        if(rowCheck.status){
            return rowCheck;            
        }
        
        const columnCheck = checkWinOnColumns(column, symbol);
        if(columnCheck.status){
            return columnCheck;
        }


        const diagonalCheck = checkWinOnDiagonal(row, column, symbol);
        if(diagonalCheck.status){
            return diagonalCheck;
        }

        const antidiagonalCheck = checkWinOnAntidiagonal(row, column, symbol);
        if(antidiagonalCheck.status){
            return antidiagonalCheck;
        }

        if(checkForTie().status){
            return checkForTie();
        };

        return {status:"continue", winningTiles: ""};
    }

    const checkWinOnRows = (row, symbol) => {
        return {
            status: board[row].every(el => el === symbol)? "win" : false,
            winningTiles: `row-${row}`
        }
    }

    const checkWinOnColumns = (column, symbol) => {
        let columnSnapShot = [];
            for(let i = 0; i < board.length; i++){
                columnSnapShot.push(board[i][column]);
            }    
        return {
            status: columnSnapShot.every(el => el === symbol)? "win" : false,
            winningTiles: `column-${column}`
        }
    }

    const checkWinOnDiagonal = (row, column, symbol) => {
        let diagonalSnapShot = [];
        if(row === column){
            for(let i = 0; i < board.length; i++){
                diagonalSnapShot.push(board[i][i]);
            }
        }

        if(diagonalSnapShot.length === 0){
            return {status: false, winningTiles: ""};
        } else {
            return {
                status: diagonalSnapShot.every(el => el === symbol)? "win" : false,
                winningTiles: `diagonal`
            }
        }
    }

    const checkWinOnAntidiagonal = (row, column, symbol) => {
        let antidiagonalSnapShot = [];
        if(row + column === board.length - 1){
            for(let i = 0; i < board.length; i++){
                antidiagonalSnapShot.push(board[i][board.length - i - 1]);
            }
        }

        if(antidiagonalSnapShot.length === 0){
            return {status: false, winningTiles: ""};
        } else {
            return {
                status:antidiagonalSnapShot.every(el => el === symbol)? "win" : false,
                winningTiles: "antidiagonal"
            }
        }
    };

    const checkForTie = () => {
        const isTie = board.flat().every(el => el !== null);
        return {
            status: isTie ? "tie" : false,
            winningTiles: "clicked",
        }
    }

    
    return {init, getBoard, setTile, checkForWin};
})()


// UI controller logic
const userInterfaceController = ( function(){
    const startGameBtn = document.querySelector(".start-game-btn");
    const settingsMenu = document.querySelector(".settings-form");
    const gameContainer = document.querySelector(".game-container");
    const restartBtn = document.querySelector(".restart-btn");
    const cards = document.querySelector(".players-cards");
    const gameBoard = document.querySelector(".gameboard-container");
    const gameDisplay = document.querySelector(".display-container");

    const init = () => {
        startGameBtn.addEventListener("click", startGame);
        restartBtn.addEventListener("click", restartGame)
        gameBoard.addEventListener("click", clickOnTile);
    }

    const restartGame = () =>{
        init();
        switchToSettingsInterface();
        board.init();
        gameBoard.querySelectorAll("button").forEach(el =>el.classList.remove("winning-tile", "clicked","symbolO", "symbolX"));
        updateDisplay("");
    }


    function startGame() {
        // Capture inputs and create two players using the factory.
        const inputs = document.querySelectorAll("input");
        const player1 = createPlayer(inputs[0].value, inputs[1].checked, "O")
        const player2 = createPlayer(inputs[2].value, inputs[3].checked, "X")
        
        switchToGameInterface(player1, player2);

        // Initialize game logic
        gameController.init(player1, player2);
    }

    const clickOnTile = (e) =>{
        const tile = e.target;
        if(tile.tagName === "DIV" || tile.classList.contains("clicked") ){
            return;
        };

        const str = tile.classList.value;
        let [, row, column] = str.match(/row-(\d+)\s+column-(\d+)/);
        row = parseInt(row);
        column = parseInt(column);
        updateDisplay(`${gameController.getActivePlayer().name} captured tile ${row}, ${column}!`);
        gameController.onTileClick(row, column) 
    } 

    const switchToSettingsInterface = () => {
        // Display settings menu from UI
        settingsMenu.style.display = "grid";

        // Remove tic tac toe board
        gameContainer.style.display = "none";

        // Remove restart button on header
        restartBtn.style.display = "none";        
    }

    const switchToGameInterface = (player1, player2) => {
        // Remove settings menu from UI
        settingsMenu.style.display = "none";

        // Display tic tac toe board
        gameContainer.style.display = "flex";

        // Display restart button on header
        restartBtn.style.display = "grid";

        // Populate player's cards
        cards.querySelector(".card-name.player-one").textContent = player1.name;
        cards.querySelector(".card-symbol.player-one").textContent = player1.symbol;
        cards.querySelector(".card-bot.player-one").textContent = player1.isBot? "Bot":"Human";

        cards.querySelector(".card-name.player-two").textContent = player2.name;
        cards.querySelector(".card-symbol.player-two").textContent = player2.symbol;
        cards.querySelector(".card-bot.player-two").textContent = player2.isBot? "Bot":"Human";
    
    }

    const changeTile = (row,column,player) =>{
        gameBoard.querySelector(`.row-${row}.column-${column}`).classList.add(`symbol${player.symbol}`, "clicked")
    }

    const updateDisplay = (text) => {
        gameDisplay.innerText = text;
    }

    const styleWinningTiles = (tileClass) => {
        if(!tileClass){
            return;
        } else {
            gameBoard.querySelectorAll(`.${tileClass}`).forEach(el => el.classList.add("winning-tile"));
            disableBoard();
        }
    }

    const disableBoard = () => gameBoard.removeEventListener("click", clickOnTile);
    

    return {init, updateDisplay, changeTile, styleWinningTiles, disableBoard}
})()

document.addEventListener("DOMContentLoaded", userInterfaceController.init)

