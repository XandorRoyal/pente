var gameboard = [];
var playerNum = 1;
var gameBegan = true;

const whiteIcon = "./public/assets/images/circleW.png"
const blackIcon = "./public/assets/images/circle.png";

function generateBoard(){
    const boardSize = 19;
    const board = document.getElementById("board");
    const images = document.getElementById("images");

    // Loop to generate rows and cells within each row
    for (let i = 0; i < boardSize; i++) {
        gameboard[i] = [];
        const row = document.createElement("tr");

        for (let j = 0; j < boardSize; j++) {
            gameboard[i][j] = 0;
            const cell = document.createElement("td");
            cell.classList.add('element');
            row.appendChild(cell);
        }
        gameboard[i][gameboard[i].length] = 0;

        board.appendChild(row);
    }
    gameboard[gameboard.length] = [];
    console.log(gameboard.length);
    for (let i = 0; i < boardSize; i++) {
        gameboard[gameboard.length-1][i] = 0;
    }
    gameboard[gameboard.length-1][gameboard[gameboard.length-1].length] = 0;
}

function getChildIndex(element) {
    return Array.prototype.indexOf.call(element.parentNode.childNodes, element);
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

    console.log(rowIndex, columnIndex, gameboard[rowIndex][columnIndex]);

    if (gameboard[rowIndex][columnIndex] != 0) return;
    gameboard[rowIndex][columnIndex] = playerNum;


    let circleImg = document.createElement("img");
    circleImg.src = "./public/assets/images/circle.png"
    circleImg.classList.add("chips");
    circleImg.width = halfWidth;
    circleImg.height = halfHeight;

    let marginTop = up ? elementRect.top - halfHeight : elementRect.bottom - halfHeight;
    let marginLeft = left ? elementRect.left - halfWidth : elementRect.right - halfWidth;

    circleImg.style = "margin-top: " + marginTop + "px;" + "margin-left: " + marginLeft + "px;";

    images.appendChild(circleImg);
}

function mouseClick(mouseElement) {
    if (!gameBegan) return;
    let element = document.elementFromPoint(mouseElement.clientX, mouseElement.clientY);
    if (!element.classList.contains('element')) return;

    generateCircle(element, mouseElement);
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
