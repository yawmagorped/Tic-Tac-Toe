const columns = 3;
const rows = 3;

function gameBoard() {
    let board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
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

    let activePlayer = firstPlayer;
    const getActivePlayer = () => activePlayer;

    const switchActivePlayer = () => {
        activePlayer = activePlayer === firstPlayer ? secondPlayer : firstPlayer;
    }
    const playNewRound = (row, column) => {
        selectedCell = gameboard.selectCell(row, column);
        
        if(!selectedCell.isCellEmpty())
            return false;

        selectedCell.markCell(activePlayer.token);
        if(checkLogic())
            endGame(activePlayer);
        switchActivePlayer();
        //printBoard();
        return true;
    }

    // const printBoard = () => {
    //     console.log(`Board\n`);
    //     for (let i = 0; i < rows; i++) {
    //         for (let j = 0; j < columns; j++) {
    //             console.log(`${board[i][j].getValue()}`);
    //         }
    //         console.log("\n");
    //     }
    // }

    const checkLogic = () => {
        let counter = 0;
        for (let i = 0; i < rows; i++) {
            for (let j = 1; j < columns; j++) {
                if (!(board[i][j].isCellEmpty()) && board[i][j].getValue() == board[i][j-1].getValue())
                    counter++;
            }
            if (counter == 2)
                return true;
            else 
                counter = 0;
        }
        for (let i = 0; i < rows; i++) {
            let counter = 0;
            for (let j = 1; j < columns - 1; j++) {
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

    const endGame = (player) => {
        // console.log(`${player.playerName} won!!`);
    }

    return {playNewRound, endGame, getActivePlayer};
}



function screenController() {
    let game = gameController();

    let buttons = document.querySelectorAll("button");
    let activePlayer = game.getActivePlayer();

    let boardContainer = document.querySelector(".board-container")
    
    boardContainer.addEventListener('click', (e) => {
        if(e.target.dataset.column != undefined) {
            if(game.playNewRound(e.target.dataset.row, e.target.dataset.column)) {
                markButton(e.target, activePlayer.playerMark);
                activePlayer = game.getActivePlayer();
            }
        }
    });

    boardContainer.addEventListener('mouseover', e => {
        let button = e.target.closest('button');
        if (!button) { return; }
        if(!(button.dataset.isMarked))
            button.textContent = activePlayer.playerMark;
    });
    
    boardContainer.addEventListener('mouseout', e => {
        let button = e.target.closest('button');
        if (!button) { return; }
        console.log(!(button.dataset.isMarked) );
        if(!(button.dataset.isMarked))
            button.textContent = "";
    });

    const markButton = (btn, mark) => {
        btn.textContent = mark;
        btn.dataset.isMarked = true;
    }
}
screenController();