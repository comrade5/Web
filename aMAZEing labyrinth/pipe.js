
let grid = [];
let players = [];
const left = 90;
const gridElement = document.querySelector(".grid");
const table = document.createElement('TABLE');
const rooms = [];

const fixed = [ 'B', 'T', 'T', 'B', 
                'T', 'T', 'T', 'T', 
                'T', 'T', 'T', 'T',
                'B', 'T', 'T', 'B'];

const directions = ['up', 'right', 'down', 'left'];
const imageSize = 50;

class Player {
    constructor(num) {
        this.element = document.createElement('H3');
        this.element.innerHTML += `P${num}`;
        this.element.classList += 'player';
        this.x = 0;
        this.y = 0;
    }

    getElement() {
        return this.element;
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
        this.type = type;
        this.image = new Image(size);
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

    getOpen() {
        return this.open;
    }

    setPlayer(player) {
        this.player = player;
    }

    getPlayer() {
        return this.player;
    }

    getType() {
        return this.type;
    }

    getRoom() {
        return this.image;
    }
}

function setNumberOfPlayers(num) {
    for(let i=0;i<num;++i) {
        players.push(new Player(i));
    }
}

function fillRest() {

    // Make 2D empty array
    for(let i=0;i<7;++i) {
        arr = new Array(7);
        grid.push(arr);
    }

    // Fill movable rooms
    for(let i=1;i<=34;++i) {
        if(i <= 13)  rooms.push(new Room('S', imageSize));
        else if(i <= 28) rooms.push(new Room('B', imageSize));
        else rooms.push(new Room('T', imageSize));
    }

    // Shuffle the movable rooms
    rooms.sort((a,b) => 0.5 - Math.random());

    // Fill the whole grid
    for(let i=0;i<7;++i) {
        for(let j=0;j<7;++j) {
            if((j+1) % 2 != 0 && (i+1) % 2 != 0) grid[i][j] = new Room(fixed.pop(), imageSize);
            else grid[i][j] = rooms.pop();
        }
    }

    console.log(players.length);
    players.forEach(e => console.log(e.getElement()));

    grid[0][0].setPlayer(players.pop());
    grid[6][0].setPlayer(players.pop());
    grid[0][6].setPlayer(players.pop());

    console.log(grid[0][0].getPlayer());
    console.log(grid[0][0].getPlayer() != null);
    console.log(players.length);

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
                console.log('here');
                col.appendChild(e.getPlayer().getElement());
            }
            row.appendChild(col);
        });
        table.appendChild(row);
    })
    table.style.position = 'relative';
    gridElement.appendChild(table);
}


function rotate(deg, open, room) {
    for(let i=0;i<open.length;++i) {
        open[i] = (open[i] + 1) % 4;
    }
    room.style.transform = `rotate(${deg}deg)`;
}

