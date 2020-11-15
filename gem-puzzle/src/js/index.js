import Puzzle from './Puzzle';
import StopWatch from './StopWatch';

const getShufflesCount = (fieldSize) => {
    const newFieldSize = (fieldSize > 4) ? fieldSize * 40 : fieldSize * 20;
    return newFieldSize;
};

const getBottomBtn = (text) => {
    const btnWrap = document.createElement('div');
    btnWrap.className = 'bottom-btn-wrap';
    btnWrap.innerHTML = `<p>${text}</p>`;
    return btnWrap;
};

const body = document.getElementsByTagName('body')[0];
const main = document.createElement('main');

const content = document.createElement('div');
content.className = 'content';

const gameWrap = document.createElement('div');
gameWrap.className = 'game-wrap';

const iphoneImg = document.createElement('img');
iphoneImg.src = './src/img/iphone.png';
iphoneImg.alt = 'iphone';
gameWrap.append(iphoneImg);

const winLayoutElem = document.createElement('div');
winLayoutElem.id = 'win-layout';
gameWrap.append(winLayoutElem);

const display = document.createElement('div');
display.id = 'display';

const topBar = document.createElement('div');
topBar.id = 'top-bar';

let topBarLabel = document.createElement('p');
topBarLabel.innerHTML = 'A1 BY';
topBar.append(topBarLabel);

const currDate = new Date();
const hoursLabel = (currDate.getHours() > 9) ? `${currDate.getHours()}` : `0${currDate.getHours()}`;
const minutesLabel = (currDate.getMinutes() > 9) ? `${currDate.getMinutes()}` : `0${currDate.getMinutes()}`;
topBarLabel = document.createElement('p');
topBarLabel.innerHTML = `${hoursLabel} : ${minutesLabel}`;
topBar.append(topBarLabel);

topBarLabel = document.createElement('p');
topBarLabel.innerHTML = `${Math.floor(Math.random() * 100)}%`;
topBar.append(topBarLabel);
display.append(topBar);

const topBtns = document.createElement('div');
topBtns.className = 'wide-btns-wrap wide-btns-wrap-top';

const timerElem = document.createElement('div');
timerElem.id = 'timer';
topBtns.append(timerElem);

const counter = document.createElement('div');
counter.id = 'counter';
topBtns.append(counter);
display.append(topBtns);

const nameWrap = document.createElement('div');
nameWrap.id = 'name-wrap';
nameWrap.innerHTML = '<h1>Gem Puzzle</h1>';
display.append(nameWrap);

const fieldElem = document.createElement('div');
fieldElem.id = 'field';
display.append(fieldElem);

const bottomBtns = document.createElement('div');
bottomBtns.className = 'wide-btns-wrap wide-btns-wrap-bottom';

const sizeBtn = document.createElement('div');
sizeBtn.id = 'field-size-select-btn';
bottomBtns.append(sizeBtn);

const newGameBtnElem = document.createElement('div');
newGameBtnElem.id = 'new-game-btn';
bottomBtns.append(newGameBtnElem);

const playPauseBtnElem = document.createElement('div');
playPauseBtnElem.id = 'play-pause-btn';
bottomBtns.append(playPauseBtnElem);

display.append(bottomBtns);
gameWrap.append(display);
content.append(gameWrap);
main.append(content);
body.append(main);

const field = document.getElementById('field');

const winLayout = document.getElementById('win-layout');
const newGamBtn = document.getElementById('new-game-btn');
const startPauseBtn = document.getElementById('play-pause-btn');
const fieldSizeSelectBtn = document.getElementById('field-size-select-btn');

let newGame = true;
let gameState = false;
const maxFieldWidth = 244;
let fieldSize = 4;

const cellWidthDoc = Math.floor(maxFieldWidth / fieldSize);
let puzzle = new Puzzle(fieldSize, cellWidthDoc);
puzzle.initField(field);
let timer = new StopWatch();
field.style.pointerEvents = 'none';

fieldSizeSelectBtn.innerHTML = '';
fieldSizeSelectBtn.append(getBottomBtn(`${fieldSize} * ${fieldSize}`));
fieldSizeSelectBtn.addEventListener('click', () => {
    fieldSize += 1;

    if (fieldSize === 9) fieldSize = 3;

    fieldSizeSelectBtn.innerHTML = '';
    fieldSizeSelectBtn.append(getBottomBtn(`${fieldSize} * ${fieldSize}`));
});

newGamBtn.innerHTML = '';
newGamBtn.append(getBottomBtn('New'));
newGamBtn.style.pointerEvents = 'none';
newGamBtn.addEventListener('click', () => {
    newGame = true;
    gameState = false;
    timer = null;
    timer = new StopWatch();

    const cellWidth = Math.floor(maxFieldWidth / fieldSize);
    puzzle = null;
    puzzle = new Puzzle(fieldSize, cellWidth);
    puzzle.initField(field);

    const buttonCaption = (gameState) ? '||' : 'Go';
    startPauseBtn.innerHTML = '';
    startPauseBtn.append(getBottomBtn(buttonCaption));
});

startPauseBtn.innerHTML = '';
startPauseBtn.append(getBottomBtn('Go'));

startPauseBtn.addEventListener('click', () => {
    gameState = !gameState;
    if (newGame) {
        const cellWidth = Math.floor(maxFieldWidth / fieldSize);
        puzzle = null;
        puzzle = new Puzzle(fieldSize, cellWidth);
        puzzle.initField(field);
        puzzle.shuffle(getShufflesCount(fieldSize));
    }

    newGame = false;
    const buttonCaption = (gameState) ? '||' : 'Go';
    startPauseBtn.innerHTML = '';
    startPauseBtn.append(getBottomBtn(buttonCaption));

    if (gameState) {
        timer.start();
        newGamBtn.style.pointerEvents = 'none';
        field.style.pointerEvents = 'auto';
    } else {
        timer.pause();
        newGamBtn.style.pointerEvents = 'auto';
        field.style.pointerEvents = 'none';
    }
});

winLayout.addEventListener('click', (e) => {
    if (e.target.id === 'win-layout') {
        winLayout.style.display = 'none';
        newGame = true;
        gameState = false;
        timer.pause();
        timer = null;
        timer = new StopWatch();

        const cellWidth = Math.floor(maxFieldWidth / fieldSize);
        puzzle = null;
        puzzle = new Puzzle(fieldSize, cellWidth);
        puzzle.initField(field);

        const buttonCaption = (gameState) ? '||' : 'Go';
        startPauseBtn.innerHTML = '';
        startPauseBtn.append(getBottomBtn(buttonCaption));

        field.style.pointerEvents = 'none';
    }
});
