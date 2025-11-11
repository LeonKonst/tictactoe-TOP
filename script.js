const startGameBtn = document.querySelector(".start-game-btn");
const restartBtn = document.querySelector(".restart-btn");
const settingsMenu = document.querySelector(".settings-form")
const gameBoard = document.querySelector(".gameboard-container");
const main = document.querySelector("main");
const header = document.querySelector("header")
let Player1;
let Player2;
let gameLogic;


startGameBtn.addEventListener("click", () => {
    const inputs = document.querySelectorAll("input");
    let values = {
        playerOneName: inputs[0].value,
        isPlayerOneABot: inputs[1].checked,
        playerTwoName: inputs[2].value,
        isPlayerTwoABot: inputs[3].checked,
    };
    Player1 = createPlayer(values.playerOneName, 1, values.isPlayerOneABot, "O");
    Player2 = createPlayer(values.playerTwoName, -1, values.isPlayerTwoABot, "X");
    gameLogic = GameFlow(Player1, Player2);
    header.classList.add("with-button");
    restartBtn.classList.add("show");
    settingsMenu.style.display = "none";
    gameBoard.style.display = "grid";
});

restartBtn.addEventListener("click", () => {
    settingsMenu.style.display = "block";
    gameBoard.style.display = "none";
    restartBtn.classList.remove("show");
    header.classList.remove("with-button");
})


gameBoard.addEventListener("click", (e) =>{
    if(e.target.tagName === "DIV"){
        return;
    };
    const str = e.target.classList.value;
    let [, row, column] = str.match(/row-(\d+)\s+column-(\d+)/);
    row = parseInt(row);
    column = parseInt(column);
    gameLogic.playARound(column, row);
    board.changeBoard(column,row);   
})

// IIFE creating the board. 
const board = (function createGameBoard (){
    let board = [];
    const columns = 3;
    const rows = 3;

    for (let i = 0; i < columns; i++){
        board[i] = [];
        for (let j = 0; j < rows; j++){
            board[i][j] = createBoardTile(i, j, 0);
        }
    }

    const printBoard = () => {
        for (let i = 0; i < columns; i++){
            console.log("------------")
            for (let j = 0; j < rows; j++){
                console.log(board[i][j].getPlayerOccupiedTile() + "|");
            }
        }
    }

    const changeBoard = (column, row) => {
        let nextActivePlayer = gameLogic.getActivePlayer();
        let changedBtn = document.querySelector(`.row-${row}.column-${column}`);
        changedBtn.classList.add(`disabled`,`number${nextActivePlayer.number}`) 
    }

    return {board, columns, rows, changeBoard, printBoard};
})()

function createBoardTile (column, row, player){
    let playerOccupiedTile = player;

    // This function will be used to occupy the tile by a player
    const setPlayerOccupiedTile = (player) => {
        playerOccupiedTile = player;
    }

    // This function will be used to render the right player for each tile
    const getPlayerOccupiedTile = () => {
        return playerOccupiedTile;
    }

    // This function will be used to disable the tiles to be clicked again 
    const isTileOccupied = () => {
        return playerOccupiedTile !== 0;
    }

    return {column, row, getPlayerOccupiedTile, setPlayerOccupiedTile, isTileOccupied}
}

function createPlayer(name, number, isBot, symbol, isActive){

    console.log(`${name} is player number ${number} and ${isBot?"a bot":"a human"} who uses the symbol ${symbol}`);

    const occupyTile = (column, row) => {
        // This will be removed and changed to disable the button
        if(board.board[column][row].isTileOccupied()){
            console.log(`Tile is occupied from symbol ${board.board[column][row].getPlayerOccupiedTile()}. Try another one!`);
            return false;
        }
        board.board[parseInt(column)][parseInt(row)].setPlayerOccupiedTile(number);
        return true;
    }

    return {name, number, isActive, occupyTile}
}

function GameFlow (Player1, Player2){
    let round = 0;
    let activePlayer = Player1;
    let winningTriplets = {
        rows: [0, 0, 0],
        columns: [0, 0, 0],
        diagonal: 0,
        antidiagonal: 0
    }

    const playARound = (column, row) => {
        let hasPlayedRound = activePlayer.occupyTile(column,row);
        if(hasPlayedRound){
            console.log(activePlayer.name + " occupied tile " + column + ", " + row)
            
            let point = activePlayer.number;
            winningTriplets.rows[row] += point;
            winningTriplets.columns[column] += point;
            if (row === column){
                winningTriplets.diagonal += point;
            } 
            if (row + column === 2){
                winningTriplets.antidiagonal += point;
            }
            checkForAWinner(column, row, activePlayer);
            activePlayer = activePlayer === Player2 ? Player1 : Player2;
            round++;
        }
    }

    const getActivePlayer = () => activePlayer;

    const checkForAWinner = (column, row, player) => {     
        if (Math.abs(winningTriplets.rows[row]) === 3 ||
        Math.abs(winningTriplets.columns[column]) === 3 ||
        Math.abs(winningTriplets.diagonal) === 3 ||
        Math.abs(winningTriplets.antidiagonal) === 3) {
            console.log(`${player.name} wins!`);

            //TODO add end game logic
        }
    }

    // const restartGame = () => {
    //     board = createGameBoard();
    // }

    return {getActivePlayer, playARound}
}