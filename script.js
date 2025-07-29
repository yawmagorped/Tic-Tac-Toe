const Dimensions = (() => {
    const columns = 3;
    const rows = 3;
    return {columns, rows};
})();

function gameBoard() {
    let board = [];

    for (let i = 0; i < Dimensions.rows; i++) {
        board[i] = [];
        for (let j = 0; j < Dimensions.columns; j++) {
            board[i].push(cell());
        }
    }
    const getBoard = () => board;
    const selectCell = (row, column) => board[row][column];

    return {getBoard, selectCell};
}

function cell() {
    let value = 0;
    
    const isCellEmpty = () => {
        return value == 0 ? true : false;
    }

    const markCell = (newValue) => {
        value = newValue;
    }

    const getValue = () => value;

    return {isCellEmpty, markCell, getValue}
}

function player(name, t, mark) {
    let playerName = name;
    let token = t;
    let playerMark = mark;
    return {playerName, token, playerMark};
}

function gameController() {
    let firstPlayer = player("First player", 1, "X");
    let secondPlayer = player("Second player", 2, "O");  
    
    let gameboard = gameBoard();
    let board = gameboard.getBoard();
    let isGameOver = false;
    const isThisGameOver = () => isGameOver;

    let activePlayer = firstPlayer;
    const getActivePlayer = () => activePlayer;

    const switchActivePlayer = () => {
        activePlayer = activePlayer === firstPlayer ? secondPlayer : firstPlayer;
    }
    const playNewRound = (row, column) => {
        if(!isGameOver) {
            selectedCell = gameboard.selectCell(row, column);
            
            if(!selectedCell.isCellEmpty())
                return false;
    
            selectedCell.markCell(activePlayer.token);
            if(checkLogic())
                isGameOver = true;
            switchActivePlayer();
            //printBoard();
            return true;
        } else return false;
    }

    // const printBoard = () => {
    //     console.log(`Board\n`);
    //     for (let i = 0; i < Dimensions.rows; i++) {
    //         for (let j = 0; j < Dimensions.columns; j++) {
    //             console.log(`${board[i][j].getValue()}`);
    //         }
    //         console.log("\n");
    //     }
    // }

    const checkLogic = () => {
        let counter = 0;
        for (let i = 0; i < Dimensions.rows; i++) {
            for (let j = 1; j < Dimensions.columns; j++) {
                if (!(board[i][j].isCellEmpty()) && board[i][j].getValue() == board[i][j-1].getValue())
                    counter++;
            }
            if (counter == 2)
                return true;
            else 
                counter = 0;
        }
        for (let i = 0; i < Dimensions.rows; i++) {
            let counter = 0;
            for (let j = 1; j < Dimensions.columns; j++) {
                if (!(board[j][i].isCellEmpty()) && board[j][i].getValue() == board[j-1][i].getValue())
                    counter++;
            }
            if (counter == 2)
                return true;
            else 
                counter = 0;
        }
        if( (!(board[0][0].isCellEmpty()) && board[0][0].getValue() == board[1][1].getValue() && board[1][1].getValue() == board[2][2].getValue() ) 
            || (!(board[2][0].isCellEmpty()) && board[2][0].getValue() == board[1][1].getValue() && board[1][1].getValue() == board[0][2].getValue()))
            return true;

        return false;
    }

    return {playNewRound, isThisGameOver, getActivePlayer};
}



let game;
let buttons = document.querySelectorAll(".board-container button");
let resetbutton = document.querySelector(".body-container > button");
let playerNameTxt = document.querySelector(".top > :first-child");
let winTxt = document.querySelector(".top > :last-child");
let activePlayer;

let boardContainer = document.querySelector(".board-container")

resetbutton.addEventListener('click', initializeGame);
let screenCntrl = screenController();

function initializeGame() {
    game = gameController();
    activePlayer = game.getActivePlayer()
    screenCntrl.init();
}

initializeGame();

function screenController() {
    const init = () => {
        buttons.forEach(btn => {
            btn.textContent = "";
            btn.dataset.isMarked = "";
            winTxt.textContent = "";
            playerNameTxt.textContent = activePlayer.playerName;
        });
    }

    boardContainer.addEventListener('click', (e) => {
        if(e.target.dataset.column != undefined) {
            if(game.playNewRound(e.target.dataset.row, e.target.dataset.column)) {
                markButton(e.target, activePlayer.playerMark);
                if(game.isThisGameOver()) {
                    showEndGameScreen();
                } else {
                    activePlayer = game.getActivePlayer();
                    playerNameTxt.textContent = activePlayer.playerName;
                }
                
            }
        }
    });

    boardContainer.addEventListener('mouseover', e => {
        let button = e.target.closest('button');
        if (!button) { return; }
        if(button.dataset.isMarked == "")
            button.textContent = activePlayer.playerMark;
    });
    
    boardContainer.addEventListener('mouseout', e => {
        let button = e.target.closest('button');
        if (!button) { return; }
        if(button.dataset.isMarked == "")
            button.textContent = "";
    });


    const showEndGameScreen = () => {
        winTxt.textContent = "won!!!";
    }

    const markButton = (btn, mark) => {
        btn.textContent = mark;
        btn.dataset.isMarked = true;
    }
    return {init}
}
