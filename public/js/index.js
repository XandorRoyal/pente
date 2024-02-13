document.addEventListener("DOMContentLoaded", function() {
    const boardSize = 19;
    const board = document.getElementById("board");

    // Loop to generate rows and cells within each row
    for (let i = 0; i < boardSize; i++) {
        const row = document.createElement("tr");

        for (let j = 0; j < boardSize; j++) {
            const cell = document.createElement("td");
            row.appendChild(cell);
        }

        board.appendChild(row);
    }
});

function saveUsernames() {
    var player1Name = document.getElementById("player1").value;
    var player2Name = document.getElementById("player2").value;
    
    document.getElementById("player1-start").innerText = player1Name;
    document.getElementById("player2-start").innerText = player2Name;
    
    document.querySelector(".enter-container").style.display = "none";
    document.querySelector(".start-container").style.display = "block";
    
}
