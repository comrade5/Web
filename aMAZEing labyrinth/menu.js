const mainMenu = document.querySelector('.main-menu');
const menu = document.querySelector('.menu');
const instruction = document.querySelector('.instruction');
const settings = document.querySelector('.settings');
const saveGame = document.querySelector('.savedGame');
const back = document.querySelector('.back');
const game = document.querySelector('.game');
const win = document.querySelector('.winPage');
const allPages = [mainMenu, instruction, settings, saveGame, back, win, game];

mainMenu.addEventListener('click', e => {
    if(e.target.matches('h1')) {
        switch(e.target.innerHTML) {
            case 'Start': startPage(); break;
            case 'Instruction': instructionPage(); break;
            case 'Saved Games': savedGamesPage(); break;
            case 'Settings': settingsPage(); break;
        }
    }
});

back.addEventListener('click', e => mainMenuPage());

function winPage(char) { 
    allPages.forEach(e => e.classList.add('hidden'));
    menu.classList.add('menu');
    win.classList.remove('hidden');
    win.innerHTML = `<h1>${char} won!</h1>
            <button type="button">Main menu</button>`;
    const mainMenuButton = document.querySelector('.winPage button');
    mainMenuButton.addEventListener('click', e => location.reload());
}

function mainMenuPage() {
    allPages.forEach(e => e.classList.add('hidden'));
    mainMenu.classList.remove('hidden');
}

function startPage() {
    mainMenu.classList.add('hidden');
    menu.classList.remove('menu');
    game.classList.remove('hidden');
    numOfPlayers = rangeInputs[0].value;
    numOfCards = rangeInputs[1].value;
    startGame(numOfPlayers, numOfCards);
}

function instructionPage() {
    back.classList.remove('hidden');
    mainMenu.classList.add('hidden');
    instruction.classList.remove('hidden');
}

function settingsPage() {
    back.classList.remove('hidden');
    mainMenu.classList.add('hidden');
    settings.classList.remove('hidden');
}

function savedGamesPage() {}


// Settings ranges
const rangeInputs = document.querySelectorAll('input[type="range"]')
const outputRange = document.querySelectorAll('#rangevalue')

function handleInputChange(e, i) {
  let target = e.target
  if (e.target.type !== 'range') {
    target = document.getElementById('range')
  } 
  const min = target.min
  const max = target.max
  const val = target.value

  outputRange[i].innerHTML = val;
  if(i == 0) rangeInputs[1].max = 24 / val;
  target.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%'
}

for(let i=0;i<2;++i) {
    rangeInputs[i].addEventListener('input', e => handleInputChange(e, i));
}