function rotateFixed(deg, open, room) {
    let iter = deg / 90 - 90;
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

function insertRoomUpCol(col) {
    rooms.push(grid[6][col]);

    for (let i = 5; i >= 0; i--) {
        grid[i+1][col] = grid[i][col];
    }

    grid[0][col] = rooms.shift();

    drawGrid();
}

function insertRoomLowCol(col) {
    rooms.push(grid[0][col]);

    for (let i = 0; i < 6; i++) {
        grid[i][col] = grid[i+1][col];
    }

    grid[6][col] = rooms.shift();

    drawGrid();
}

function insertRoomLeftRow(row) {
    rooms.push(grid[row][6]);

    for (let i = 5; i >= 0; i--) {
        grid[row][i+1] = grid[row][i];
    }

    grid[row][0] = rooms.shift();

    drawGrid();
}

function insertRoomRightRow(row) {
    rooms.push(grid[row][0]);

    for (let i = 0; i < 6; i++) {
        grid[row][i] = grid[row][i+1];
    }

    grid[row][6] = rooms.shift();

    drawGrid();
}

function insertRoomOnHover(isRow, isUp, pos) {
    const elem = document.createElement("TR");
    const child = document.createElement("TD");
    for(let i=0;i<pos;++i) {
        elem.innerHTML += "<td><div width='50'></div></td>"
    }
    elem.appendChild(child);
    child.appendChild(rooms[0].getRoom());
    elem.classList += "new_room";

    if(isRow) {
        isUp ? table.insertBefore(elem ,table.childNodes[0])
                : table.appendChild(elem);
    } else {
        const elem = document.createElement("TD");
        elem.appendChild(rooms[0].getRoom());
        
        isUp ? table.childNodes[pos].appendChild(elem) :
                        table.childNodes[pos].insertBefore(elem, table.childNodes[pos].childNodes[0]);
        elem.classList += "new_room";
    }
}

function removeNewRoom() {
    if(document.querySelector('.new_room') != null) {
        document.querySelector('.new_room').remove();
    }
}

function rotateNewRoom() {
    let deg = 90;
    deg += rooms[0].getRoom().style.transform.match(/\d+/) ? 
            parseInt(rooms[0].getRoom().style.transform.match(/\d+/)) 
            : 0; 

    rotate(deg > 270 ? 0 : deg, rooms[0].getOpen(), rooms[0].getRoom());
    rooms[0].getOpen().forEach(e => console.log(directions[e]));
    console.log("_-------------------------");
}

setNumberOfPlayers(3);
fillRest();
setFixed();
drawGrid();

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
    upperPointers[i].addEventListener('mouseover', e => insertRoomOnHover(true, true, position));
    upperPointers[i].addEventListener('mouseout', e => removeNewRoom());
    upperPointers[i].addEventListener('contextmenu', e => {
        e.preventDefault();
        rotateNewRoom();
    });

    // Events for Left Pointers
    leftPointers[i].addEventListener('click', e => insertRoomLeftRow(position));
    leftPointers[i].addEventListener('mouseover', e => insertRoomOnHover(false, false, position));
    leftPointers[i].addEventListener('mouseout', e => removeNewRoom());
    leftPointers[i].addEventListener('contextmenu', e => {
        e.preventDefault();
        rotateNewRoom();
    });

    // Events for Lower Pointers
    lowerPointers[i].addEventListener('click', e => insertRoomLowCol(position));
    lowerPointers[i].addEventListener('mouseover', e => insertRoomOnHover(true, false, position));
    lowerPointers[i].addEventListener('mouseout', e => removeNewRoom());
    lowerPointers[i].addEventListener('contextmenu', e => {
        e.preventDefault();
        rotateNewRoom();
    });

    // Events for Right Pointers
    rightPointers[i].addEventListener('click', e => insertRoomRightRow(position));
    rightPointers[i].addEventListener('mouseover', e => insertRoomOnHover(false, true, position));
    rightPointers[i].addEventListener('mouseout', e => removeNewRoom());
    rightPointers[i].addEventListener('contextmenu', e => {
        e.preventDefault();
        rotateNewRoom();
    });
}

function printRooms(room1, room2) {
    console.log('First room: ');
    room1.getOpen().forEach(e => console.log(directions[e]));

    console.log('Second room: ');
    room2.getOpen().forEach(e => console.log(directions[e]));
}

function getOpenRooms(player) {
    x = player.getX();
    y = player.getY();
    openRooms = [];
    // Moving down
    if(x+1 < 7) {
        const room1 = grid[x][y].getOpen();
        const room2 = grid[x+1][y].getOpen();
        printRooms(grid[x][y], grid[x+1][y]);
        if(room1.includes(directions.indexOf('down')) && room2.includes(directions.indexOf('up')))
            openRooms.push(grid[x+1][y]);
    }

    if(x-1 >= 0) {
        const room1 = grid[x][y].getOpen();
        const room2 = grid[x-1][y].getOpen();
        printRooms(grid[x][y], grid[x-1][y]);
        if(room1.includes(directions.indexOf('up')) && room2.includes(directions.indexOf('down')))
            openRooms.push(grid[x-1][y]);
    }

    if(y-1 >= 0) {
        const room1 = grid[x][y].getOpen();
        const room2 = grid[x][y-1].getOpen();
        printRooms(grid[x][y], grid[x][y-1]);
        if(room1.includes(directions.indexOf('left')) && room2.includes(directions.indexOf('right')))
            openRooms.push(grid[x][y-1]);
    }

    if(y+1 < 7) {
        const room1 = grid[x][y].getOpen();
        const room2 = grid[x][y+1].getOpen();
        printRooms(grid[x][y], grid[x][y+1]);
        if(room1.includes(directions.indexOf('right')) && room2.includes(directions.indexOf('left')))
            openRooms.push(grid[x][y+1]);
    }

    return openRooms;
}

// const player = new Player(1);
// player.setX(2);
// player.setY(5);
// grid[2][5].getRoom().style.filter = "grayscale(100%)";
// move(player);


