var gameboard = [];
var playerNum = 1;
var isPlayerWhite = false;
var gameBegan = false;
var timerInterval;
var player1Name = "";
var player2Name = "";

var whiteCapturedPieces = 0;
var blackCapturedPieces = 0;

var buffer = 15;

const whiteIcon = "./public/assets/images/CircleW.png";
const blackIcon = "./public/assets/images/circle.png";

function displayMessage(message) {
    const messageContainer = document.getElementById("message-container");
    messageContainer.innerText = message;
    messageContainer.style.display = "block";

    setTimeout(() => {
        messageContainer.style.display = "none";
    }, 3000);
}

function gameWin() {
    let wonPlayerName = playerNum === 1 ? player1Name : player2Name;
    displayMessage(wonPlayerName + " has won!");
    gameBegan = false;
    clearInterval(timerInterval); 
}

function updateCapturedBoard() {
    let whiteCapturedElement = document.getElementById("whiteCaptured");
    let blackCapturedElement = document.getElementById("blackCaptured");

    whiteCapturedElement.innerHTML = whiteCapturedPieces;
    blackCapturedElement.innerHTML = blackCapturedPieces;
}

function startTimer() {
    let seconds = 30;
    const turnTimer = document.getElementById("turn-timer");

    turnTimer.innerText = seconds;

    timerInterval = setInterval(() => {
        seconds--;
        turnTimer.innerText = seconds;

        if (seconds === 0) {
            clearInterval(timerInterval);
            switchTurns();
        }
    }, 1000);
}

function getChildIndex(element) {
    return Array.prototype.indexOf.call(element.parentNode.childNodes, element);
}

function generateBoard() {
    const boardSize = 19;
    const board = document.getElementById("board");
    const images = document.getElementById("images");

    for (let row = 0; row < boardSize; row++) {
        gameboard[row] = [];
        const rowElement = document.createElement("tr");

        for (let column = 0; column < boardSize; column++) {
            gameboard[row][column] = 0;
            const cell = document.createElement("td");
            cell.classList.add('element');
            rowElement.appendChild(cell);
        }
        gameboard[row][gameboard[row].length] = 0;

        board.appendChild(rowElement);
    }
    gameboard[gameboard.length] = [];
    for (let column = 0; column < boardSize; column++) {
        gameboard[gameboard.length - 1][column] = 0;
    }
    gameboard[gameboard.length - 1][gameboard[gameboard.length - 1].length] = 0;
}

function recursiveWalk(rowMod, colMod, coords, count, ecount) {
    if (coords[0] < 0 || coords[0] > gameboard.length - 1 || coords[1] < 0 || coords[1] > gameboard[1].length - 1) return count;

    let currentSquare = gameboard[coords[0]][coords[1]];
    if (currentSquare == playerNum && ecount == 0) return recursiveWalk(rowMod, colMod, [coords[0] + rowMod, coords[1] + colMod], count + 1, ecount);

    if (ecount == 2 && currentSquare == playerNum) {
        let previousCoord1 = [coords[0] - rowMod, coords[1] - colMod]
        let previousCoord2 = [coords[0] - (2 * rowMod), coords[1] - (2 * colMod)]

        gameboard[previousCoord1[0]][previousCoord1[1]] = 0
        gameboard[previousCoord2[0]][previousCoord2[1]] = 0

        document.getElementById(previousCoord1[0] + "|" + previousCoord1[1]).remove();
        document.getElementById(previousCoord2[0] + "|" + previousCoord2[1]).remove();

        if (isPlayerWhite) blackCapturedPieces += 2;
        else whiteCapturedPieces += 2;

        updateCapturedBoard();

        return count;
    }
    if (count == 1 && currentSquare != playerNum && currentSquare != 0) {
        return recursiveWalk(rowMod, colMod, [coords[0] + rowMod, coords[1] + colMod], count, ecount + 1)
    }
    return count;
}

