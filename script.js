// TODO LIST
// After Winning game Logic
// Tie logic
// Bot logic

// Player factory
function createPlayer(name, isBot, symbol){ 
    return {name, isBot, symbol}
}

// Game Logic 
const gameFlow = (function gameLogic(){
    let movesHistory = [];
    let players = []; 
    let activePlayer;
    // count of rounds
    let round = 0;
    // count of games 
    let game = 0;

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
        if(hasPlayed){
            userInterfaceController.changeTile(row,column,getActivePlayer());
            movesHistory.push(
                {row, column, player:getActivePlayer()}
            );
            userInterfaceController.displayText(
                `${getActivePlayer().name} captured tile ${row}, ${column}`
            );
            board.checkForWin(row, column);
            toggleActivePlayer();
        } else {
            userInterfaceController.displayText(
                "Tile is already captured!"
            );
        }
    }

    return {init, playRound, getActivePlayer, movesHistory}
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
        if(checkWinOnRows(row)
            ||checkWinOnColumns(column)
            ||checkWinOnDiagonal(row, column)
            ||checkWinOnAntidiagonal(row, column)
        ){
            userInterfaceController.displayText(
                `${gameFlow.getActivePlayer().name} won!`
            );

            // TODO stop game after win logic
        }
    }

    const checkWinOnRows = (row) => {
        return board[row].every(el => el === gameFlow.getActivePlayer().symbol);
    }

    const checkWinOnColumns = (column) => {
        let columnSnapShot = [];
            for(let i = 0; i < board.length; i++){
                columnSnapShot.push(board[i][column]);
            }    
        return columnSnapShot.every(el => el === gameFlow.getActivePlayer().symbol);
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
            return diagonalSnapShot.every(el => el === gameFlow.getActivePlayer().symbol);
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
            return antidiagonalSnapShot.every(el => el === gameFlow.getActivePlayer().symbol);
        }
    };

    
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
        gameFlow.playRound(row,column);
    } 

    const changeTile = (row,column,player) =>{
        gameBoard.querySelector(`.row-${row}.column-${column}`).classList.add(`symbol${player.symbol}`, "disabled")
    }

    const displayText = (text) => {
        gameDisplay.innerText = text;
    }
    

    return {init, changeTile, displayText}
})()

document.addEventListener("DOMContentLoaded", userInterfaceController.init)

