var gameboard = [];
var playerNum = 1;
var isPlayerWhite = false;
var gameBegan = true;

var whiteCapturedPieces = 0;
var blackCapturedPieces = 0;

var buffer = 15;

const whiteIcon = "./public/assets/images/CircleW.png";
const blackIcon = "./public/assets/images/circle.png";

function gameWin() {
    alert("Player "+playerNum+" has won!");
    gameBegan = false;
}

function getChildIndex(element) {
    return Array.prototype.indexOf.call(element.parentNode.childNodes, element);
}

function generateBoard(){
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
        gameboard[gameboard.length-1][column] = 0;
    }
    gameboard[gameboard.length-1][gameboard[gameboard.length-1].length] = 0;
}

function recursiveWalk(rowMod, colMod, coords, count, ecount) {
    if (coords[0] < 0 || coords[0] > gameboard.length-1 || coords[1] < 0 || coords[1] > gameboard[1].length-1) return count;

    let currentSquare = gameboard[coords[0]][coords[1]];
    if (currentSquare == playerNum && ecount == 0) return recursiveWalk(rowMod, colMod, [coords[0]+rowMod, coords[1]+colMod], count+1, ecount);

    if (ecount == 2 && currentSquare == playerNum) {
        let previousCoord1 = [coords[0]-rowMod,coords[1]-colMod]
        let previousCoord2 = [coords[0]-(2*rowMod),coords[1]-(2*colMod)]

        gameboard[previousCoord1[0]][previousCoord1[1]] = 0
        gameboard[previousCoord2[0]][previousCoord2[1]] = 0

        document.getElementById(previousCoord1[0]+"|"+previousCoord1[1]).remove();
        document.getElementById(previousCoord2[0]+"|"+previousCoord2[1]).remove();
        return count;
    }
    if (count == 1 && currentSquare != playerNum && currentSquare != 0) {
        return recursiveWalk(rowMod, colMod, [coords[0]+rowMod, coords[1]+colMod], count, ecount+1)
    }
    return count;
}

function gameStep(row, column){
    let coords = [row, column];

    let leftCount = recursiveWalk(0,-1,coords, 0,0);
    let rightCount = recursiveWalk(0,1,coords, 0,0);
    let upCount = recursiveWalk(-1,0,coords,0,0);
    let downCount = recursiveWalk(1,0,coords,0,0);
    let upRightCount = recursiveWalk(-1,1,coords,0,0);
    let downLeftCount = recursiveWalk(1,-1,coords,0,0);
    let upLeftCount = recursiveWalk(-1,-1,coords,0,0);
    let downRightCount = recursiveWalk(1,1,coords,0,0);

    let horizontalCount = (leftCount + rightCount) -1;
    let vericalCount = (upCount + downCount) -1;
    let rightDiagonalCount = (upRightCount + downLeftCount) -1;
    let leftDiagnoalCount = (upLeftCount + downRightCount) -1;

    let cumulativeArray = [horizontalCount, vericalCount, rightDiagonalCount, leftDiagnoalCount];

    let max = Math.max(...cumulativeArray);
    console.log(max);
    if (max == 3) alert("Tria!");
    else if (max == 4) alert("Tessera!");
    else if (max == 5) {
        gameWin();
        return;
    }
    if (playerNum == 1 && whiteCapturedPieces == 10) gameWin();
    else if (playerNum == 2 && whiteCapturedPieces == 10) gameWin();
}

function switchTurns() {
    playerNum = playerNum == 1 ? 2 : 1;
    isPlayerWhite = isPlayerWhite == true ? false : true;
}

function generateCircle(element, mouseElement) {

    let columnIndex = getChildIndex(element);
    let rowIndex = getChildIndex(element.parentNode);

    let elementRect = element.getBoundingClientRect();

    let halfWidth = ((elementRect.right - elementRect.left)/2);
    let halfHeight = ((elementRect.bottom - elementRect.top)/2);

    let midX = elementRect.left + halfWidth;
    let midY = elementRect.top + halfHeight;

    let left = midX > mouseElement.clientX ? true : false;
    let up = midY > mouseElement.clientY ? true : false;

    if (!left) columnIndex += 1;
    if (!up) rowIndex += 1;

    if (gameboard[rowIndex][columnIndex] != 0) return [false];
    gameboard[rowIndex][columnIndex] = playerNum;


    let circleImg = document.createElement("img");
    circleImg.id = rowIndex+"|"+columnIndex;
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
    gameStep(result[1],result[2]);
    switchTurns();
}

function saveUsernames() {
    var player1Name = document.getElementById("player1").value;
    var player2Name = document.getElementById("player2").value;
    
    document.getElementById("player1-start").innerText = player1Name;
    document.getElementById("player2-start").innerText = player2Name;
    
    document.querySelector(".enter-container").style.display = "none";
    document.querySelector(".start-container").style.display = "block";
    
}

document.addEventListener("DOMContentLoaded", function() {
    generateBoard();
});

document.addEventListener("click", (e) => {
    mouseClick(e);
})
