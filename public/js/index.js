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
