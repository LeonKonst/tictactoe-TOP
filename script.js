const startGameBtn = document.querySelector(".start-game-btn");

startGameBtn.addEventListener("click",()=>{
    console.log("test")
    }  
)
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

    //This will be removed
    const printBoardOnConsole = () => {
        for (let i = 0; i < columns; i++){
            console.log("------------")
            for (let j = 0; j < rows; j++){
                console.log(board[i][j].getPlayerOccupiedTile() + "|");
            }
        }
    }

    return {board, columns, rows, printBoardOnConsole};
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

function createPlayer(name, number, isBot, symbol){

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

    return {name, number, occupyTile}
}

//THis will change. The values will come from the dom!
const   Player1 = createPlayer("Kostas", 1, false, "A");
const Player2 = createPlayer("Tsipras", -1, true, "B");

const gameFlow = (function(){
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
            board.printBoardOnConsole();
            checkForAWinner(column, row, activePlayer);
            activePlayer = activePlayer === Player2 ? Player1 : Player2;
            round++;
        }
    }

    const checkForAWinner = (column, row, player) => {     
        if (Math.abs(winningTriplets.rows[row]) === 3 ||
        Math.abs(winningTriplets.columns[column]) === 3 ||
        Math.abs(winningTriplets.diagonal) === 3 ||
        Math.abs(winningTriplets.antidiagonal) === 3) {
            console.log(`${player.name} wins!`);
        }
    }

    const restartGame = () => {
        board = createGameBoard();
    }


    return {playARound}
})()