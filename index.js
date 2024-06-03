

document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById('board');
    const leftBtn = document.querySelector(".left");
    const rightBtn = document.querySelector(".right");
    const playerElement = document.getElementById("player");
    const timerElement = document.querySelector(".timer");
    const pauseElement = document.querySelector(".pause");
    const resetElement = document.querySelector(".reset");
    const resumeElement = document.querySelector(".resume");
   
    console.log(pauseElement,resetElement,resumeElement);
    const pieceSetup = [
        ["cannon", "", "", "", "", "ricochete", "", "titan"],
        ["", "", "", "ricochete", "", "", "", "semi-rico"],
        ["", "tank", "", "", "", "", "", ""],
        ["", "", "", "", "", "tank", "", ""],
        ["", "tank", "", "", "", "", "", "titan"],
        ["", "tank", "", "", "", "", "", "ricochete"],
        ["", "ricochete", "", "", "", "semi-rico", "", ""],
        ["", "", "", "cannon", "", "", "", ""]
    ];
    let pieceClicked = null;
    let activeHighlights = [];
    let currentPlayer = "Player-1";
    let timer;
    let isPaused = false;
    let timeLeft = 20;

    function setTimer(){
         clearInterval(timer);
         timeLeft =20;
         timerElement.textContent = timeLeft
         
         timer = setInterval(()=>{
            if(!isPaused){
            timeLeft--;
            timerElement.textContent = timeLeft;
           
            if (timeLeft <= 0) {
                clearInterval(timer);
                alert(`${currentPlayer === "Player-1" ? "Player-2" : "Player-1"} wins!`);
             } }},1000)
        
    }
    function pauseGame(){
        isPaused = true;
        if(isPaused){
            console.log("paused");
        }
    }
    
    function resumeGame(){
        isPaused = false;
        console.log("resumed");
    }
    function resetGame() {
        isPaused = false;
        currentPlayer = "Player-1";
        playerElement.textContent = currentPlayer;
        setTimer();
       
    }

    // Adding event listeners to playback options
    pauseElement.addEventListener("click", pauseGame);
    resetElement.addEventListener("click", resetGame);
    resumeElement.addEventListener("click", resumeGame);

    function clearHighlights() {
        activeHighlights.forEach(({ cell, handler }) => {
            cell.classList.remove("green");
            cell.removeEventListener("click", handler);
        });
        activeHighlights = [];
    }

    function clickPiece(piece, row, col) {
        clearHighlights();
        pieceClicked = piece;
        console.log(piece,row,col);
        let adjCells;
        const tile = document.getElementById(`cell-${row}-${col}`);
        if(!piece.classList.contains("cannon")){
          adjCells = [
            { r: row, c: col + 1 },
            { r: row + 1, c: col },
            { r: row - 1, c: col },
            { r: row, c: col - 1 },
            { r: row + 1, c: col + 1 },
            { r: row - 1, c: col + 1 },
            { r: row - 1, c: col - 1 },
            { r: row + 1, c: col - 1 }
          ];
         }else{
            adjCells = [
                {r:row , c: col+1},
                {r:row,col :col-1}
            ]
         }
        console.log(adjCells);

        adjCells.forEach(cell => {
            if (cell.c < 8 && cell.r >= 0 && cell.r < 8 && cell.c >= 0) {
                const adjCell = document.getElementById(`cell-${cell.r}-${cell.c}`);
                if (!adjCell.querySelector(".piece")) {
                    adjCell.classList.add("green");

                    function movePieceHandler() {
                        piece.dataset.row = cell.r;
                        piece.dataset.col = cell.c;
                        clickFn(piece,cell.r,cell.c);
                        tile.removeChild(piece);
                        adjCell.appendChild(piece);
                        clearHighlights();
                        if (piece.classList.contains("Player-1")) {
                            findTarget("Player-1");
                          
                        } else if (piece.classList.contains("Player-2")) {
                            findTarget("Player-2");
                        }
                        switchPlayer();
                    }

                    adjCell.addEventListener("click", movePieceHandler);
                    activeHighlights.push({ cell: adjCell, handler: movePieceHandler });

                    setTimeout(() => {
                        if (adjCell.classList.contains("green")) {
                            adjCell.classList.remove("green");
                            adjCell.removeEventListener("click", movePieceHandler);
                            if(pieceClicked){
                                pieceClicked = null;
                            }
                        }
                    }, 2000 )
                }
            }
        });
        
    }
   
    
    function rotate(direction) {
        if (pieceClicked) {
            console.log("pieceClicked", pieceClicked.classList);

            updateRotation(pieceClicked, direction);
            pieceClicked = null;
           
        }
    }

    function updateRotation(piece, direction) {
        if(piece.classList.contains("semi-rico")|| piece.classList.contains("ricochete")){
        let currentRotation = parseInt(piece.dataset.rotation) || 0;
        console.log("Current Rotation:", currentRotation);
        if (direction === "rotate-L") {
            currentRotation = (currentRotation - 90 ) % 360; 
        } else if (direction === "rotate-R") {
            currentRotation = (currentRotation + 90) % 360;
        }
        piece.style.transform = `rotate(${currentRotation}deg)`;
        piece.dataset.rotation = currentRotation;
        
        let player = piece.classList.contains("Player-1") ? "Player-1" : "Player-2";
        console.log(`Updated rotation: ${currentRotation} for piece at (${piece.dataset.row}, ${piece.dataset.col})`);
        findTarget(player);
        switchPlayer();
     }else{
        alert("Rotation is only possible if the piece selected is either Ricochete or Semiricochete");
     }
    }

    function triggerBtns(){
        leftBtn.addEventListener("click", () => rotate("rotate-L"));
        rightBtn.addEventListener("click", () => rotate("rotate-R"));
    }

    function clickFn(piece,row, col) {
     piece.addEventListener("click",()=>{
     clickPiece(piece,row,col);
   
    })
    }

    function findTarget(player){
        console.log(`Finding target for ${player}`);
        let cannon;
        if (player === "Player-1") {
            let targetCol;
            for (let i = 0; i < 8; i++) {
                const baseRank = document.getElementById(`cell-${0}-${i}`);
                if (baseRank.querySelector(".cannon")) {
                    targetCol = i;
                    cannon =baseRank.querySelector(".cannon");
                    console.log("Player-1 Cannon Target Column:", targetCol);
                    break;
                }
            }
            if (targetCol !== undefined) {
                let targetRow;
                for (let j = 1; j < 8; j++) {
                    let cell = document.getElementById(`cell-${j}-${targetCol}`);
                    if (cell.querySelector(".piece")) {
                        targetRow = j;
                        break;
                    }
                }
                console.log("Player-1 Cannon Target Row:", targetRow);
                if(cannon){
                    if (targetRow === undefined) {
                        shootBullet(0, targetCol, 7);
                       
                    } else {
                        shootBullet(0, targetCol, targetRow);
                       
                    }
                } 
               
          
            }  
        }
        if (player === "Player-2") {
            let targetCol;
            for (let i = 0; i < 8; i++) {
                const baseRank = document.getElementById(`cell-${7}-${i}`);
                if (baseRank.querySelector(".cannon")) {
                    targetCol = i;
                     cannon =baseRank.querySelector(".cannon");
                    console.log("Player-2 Cannon Target Column:", targetCol);
                    break;
                }
            }
            if (targetCol !== undefined) {
                let targetRow;
                for (let j = 6; j >= 0; j--) {
                    let cell = document.getElementById(`cell-${j}-${targetCol}`);
                    if (cell.querySelector(".piece")) {
                        targetRow = j;
                        break;
                    }
                }
                console.log("Player-2 Cannon Target Row:", targetRow);
                if(cannon){
                    if (targetRow === undefined) {
                        shootBullet(7, targetCol, 0);
                       
                    } else {
                        shootBullet(7, targetCol, targetRow);
                        
                    }
                }
                
            }
            
        }
    }
    
    function shootBullet(initialRow, initialCol, targetRow,targetCol = initialCol) {
        const bullet = document.createElement("div");
        console.log("bullet created");
        bullet.classList.add("bullet");
        bullet.dataset.rotation = 0;
        bullet.dataset.row = initialRow;
        bullet.dataset.col = initialCol;
        console.log("shootbullet ir ic tr tc",initialRow,initialCol,targetRow,targetCol);
        const initialCell = document.getElementById(`cell-${initialRow}-${initialCol}`);
        const targetCell = document.getElementById(`cell-${targetRow}-${targetCol}`);
       if(initialCell !== targetCell){
        if (!initialCell || !targetCell) {
            console.error("Invalid cell reference");
            return;
        }
    
        initialCell.appendChild(bullet);
    
        const initialRect = initialCell.getBoundingClientRect();
        const targetRect = targetCell.getBoundingClientRect();
    
        const deltaY = targetRect.top - initialRect.top;
        const deltaX = targetRect.left - initialRect.left;
    
        bullet.dataset.direction = deltaY > 0 ? "down" : "up";
        bullet.dataset.direction = deltaX > 0 ? "right" : "left";
        console.log("shootbullet deltax and deltay",deltaX,deltaY);
       
        bullet.style.transition = "transform 1s linear";
        bullet.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        bullet.addEventListener('transitionend', () => {
            afterAnimation(targetCell, initialCell, bullet);
        });
        console.log("shootbullet",initialCell);
        console.log("Initial Row:", initialRow);
        console.log("Column:", initialCol);
        console.log("Target Row:", targetRow);
        console.log("Target col",targetCol);
       }else{
        bullet.classList.add("invisible");
       }
    }

    function afterAnimation(targetCell, initialCell, bullet) {
      
    
        if (targetCell.querySelector(".tank")) {
            console.log("Tank hit");
            console.log("invisible added");
            
            if (bullet.parentNode === initialCell) {
                initialCell.removeChild(bullet);
            }
            targetCell.appendChild(bullet);
            bullet.classList.add("invisible");
    
        } else if (targetCell.querySelector(".ricochete")) {
            console.log("Ricochet hit");
            
            if (bullet.parentNode === initialCell) {
                initialCell.removeChild(bullet);
            }
            targetCell.appendChild(bullet);
            
            let ricochete = targetCell.querySelector(".ricochete");
            console.log("Ricochete:", ricochete);
            ricoAnimation(bullet, ricochete,targetCell,initialCell);
    
        } else if (targetCell.querySelector(".semi-rico")) {
            console.log("Semi-Rico hit");
            
            if (bullet.parentNode === initialCell) {
                initialCell.removeChild(bullet);
            }
            targetCell.appendChild(bullet);
            
            let piece = targetCell.querySelector(".piece");
            let rotation = parseInt(piece.dataset.rotation);
            console.log(rotation);
            console.log("semirico", initialCell);
            semiRicoAnimation(bullet, piece, targetCell, initialCell);
        } else if(targetCell.querySelector(".titan")){
            console.log("Titan hit");
            
            if (bullet.parentNode === initialCell) {
                initialCell.removeChild(bullet);
            }
            targetCell.appendChild(bullet);
            let piece = targetCell.querySelector(".piece");
            animateTitanDestruction(piece,targetCell,bullet);
            targetCell.removeChild(piece);
            targetCell.removeChild(bullet);
        }
        else {
            bullet.classList.add("invisible");
        }
       
     
        
    }
    function animateTitanDestruction(titanPiece) {
        
        titanPiece.style.transition = "opacity 1s linear"; 
        titanPiece.style.opacity = "0"; 
        console.log(titanPiece.classList);
        isPaused = true;
        setTimeout(()=>{
            if(titanPiece.classList.contains("Player-1")){
                alert("Player-2 wins");
            }else if (titanPiece.classList.contains("Player-2")){
                alert("Player-1 wins");
            }
        },320)
      
       
    }
    
    function ricoAnimation(bullet, ricochete,targetCell,initialCell) {
        console.log("RicoAnimation triggered");
        console.log("Ricochete dataset:", ricochete.dataset);
        let angle = parseInt(ricochete.dataset.rotation) || 0;
        console.log("Angle:", angle);
        let initialRow = parseInt(ricochete.dataset.row);
        let initialCol = parseInt(ricochete.dataset.col);
        const diffTop = initialCell.getBoundingClientRect().top - targetCell.getBoundingClientRect().top;
        const diffLeft = initialCell.getBoundingClientRect().left - targetCell.getBoundingClientRect().left;
       
        if (diffTop !== 0) { // Vertical movement
            if (diffTop > 0) { // Bottom to top movement
                if ((angle / 90) % 2 === 0) {
                    newDirection = "right";
                } else  {
                    newDirection = "left";
                } 
            } else { // Top to bottom movement
                if ((angle / 90) % 2 === 0) {
                    newDirection = "left";
                } else {
                    newDirection = "right";
                }
            }
        } else if (diffLeft !== 0) { // Horizontal movement
            if (diffLeft > 0) { // right to left
                if ((angle / 90) % 2 === 0) {
                    newDirection = "down";
                } else  {
                    newDirection = "up";
                } 
            } else { // left to right
                if ((angle / 90) % 2 === 0) {
                    newDirection = "up";
                } else  {
                    newDirection = "down";
                } 
            }
        }
    
        console.log("newDirection:", newDirection);
        changeDirection(bullet, initialRow, initialCol, newDirection);
    }
    
    function semiRicoAnimation(bullet, semiRico, semiRicocell, initialCell) {
        const diffTop = initialCell.getBoundingClientRect().top - semiRicocell.getBoundingClientRect().top;
        const diffLeft = initialCell.getBoundingClientRect().left - semiRicocell.getBoundingClientRect().left;
        let newDirection;
        const rotation = parseInt(semiRico.dataset.rotation);
        const semiRicoRow = parseInt(semiRicocell.dataset.row);
        const semiRicoCol = parseInt(semiRicocell.dataset.col);
        console.log(initialCell);
        console.log("semiRicoAnimation called");
        console.log("diffTop:", diffTop, "diffLeft:", diffLeft);
        console.log("rotation:", rotation);
        console.log("semiRicoRow:", semiRicoRow, "semiRicoCol:", semiRicoCol);
    
        if (diffTop !== 0) { // Vertical movement
            if (diffTop > 0) { // Bottom to top movement
                if (rotation === 0) {
                    newDirection = "right";
                } else if (rotation === 90 || rotation === -270) {
                    newDirection = "left";
                } else {
                    bullet.classList.add("invisible");
                    return;
                }
            } else { // Top to bottom movement
                if (rotation === 180 || rotation === -180) {
                    newDirection = "left";
                } else if (rotation === 270 || rotation === -90) {
                    newDirection = "right";
                } else {
                    bullet.classList.add("invisible");
                    return;
                }
            }
        } else if (diffLeft !== 0) { // Horizontal movement
            if (diffLeft > 0) { // right to left
                if (rotation === 0) {
                    newDirection = "down";
                } else if (rotation === 270 || rotation === -90) {
                    newDirection = "up";
                } else {
                    bullet.classList.add("invisible");
                    return;
                }
            } else { // left to right
                if (rotation === 90 || rotation === -270) {
                    newDirection = "down";
                } else if (rotation === 180 || rotation === -180) {
                    newDirection = "up";
                } else {
                    bullet.classList.add("invisible");
                    return;
                }
            }
        }
    
        console.log("newDirection:", newDirection);
        changeDirection(bullet, semiRicoRow, semiRicoCol, newDirection);
    }
    
    function changeDirection(bullet, initialRow, initialCol, newDirection) {
        let targetRow ;
        let targetCol;
    
        console.log("changeDirection called");
        console.log("initialRow:", initialRow, "initialCol:", initialCol, "newDirection:", newDirection);
    
        bullet.style.transform += ` rotate(${newDirection === "right" ? 90 : newDirection === "left" ? -90 : newDirection === "down" ? 90 : -90}deg)`; // Adjust the bullet's visual rotation
    
        if (newDirection === "right") {
            targetRow = initialRow;
            for (let i = initialCol + 1; i < 8; i++) {
                let cell = document.getElementById(`cell-${initialRow}-${i}`);
                if (cell && cell.querySelector(".piece")) {
                    targetCol = i;
                    break;
                }
            }
            if (targetCol === undefined) {
                targetCol = 7;
            }
            console.log("change dire",initialRow,initialCol,targetRow,targetCol)
            shootBullet(initialRow, initialCol,targetRow, targetCol);
        } else if (newDirection === "left") {
            targetRow = initialRow;
            for (let i = initialCol - 1; i >= 0; i--) {
                let cell = document.getElementById(`cell-${initialRow}-${i}`);
                if (cell && cell.querySelector(".piece")) {
                    targetCol = i;
                    break;
                }
                
            }
            if (targetCol === undefined) {
                targetCol = 0;
            }
            shootBullet(initialRow, initialCol,targetRow, targetCol);
        } else if (newDirection === "down") {
            targetCol = initialCol;
            for (let i = initialRow + 1; i < 8; i++) {
                let cell = document.getElementById(`cell-${i}-${initialCol}`);
                if (cell && cell.querySelector(".piece")) {
                    targetRow = i;
                    break;
                }
            }
            if (targetRow === undefined) {
                targetRow = 7;
            }
            shootBullet(initialRow, targetCol, targetRow);
        } else if (newDirection === "up") {
            targetCol = initialCol;
            for (let i = initialRow - 1; i >= 0; i--) {
                let cell = document.getElementById(`cell-${i}-${initialCol}`);
                if (cell && cell.querySelector(".piece")) {
                    targetRow = i;
                    break;
                }
            }
            if (targetRow === undefined) {
                targetRow = 0;
            }
            shootBullet(initialRow, targetCol, targetRow);
        }
        let initialCell = document.getElementById(`cell-${initialRow}-${initialCol}`);
       console.log("target row and col", targetRow,targetCol);
       initialCell.removeChild(bullet);
        
    }

    function removeAllEventListeners() {
        const pieces = document.querySelectorAll(".piece");
        pieces.forEach(piece => {
            const clone = piece.cloneNode(true);
            piece.parentNode.replaceChild(clone, piece);
        });
    }
 
    function switchPlayer() {
        currentPlayer = currentPlayer === "Player-1" ? "Player-2" : "Player-1";
        playerElement.textContent = currentPlayer;
        updatePieceEventListeners(currentPlayer);
        setTimer();
    }
    
    function updatePieceEventListeners(currentPlayer) {
        removeAllEventListeners();
        const pieces = document.querySelectorAll(".piece");
        pieces.forEach(piece => {  
            if (piece.classList.contains(currentPlayer)) {
                piece.addEventListener("click", () => clickPiece(piece, parseInt(piece.dataset.row), parseInt(piece.dataset.col)));
            }
        });
    }
 
    
    // Creating the board and setting up the pieces
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const tile = document.createElement("div");
            tile.id = `cell-${row}-${col}`;
            tile.classList.add('tile');

            if ((row + col) % 2 == 0) {
                tile.classList.add("skyblue");
            } else {
                tile.classList.add("blue");
            }
            if (pieceSetup[row][col] != "") {
                const piece = document.createElement("div");
                piece.classList.add("piece", pieceSetup[row][col]);
                piece.dataset.row = row;
                piece.dataset.col = col;
                piece.dataset.rotation = 0; 
                if(!(piece.classList.contains("ricochete")|| piece.classList.contains("semi-rico"))){
                    piece.textContent = pieceSetup[row][col];
                    
                }
               
                tile.appendChild(piece);
                if (row < 4) {
                    piece.classList.add("Player-1");
                } else {
                    piece.classList.add("Player-2");
                }
            
                
                playerElement.innerText = "Turn : Player-1"
                playerElement.style.fontFamily ="Chango";
          
               
            }
            tile.dataset.row = row;
            tile.dataset.col = col;
            board.appendChild(tile);
        }
       
        
    }
    triggerBtns();
    setTimer();
    updatePieceEventListeners(currentPlayer);
    
});