function gameStep(row, column) {
    let coords = [row, column];

    let leftCount = recursiveWalk(0, -1, coords, 0, 0);
    let rightCount = recursiveWalk(0, 1, coords, 0, 0);
    let upCount = recursiveWalk(-1, 0, coords, 0, 0);
    let downCount = recursiveWalk(1, 0, coords, 0, 0);
    let upRightCount = recursiveWalk(-1, 1, coords, 0, 0);
    let downLeftCount = recursiveWalk(1, -1, coords, 0, 0);
    let upLeftCount = recursiveWalk(-1, -1, coords, 0, 0);
    let downRightCount = recursiveWalk(1, 1, coords, 0, 0);

    let horizontalCount = (leftCount + rightCount) - 1;
    let verticalCount = (upCount + downCount) - 1;
    let rightDiagonalCount = (upRightCount + downLeftCount) - 1;
    let leftDiagonalCount = (upLeftCount + downRightCount) - 1;

    if (horizontalCount == 3 || verticalCount == 3 || rightDiagonalCount == 3 || leftDiagonalCount == 3) {
        displayTriaMessage();
    } else if (horizontalCount == 4 || verticalCount == 4 || rightDiagonalCount == 4 || leftDiagonalCount == 4) {
        displayTesseraMessage();
    }

    let cumulativeArray = [horizontalCount, verticalCount, rightDiagonalCount, leftDiagonalCount];

    let max = Math.max(...cumulativeArray);
    if (max >= 5) {
        gameWin();
        return;
    }
}

function switchTurns() {
    clearInterval(timerInterval);

    playerNum = playerNum == 1 ? 2 : 1;
    isPlayerWhite = !isPlayerWhite;

    if (whiteCapturedPieces >= 10) {
        displayMessage(player1Name + " has won by capturing 10 tiles!");
        gameBegan = false;
        return;
    } else if (blackCapturedPieces >= 10) {
        displayMessage(player2Name + " has won by capturing 10 tiles!");
        gameBegan = false;
        return;
    }

    const arrowImg = document.getElementById("arrowImg");
    arrowImg.classList.toggle("flipped", isPlayerWhite);

    startTimer();
}

function generateCircle(element, mouseElement) {

    let columnIndex = getChildIndex(element);
    let rowIndex = getChildIndex(element.parentNode);

    let elementRect = element.getBoundingClientRect();

    let halfWidth = ((elementRect.right - elementRect.left) / 2);
    let halfHeight = ((elementRect.bottom - elementRect.top) / 2);

    let midX = elementRect.left + halfWidth;
    let midY = elementRect.top + halfHeight;

    let left = midX > mouseElement.clientX ? true : false;
    let up = midY > mouseElement.clientY ? true : false;

    if (!left) columnIndex += 1;
    if (!up) rowIndex += 1;

    if (gameboard[rowIndex][columnIndex] != 0) return [false];
    gameboard[rowIndex][columnIndex] = playerNum;


    let circleImg = document.createElement("img");
    circleImg.id = rowIndex + "|" + columnIndex;
    circleImg.src = isPlayerWhite ? whiteIcon : blackIcon;
    circleImg.classList.add("chips");
    circleImg.width = halfWidth;
    circleImg.height = halfHeight;

    let marginTop = up ? elementRect.top - halfHeight : elementRect.bottom - halfHeight;
    let marginLeft = left ? elementRect.left - halfWidth : elementRect.right - halfWidth;

    marginTop -= buffer;

    circleImg.style = "margin-top: " + marginTop + "px;" + "margin-left: " + marginLeft + "px;";

    images.appendChild(circleImg);

    return [true, rowIndex, columnIndex];
}

function mouseClick(mouseElement) {
    if (!gameBegan) return;
    let element = document.elementFromPoint(mouseElement.clientX, mouseElement.clientY);
    if (!element.classList.contains('element')) return;

    let result = generateCircle(element, mouseElement);

    if (!result[0]) return;
    gameStep(result[1], result[2]);
    switchTurns();
}

function saveUsernames() {
    player1Name = document.getElementById("player1").value.trim() == "" ? "Player 1" : document.getElementById("player1").value;
    player2Name = document.getElementById("player2").value.trim() == "" ? "Player 2" : document.getElementById("player2").value;

    document.getElementById("player1-start").innerText = player1Name;
    document.getElementById("player2-start").innerText = player2Name;

    document.querySelector(".enter-container").style.display = "none";
    document.querySelector(".start-container").style.display = "block";

    gameBegan = true;

    startTimer();
}

document.addEventListener("DOMContentLoaded", function () {
    generateBoard();
});

document.addEventListener("click", (e) => {
    mouseClick(e);
});

function displayTriaMessage() {
    displayMessage("Tria!");
}

function displayTesseraMessage() {
    displayMessage("Tessera!");
}