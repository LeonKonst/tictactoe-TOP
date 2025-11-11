// Player factory
function createPlayer(name, isBot, symbol){ 
    return {name, isBot, symbol}
}

const userInterfaceController = ( function(){
    const startGameBtn = document.querySelector(".start-game-btn");
    const settingsMenu = document.querySelector(".settings-form");
    const gameContainer = document.querySelector(".game-container");

    function init(){
        startGameBtn.addEventListener("click", startGame);
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

    
    }

    return {init}
})()


document.addEventListener("DOMContentLoaded", userInterfaceController.init)





    // const occupyTile = (column, row) => {
    //     // This will be removed and changed to disable the button
    //     if(board.board[column][row].isTileOccupied()){
    //         gameDisplay.innerText = `Tile is occupied from symbol ${board.board[column][row].getPlayerOccupiedTile()}. Try another one!`;
    //         return false;
    //     }
    //     board.board[parseInt(column)][parseInt(row)].setPlayerOccupiedTile(symbol);
    //     return true;







// 
// const restartBtn = document.querySelector(".restart-btn");
// 
// const gameBoard = document.querySelector(".gameboard-container");
// 
// const gameDisplay = document.querySelector(".display-container");
// const main = document.querySelector("main");
// const header = document.querySelector("header")
// let Player1;
// let Player2;
// let gameLogic;


// startGameBtn.addEventListener("click", () => {
//     

//     const cards = document.querySelector(".players-cards");
//     console.log(cards)
//     Player1 = createPlayer(values.playerOneName, 1, values.isPlayerOneABot, "O");
//     Player2 = createPlayer(values.playerTwoName, -1, values.isPlayerTwoABot, "X");
//     gameLogic = GameFlow(Player1, Player2);
//     header.classList.add("with-button");
//     restartBtn.classList.add("show");
//     settingsMenu.style.display = "none";
//     gameContainer.style.display = "flex";
// });

// restartBtn.addEventListener("click", () => {
//     settingsMenu.style.display = "block";
//     gameContainer.style.display = "none";
//     restartBtn.classList.remove("show");
//     header.classList.remove("with-button");
// })


// gameBoard.addEventListener("click", (e) =>{
//     if(e.target.tagName === "DIV"){
//         return;
//     };
//     const str = e.target.classList.value;
//     let [, row, column] = str.match(/row-(\d+)\s+column-(\d+)/);
//     row = parseInt(row);
//     column = parseInt(column);
//     gameLogic.playARound(column, row);
     
// })

// // IIFE creating the board. 
// const board = (function createGameBoard (){
//     let board = [];
//     const columns = 3;
//     const rows = 3;

//     for (let i = 0; i < columns; i++){
//         board[i] = [];
//         for (let j = 0; j < rows; j++){
//             board[i][j] = createBoardTile(i, j, 0);
//         }
//     }

//     const changeBoard = (column, row) => {
//         let nextActivePlayer = gameLogic.getActivePlayer();
//         let changedBtn = document.querySelector(`.row-${row}.column-${column}`);
//         changedBtn.classList.add(`disabled`,`number${nextActivePlayer.number}`) 
//     }

//     return {board, columns, rows, changeBoard};
// })()

// function createBoardTile (column, row, player){
//     let playerOccupiedTile = player;

//     // This function will be used to occupy the tile by a player
//     const setPlayerOccupiedTile = (player) => {
//         playerOccupiedTile = player;
//     }

//     // This function will be used to render the right player for each tile
//     const getPlayerOccupiedTile = () => {
//         return playerOccupiedTile;
//     }

//     // This function will be used to disable the tiles to be clicked again 
//     const isTileOccupied = () => {
//         return playerOccupiedTile !== 0;
//     }

//     return {column, row, getPlayerOccupiedTile, setPlayerOccupiedTile, isTileOccupied}
// }



// function GameFlow (Player1, Player2){
//     let round = 0;
//     let activePlayer = Player1;
//     let winningTriplets = {
//         rows: [0, 0, 0],
//         columns: [0, 0, 0],
//         diagonal: 0,
//         antidiagonal: 0
//     }

//     const playARound = (column, row) => {
//         let hasPlayedRound = activePlayer.occupyTile(column,row);
//         if(hasPlayedRound){
//             board.changeBoard(column,row);  
//             gameDisplay.innerText = `${activePlayer.name} occupied tile ${row}, ${column}`
            
//             let point = activePlayer.number;
//             winningTriplets.rows[row] += point;
//             winningTriplets.columns[column] += point;
//             if (row === column){
//                 winningTriplets.diagonal += point;
//             } 
//             if (row + column === 2){
//                 winningTriplets.antidiagonal += point;
//             }
//             checkForAEnd(column, row, activePlayer);
//             activePlayer = activePlayer === Player2 ? Player1 : Player2;
//             round++;
//         }
//     }

//     const getActivePlayer = () => activePlayer;

//     const checkForAEnd = (column, row, player) => { 
            
//         // Check if someone is winning
        
//         let isTie = round === 8;
//         if(isTie){
//             gameDisplay.innerText =`It's a Tie!`;
//         }
//         let isThereAWinner = checkForAWinner(column, row, player);

//     }


//     const checkForAWinner = (column, row, player) => {
//         if(round < 5){
//             return;
//         } 
//         if (Math.abs(winningTriplets.rows[row]) === 3 ||
//         Math.abs(winningTriplets.columns[column]) === 3 ||
//         Math.abs(winningTriplets.diagonal) === 3 ||
//         Math.abs(winningTriplets.antidiagonal) === 3) {
//             gameDisplay.innerText =`${player.name} wins!`;
//             return true;
//         }
//     }

//     // TODO restart game Logic
//     // const restartGame = () => {
//     //     board = createGameBoard();
//     // }

//     return {getActivePlayer, playARound}
// }


// //TODO bot playing logic