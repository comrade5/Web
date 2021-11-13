function startGame(numOfPlayers, numOfCards) {
    console.log('here');
    const table = document.createElement('TABLE');
    const gridElement = document.querySelector(".grid");
    const domPlayerInfo = document.querySelector(".playerInfo");
    const domCards = document.querySelector(".cards");
    let grid = [];
    const players = [];
    const rooms = [];
    const treasures = [];
    const newRoomPos = {
        x: -1,
        y: -1
    }
    const playersInitialPosition = [[0, 0], [6, 6], [0, 6], [6, 0]]
    let playerTurn = 0;
    const left = 90;
    let wasInserted = false;

    const treasureChars = ['👙', '💍', '🧦', '🩲', '👶🏾', '🍥', '🗿', '🧻', '🚽',
                        "🧱", "🧲", "🔫", "💣", "🧨", "🪓", "🔪", "⚗️", 
                        "💉", "🚬", "⚰️", "🏺", "🔮", "📿", "🧿"];

    const playerChars = ["🤡", "💩", '🤖', '👽'];

    const fixed = [ 'B', 'T', 'T', 'B', 
                    'T', 'T', 'T', 'T', 
                    'T', 'T', 'T', 'T',
                    'B', 'T', 'T', 'B'];

    const directions = ['up', 'right', 'down', 'left'];

    function drawCards(playerIcon, treasureIcon) {
        return `<div class="flip-card"> \
                            <div class="flip-card-inner"> \
                                <div class="flip-card-front"> \
                                    <span>${playerIcon}</span>
                                </div> \
                                <div class="flip-card-back"> \
                                    <span>${treasureIcon}</span>
                                </div> \
                            </div> \
                        </div>`;
    }

    function drawPlayerInfo(char, number) {
        return `<p>Player's character: ${char}</p>
                        <p>Treasures to find: ${number}</p>`;
    }

    class Treasure {
        constructor(elem) {
            this.char = elem;
            this.domElement = document.createElement('div');
            this.domElement.innerHTML += elem;
            this.domElement.classList += 'treasure';
        }

        getElement() {
            return this.domElement;
        }

        getType() {
            return this.char;
        }

        equals(other) {
            return this.char == other.getType();
        }
    }

    class Player {
        constructor(xyList) {
            this.domElement = document.createElement('div');
            this.domElement.innerHTML += playerChars.pop();
            this.domElement.classList += 'player';
            this.x = xyList[0];
            this.y = xyList[1];
            this.initialX = xyList[0];
            this.initialY = xyList[1];
            this.cards = [];
        }

        getElement() {
            return this.domElement;
        }

        getCards() {
            return this.cards;
        }

        addCard(card) {
            this.cards.push(card);
        }

        removeCard(card) {
            this.cards = this.cards.filter(e => !e.equals(card));
        }

        move(x, y) {
            if(findListExist(getOpenRooms([this.x, this.y]), [x, y]))
            {   
                grid[this.x][this.y].removePlayer();
                grid[x][y].setPlayer(this);
                this.setX(x); this.setY(y);

                if(grid[x][y].hasTreasure()) {
                    this.removeCard(grid[x][y].getTreasure());
                    this.getCards().forEach(e => e.equals(grid[x][y].getTreasure()));
                }
                nextPlayer();
            }
        }

        hasWon() {
            return this.initialX == this.x 
                    && this.initialY == this.y 
                        && this.cards.length == 0;
        }

        getX() {
            return this.x;
        }

        getY() {
            return this.y;
        }

        setX(x) {
            this.x = x;
        }

        setY(y) {
            this.y = y;
        }
    }

    class Room {
        constructor(type, size) {
            this.player = null;
            this.treasure = null;
            this.type = type;
            this.image = new Image();
            this.image.classList += 'room';
            this.open = [];
            switch(type) {
                case 'T':
                    this.image.src = "t.png";
                    this.open.push(directions.indexOf('left'), directions.indexOf('down'), directions.indexOf('right'));
                    break;
                case 'S':
                    this.image.src = "straight.png";
                    this.open.push(directions.indexOf('up'), directions.indexOf('down'));
                    break;
                case 'B':
                    this.image.src = "bended.png";
                    this.open.push(directions.indexOf('right'), directions.indexOf('down'));
                    break;
            }
        }

        getOpen() { return this.open; }

        getPlayer() { return this.player; }

        getTreasure() { return this.treasure; }

        getType() { return this.type; }

        getRoom() { return this.image; }
        
        putTreasure(treasure) {
            this.treasure = treasure;
        }

        setPlayer(player) { 
            this.player = player; 
        }

        hasTreasure() { return this.treasure != null}

        removeTreasure() { this.treasure = null; }

        removePlayer() { this.player = null; }
    }

    fillTreasure();
    setNumberOfPlayers(numOfPlayers, numOfCards);
    fillGrid();
    setFixed();
    drawGrid();

    function nextPlayer() {
        playerTurn = (playerTurn + 1) % players.length;
        wasInserted = false;
        drawGrid();
    }

    function setNumberOfPlayers(num, numOfCards) {
        cardTreasures = [...treasures];
        // Shuffle the cards
        cardTreasures.sort((a,b) => 0.5 - Math.random());
        for(let i=0;i<num;++i) {
            const player = new Player(playersInitialPosition[i]);
            for(let j=0;j<numOfCards;++j) {
                player.addCard(cardTreasures.pop());
            }
            players.push(player);
        }
    }


    function fillTreasure() {
        // Shuffle the treasure
        treasureChars.sort((a,b) => 0.5 - Math.random());

        treasureChars.forEach(e => {
            treasures.push(new Treasure(e));
        });
    }

    function fillGrid() {

        // Make 2D empty array
        for(let i=0;i<7;++i) {
            arr = new Array(7);
            grid.push(arr);
        }

        // Fill movable rooms
        for(let i=1;i<=34;++i) {
            if(i <= 13)  rooms.push(new Room('S'));
            else if(i <= 28) rooms.push(new Room('B'));
            else rooms.push(new Room('T'));
        }

        // Shuffle the movable rooms
        rooms.sort((a,b) => 0.5 - Math.random());

        // Fill the whole grid
        for(let i=0;i<7;++i) {
            for(let j=0;j<7;++j) { 

                // Put the rooms
                if((j+1) % 2 != 0 && (i+1) % 2 != 0) grid[i][j] = new Room(fixed.pop());
                else grid[i][j] = rooms.pop();
            }
        }

        // Randomly put the treasures
        while(treasures.length > 0) {
            let i = parseInt(Math.random() * 7);
            let j = parseInt(Math.random() * 7);
                if((i == 0 && j == 0) || (i == 6 && j == 0) || (i == 0 && j == 6) || (i == 6 && j == 6)) {}
                else {
                    !grid[i][j].hasTreasure() && grid[i][j].putTreasure(treasures.pop());
                } 
        }

        // Putting players on the grid
        players.forEach(e => grid[e.getX()][e.getY()].setPlayer(e));
    }

    function roomAction(x, y) {
        players[playerTurn].move(x, y);
        if(players[playerTurn].hasWon()) {
            winPage(players[playerTurn].getElement.innerHTML);
        }
    }

    function drawGrid() {

        if(gridElement.querySelector('table') != null) {
            table.innerHTML = '';
        }

        grid.forEach(e => {
            const row = document.createElement("TR");
            e.forEach(e => {
                const col = document.createElement("TD");
                col.appendChild(e.getRoom());
                if(e.getPlayer() != null) { 
                    col.appendChild(e.getPlayer().getElement()); 
                } else
                    e.hasTreasure() && col.appendChild(e.getTreasure().getElement());
                
                row.appendChild(col);
            });
            table.appendChild(row);
        })

        gridElement.appendChild(table);

        // Print the extra room
        document.querySelector('.extraCard').innerHTML = '';
        document.querySelector('.extraCard').appendChild(rooms[0].getRoom());

        // Print the info part
        domPlayerInfo.innerHTML = drawPlayerInfo(players[playerTurn].getElement().innerHTML, players[playerTurn].getCards().length);
        domCards.innerHTML = '';
        players[playerTurn].getCards().forEach(e => {
            domCards.innerHTML += drawCards(players[playerTurn].getElement().innerHTML, e.getType());
        });

        // Open rooms indication
        unhighlightRooms();
        highlightRooms(players[playerTurn].getX(), players[playerTurn].getY());
    }


    function rotate(deg, open, room) {
        for(let i=0;i<open.length;++i) {
            open[i] = (open[i] + 1) % 4;
        }
        room.style.transform = `rotate(${deg}deg)`;
    }

    function rotateFixed(deg, open, room) {
        let iter = deg / 90;
        for(let it=1;it<=iter;++it) {
            for(let i=0;i<open.length;++i) {
                open[i] = (open[i] + 1) % 4;
            }
        }
        room.style.transform = `rotate(${deg}deg)`;
    }

    // Fix the position of fixed rooms
    function setFixed() {
        rotateFixed(left, grid[0][6].getOpen(), grid[0][6].getRoom());
        rotateFixed(270, grid[2][0].getOpen(), grid[2][0].getRoom());
        rotateFixed(270, grid[2][2].getOpen(), grid[2][2].getRoom());
        rotateFixed(left, grid[2][6].getOpen(), grid[2][6].getRoom());
        rotateFixed(270, grid[4][0].getOpen(), grid[4][0].getRoom());
        rotateFixed(180, grid[4][2].getOpen(), grid[4][2].getRoom());
        rotateFixed(left, grid[4][4].getOpen(), grid[4][4].getRoom());
        rotateFixed(left, grid[4][6].getOpen(), grid[4][6].getRoom());
        rotateFixed(270, grid[6][0].getOpen(), grid[6][0].getRoom());
        rotateFixed(180, grid[6][2].getOpen(), grid[6][2].getRoom());
        rotateFixed(180, grid[6][4].getOpen(), grid[6][4].getRoom());
        rotateFixed(180, grid[6][6].getOpen(), grid[6][6].getRoom());
    }

    function swapItems(room1, room2, x, y) {
        if (room2.getPlayer() != null) {
            room1.setPlayer(room2.getPlayer());
            room1.getPlayer().setX(x);
            room1.getPlayer().setY(y);
            room2.removePlayer();
        }

        if(room2.hasTreasure()) {
            room1.putTreasure(room2.getTreasure());
            room2.removeTreasure();
        }
    }

    function insertRoomUpCol(col) {
        if(!(newRoomPos.x == 0 && newRoomPos.y == col) && !wasInserted) {
            rooms.push(grid[6][col]);

            // Remember the new room pos
            newRoomPos.x = 6;
            newRoomPos.y = col;

            swapItems(rooms[0], grid[6][col], 0, col);

            for (let i = 5; i >= 0; i--) {
                grid[i+1][col] = grid[i][col];
                grid[i][col].getPlayer()
                    && grid[i][col].getPlayer().setX(i+1);
            }

            grid[0][col] = rooms.shift();

            wasInserted = true;

            drawGrid();
        }
    }

    function insertRoomLowCol(col) {
        if(!(newRoomPos.x == 6 && newRoomPos.y == col) && !wasInserted) {
            rooms.push(grid[0][col]);

            // Remember the new room pos
            newRoomPos.x = 0;
            newRoomPos.y = col;

            swapItems(rooms[0], grid[0][col], 6, col);

            for (let i = 0; i < 6; i++) {
                grid[i][col] = grid[i+1][col];
                grid[i][col].getPlayer()
                    && grid[i][col].getPlayer().setX(i+1);
            }

            grid[6][col] = rooms.shift();

            wasInserted = true;

            drawGrid();
        }
    }

    function insertRoomLeftRow(row) {
        if(!(newRoomPos.y == 0 && newRoomPos.x == row) && !wasInserted) {
            rooms.push(grid[row][6]);

            // Remember the new room pos
            newRoomPos.x = row;
            newRoomPos.y = 6;

            swapItems(rooms[0], grid[row][6], row, 0);

            for (let i = 5; i >= 0; i--) {
                grid[row][i+1] = grid[row][i];
                grid[row][i].getPlayer()
                    && grid[row][i].getPlayer().setY(i+1);
            }

            grid[row][0] = rooms.shift();

            wasInserted = true;

            drawGrid();
        }
    }

    function insertRoomRightRow(row) {
        if(!(newRoomPos.y == 6 && newRoomPos.x == row) && !wasInserted) {
            rooms.push(grid[row][0]);

            // Remember the new room pos
            newRoomPos.x = row;
            newRoomPos.y = 0;

            swapItems(rooms[0], grid[row][0], row, 6);

            for (let i = 0; i < 6; i++) {
                grid[row][i] = grid[row][i+1];
                grid[row][i].getPlayer()
                    && grid[row][i].getPlayer().setY(i+1);
            }

            grid[row][6] = rooms.shift();

            wasInserted = true;

            drawGrid();
        }
    }

    function rotateNewRoom() {
        let deg = 90;
        deg += rooms[0].getRoom().style.transform.match(/\d+/) ? 
                parseInt(rooms[0].getRoom().style.transform.match(/\d+/)) 
                : 0;

        rotate(deg > 270 ? 0 : deg, rooms[0].getOpen(), rooms[0].getRoom());
        rooms[0].getOpen().forEach(e => console.log(directions[e]));
    }

    // Pointer elements
    const upperPointers = document.querySelectorAll('.upper img');
    const lowerPointers = document.querySelectorAll('.lower img');
    const leftPointers = document.querySelectorAll('.leftSide img');
    const rightPointers = document.querySelectorAll('.rightSide img');

    for(let i=0;i<3;++i) {

        // Position of the pointer i.e. first, second and etc.
        let position = (i*2+2)-1;
    
        // Events for Upper Pointers
        upperPointers[i].addEventListener('click', e => insertRoomUpCol(position));
        upperPointers[i].addEventListener('contextmenu', e => {
            e.preventDefault();
            rotateNewRoom();
        });
    
        // Events for Left Pointers
        leftPointers[i].addEventListener('click', e => insertRoomLeftRow(position));
        leftPointers[i].addEventListener('contextmenu', e => {
            e.preventDefault();
            rotateNewRoom();
        });
    
        // Events for Lower Pointers
        lowerPointers[i].addEventListener('click', e => insertRoomLowCol(position));
        lowerPointers[i].addEventListener('contextmenu', e => {
            e.preventDefault();
            rotateNewRoom();
        });
    
        // Events for Right Pointers
        rightPointers[i].addEventListener('click', e => insertRoomRightRow(position));
        rightPointers[i].addEventListener('contextmenu', e => {
            e.preventDefault();
            rotateNewRoom();
        });
    
    }

    document.addEventListener('keydown', function(e) {
        winPage('f');
        e.preventDefault();
        switch (e.keyCode) {
            case 37:
                console.log('left');
                roomAction(players[playerTurn].getX(), players[playerTurn].getY()-1);
                break;
            case 38:
                console.log('up');
                roomAction(players[playerTurn].getX()-1, players[playerTurn].getY());
                break;
            case 39:
                console.log('right');
                roomAction(players[playerTurn].getX(), players[playerTurn].getY()+1);
                break;
            case 40:
                console.log('down');
                roomAction(players[playerTurn].getX()+1, players[playerTurn].getY());
                break;
            case 32:
                nextPlayer();
                break;
        }
    });

    function findListExist(list, elem) {
        return list.some(e => e[0] == elem[0] && e[1] == elem[1]);
    }

    function highlightRooms(x, y) {
        movableRooms = dfs(getOpenRooms([x, y]))
        movableRooms.forEach(e => {
            grid[e[0]][e[1]].getRoom().classList.add('highlight');
        });
    }

    function unhighlightRooms() {
        grid.forEach(e => {
            e.forEach(e => e.getRoom().classList.remove('highlight'));
        });
        rooms[0].getRoom().classList.remove('highlight');
    }

    function getOpenRooms(list) {
        const x = list[0]
        const y = list[1]
        openRooms = [];

        // Moving down
        if(x+1 < 7) {
            const room1 = grid[x][y].getOpen();
            const room2 = grid[x+1][y].getOpen();
            if(room1.includes(directions.indexOf('down')) && room2.includes(directions.indexOf('up'))) {
                openRooms.push([x+1, y]);
            }
        }

        if(x-1 >= 0) {
            const room1 = grid[x][y].getOpen();
            const room2 = grid[x-1][y].getOpen();
            if(room1.includes(directions.indexOf('up')) && room2.includes(directions.indexOf('down'))) {
                openRooms.push([x-1, y]);
            }
        }

        if(y-1 >= 0) {
            const room1 = grid[x][y].getOpen();
            const room2 = grid[x][y-1].getOpen();
            if(room1.includes(directions.indexOf('left')) && room2.includes(directions.indexOf('right'))) {
                openRooms.push([x, y-1]);
            }
        }

        if(y+1 < 7) {
            const room1 = grid[x][y].getOpen();
            const room2 = grid[x][y+1].getOpen();
            if(room1.includes(directions.indexOf('right')) && room2.includes(directions.indexOf('left'))) {
                openRooms.push([x, y+1]);
            }
        }

        return openRooms;
    }

    function dfs(open) {
        visited = []
        for(let i=0;i<open.length;++i) {
            if(!findListExist(visited, open[i]))
                explore(getOpenRooms(open[i]));
        }

        function explore(open) {
            for(let i=0;i<open.length;++i) {
                if(!findListExist(visited, open[i])) {
                    visited.push(open[i]);
                    explore(getOpenRooms(open[i]));
                }
            }
        }

        return visited;
    }
}