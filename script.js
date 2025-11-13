// TODO LIST
// Bot logic
// create gameStatus, fixed number of games, best of 3, add points after win, switch starting player after every game.

// Player factory
function createPlayer(name, isBot, symbol){ 
    return {name, isBot, symbol}
}

const gameState = ( function(){
    // count of rounds
    let round = 0;
    // count of games 
    let game = 0;
    // players score
    let score = [];
    // game history 
    let movesHistory = [];

    //movesHistory.push(
    //     {row, column, player:getActivePlayer()}
    //);
})

// Game Logic 
const gameFlow = (function gameLogic(){
    
    let players = []; 
    let activePlayer;


    const init = (player1, player2) =>{
        board.init();
        players = [player1, player2];
        setActivePlayer(player1);
    }

    const setActivePlayer = (player) => activePlayer = player;

    const getActivePlayer = () => activePlayer;

    const toggleActivePlayer = () => activePlayer = activePlayer === players[0] ? players[1]: players[0];

    const playRound = (row, column) => {
        let hasPlayed = board.setTile(row, column, getActivePlayer().symbol);
        let messageToDisplay;
        let winningTiles;
        if(hasPlayed){
            let checkForWinObject = board.checkForWin(row, column);
            switch (checkForWinObject.status){               
                case "win":
                    messageToDisplay = `${gameFlow.getActivePlayer().name} won!`;
                    // add 1 point to activePlayer.
                    winningTiles = checkForWinObject.winningTiles;
                    console.log("logic to stop current game");
                    break;
                case "tie":
                    messageToDisplay = `It's a tie!`;
                    console.log("logic to stop current game");
                    break;
                case "continue":
                    messageToDisplay = `${getActivePlayer().name} captured tile ${row}, ${column}`
                    toggleActivePlayer();
                    break;
            };
        } 
        return {messageToDisplay, winningTiles};
    }

    const winFlow = () => {

    }

    return {init, playRound, getActivePlayer}
})()

const board = ( function (){
    let board = [];
    const size = 3;

    const init = () => {
        for (let i = 0; i < size; i++){
            board[i] = [];
            for (let j = 0; j < size; j++){
                board[i][j] = null;
            }
        }
    }

    const getBoard = () => board;

    const setTile = (row, column, value) => {
    
        // Check if tile is already captured.
        if(board[row][column]!==null){
            return false;
        }
        board[row][column] = value;
        return true;
    }; 

    const checkForWin = (row, column) =>{
        
        if(checkWinOnRows(row).status){
            return checkWinOnRows(row);            
        }

        if(checkWinOnColumns(column).status){
            return checkWinOnColumns(column);
        }

        if(checkWinOnDiagonal(row, column).status){
            return checkWinOnDiagonal(row,column);
        }

        if(checkWinOnAntidiagonal(row, column).status){
            return checkWinOnAntidiagonal(row, column);
        }

        if(checkForTie().status){
            return checkForTie();
        };

        return {status:"continue", winningTiles: []};
    }

    const checkWinOnRows = (row) => {
        return {
            status: board[row].every(el => el === gameFlow.getActivePlayer().symbol)? "win" : false,
            winningTiles: `row-${row}`
        }
    }

    const checkWinOnColumns = (column) => {
        let columnSnapShot = [];
            for(let i = 0; i < board.length; i++){
                columnSnapShot.push(board[i][column]);
            }    
        return {
            status: columnSnapShot.every(el => el === gameFlow.getActivePlayer().symbol)? "win" : false,
            winningTiles: `column-${column}`
        }
    }

    const checkWinOnDiagonal = (row, column) => {
        let diagonalSnapShot = [];
        if(row === column){
            for(let i = 0; i < board.length; i++){
                diagonalSnapShot.push(board[i][i]);
            }
        }

        if(diagonalSnapShot.length === 0){
            return false;
        } else {
            return {
                status: diagonalSnapShot.every(el => el === gameFlow.getActivePlayer().symbol)? "win" : false,
                winningTiles: `diagonal`
            }
        }
    }

    const checkWinOnAntidiagonal = (row, column) => {
        let antidiagonalSnapShot = [];
        if(row + column === board.length - 1){
            for(let i = 0; i < board.length; i++){
                antidiagonalSnapShot.push(board[i][board.length - i - 1]);
            }
        }

        if(antidiagonalSnapShot.length === 0){
            return false;
        } else {
            return {
                status:antidiagonalSnapShot.every(el => el === gameFlow.getActivePlayer().symbol)? "win" : false,
                winningTiles: "antidiagonal"
            }
        }
    };

    const checkForTie = () => {
        let board1d = [];
        for (let i = 0; i < board.length; i++){
            board1d.push(...board[i]);
        }
        return {
            status: board1d.every(el => el !== null) ? "tie": false,
            winningTiles:[]
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

    function init(){
        startGameBtn.addEventListener("click", startGame);
        restartBtn.addEventListener("click", () => console.log("Restart game logic will be added later!"))
        gameBoard.addEventListener("click", clickOnTile);
    }

    function startGame() {
        // Capture inputs and create two players using the factory.
        const inputs = document.querySelectorAll("input");
        const player1 = createPlayer(inputs[0].value, inputs[1].checked, "O")
        const player2 = createPlayer(inputs[2].value, inputs[3].checked, "X")
        
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
    
        // Initialize game logic
        gameFlow.init(player1, player2);
    }

    const clickOnTile = (e) =>{
        if(e.target.tagName === "DIV"){
            return;
        };
        const str = e.target.classList.value;
        let [, row, column] = str.match(/row-(\d+)\s+column-(\d+)/);
        row = parseInt(row);
        column = parseInt(column);
        if(!e.target.classList.contains("clicked")){    
            changeTile(row,column,gameFlow.getActivePlayer());
            let roundObj = gameFlow.playRound(row,column);
            displayText(roundObj.messageToDisplay);
            styleWinningTiles(roundObj.winningTiles);
        }  
    } 

    const changeTile = (row,column,player) =>{
        gameBoard.querySelector(`.row-${row}.column-${column}`).classList.add(`symbol${player.symbol}`, "clicked")
    }

    const displayText = (text) => {
        gameDisplay.innerText = text;
    }

    const styleWinningTiles = (tileClass) => {
        if(!tileClass){
            return;
        } else {
            gameBoard.querySelectorAll(`.${tileClass}`).forEach(el => el.classList.add("winningTile"));
            gameBoard.removeEventListener("click", clickOnTile);
        }
    }
    

    return {init, changeTile, displayText, styleWinningTiles}
})()

document.addEventListener("DOMContentLoaded", userInterfaceController.init)

