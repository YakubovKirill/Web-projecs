function getBtnContent(button) {
    const innerContent = button.children[0];
    return innerContent.children[0];
}

const createWinMenu = () => {
    const winWrap = document.createElement('div');
    winWrap.id = 'win-label-wrap';

    let p = document.createElement('p');
    p.innerHTML = 'Congratulations';
    winWrap.append(p);

    p = document.createElement('p');
    p.innerHTML = 'You won';
    winWrap.append(p);

    p = document.createElement('p');
    const counterLabel = document.getElementById('counter');
    let innerP = getBtnContent(counterLabel);
    p.innerHTML = `Steps: ${innerP.innerHTML}`;
    winWrap.append(p);

    p = document.createElement('p');
    const timerLabel = document.getElementById('timer');
    innerP = getBtnContent(timerLabel);
    p.innerHTML = `Time: ${innerP.innerHTML}`;
    winWrap.append(p);

    p = document.createElement('p');
    p.innerHTML = '';
    winWrap.append(p);

    return winWrap;
};

const playSound = (url) => {
    let audio = document.createElement('audio');
    audio.setAttribute('src', url);
    audio.load();
    audio.play();
    audio = undefined;
};

const audioClickSrc = './src/audio/click.mp3';

export default class Puzzle {
    constructor(size = 4, cellWidth = 110) {
        this.size = size;
        this.matrixSize = size ** 2;
        this.cellWidth = cellWidth;
        const emptyCellPosition = (size - 1);
        this.emptyCell = {
            value: this.matrixSize,
            top: emptyCellPosition,
            left: emptyCellPosition,
        };
        this.cells = [];
        this.stepCount = 0;
    }

    initField = (field) => {
        const fieldElem = field;
        fieldElem.innerHTML = '';
        this.reset();

        let numArr = [...Array(this.matrixSize - 1).keys()].map((key) => key);
        numArr.forEach((element) => {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.style.fontSize = (this.size < 5) ? '20px' : '12px';
            cell.style.width = `${this.cellWidth}px`;
            cell.style.height = `${this.cellWidth}px`;

            const cellContent = document.createElement('div');
            const value = element + 1;
            cellContent.className = 'cell-content';
            cellContent.innerHTML = value;

            const left = element % this.size;
            const top = (element - left) / this.size;

            cell.style.top = `${top * this.cellWidth}px`;
            cell.style.left = `${left * this.cellWidth}px`;

            this.cells.push({
                value,
                left,
                top,
                element: cell,
            });

            cellContent.addEventListener('click', () => {
                const isMove = this.moveCell(element);
                if (isMove) {
                    playSound(audioClickSrc);

                    if (this.isWin()) {
                        const winLayout = document.getElementById('win-layout');
                        winLayout.innerHTML = '';
                        winLayout.append(createWinMenu());
                        winLayout.style.display = 'flex';
                    }
                }
            });

            cell.append(cellContent);
            fieldElem.append(cell);
        });

        this.cells.push(this.emptyCell);
        numArr = [];
    }

    moveCell = (index) => {
        const cell = this.cells[index];

        const leftDiff = Math.abs(cell.left - this.emptyCell.left);
        const topDiff = Math.abs(cell.top - this.emptyCell.top);

        if ((leftDiff + topDiff) <= 1) {
            this.addCounter();
            cell.element.style.top = `${this.emptyCell.top * this.cellWidth}px`;
            cell.element.style.left = `${this.emptyCell.left * this.cellWidth}px`;

            const emptyLeft = this.emptyCell.left;
            const emptyTop = this.emptyCell.top;

            this.emptyCell.left = cell.left;
            this.emptyCell.top = cell.top;

            cell.left = emptyLeft;
            cell.top = emptyTop;

            return true;
        }
        return false;
    }

    isWin = () => {
        let winFlag = true;
        this.cells.forEach((cell) => {
            if (winFlag) winFlag = cell.value === cell.top * this.size + cell.left + 1;
        });
        return winFlag;
    }

    addCounter = () => {
        this.stepCount += 1;

        const counter = document.getElementById('counter');
        counter.innerHTML = '';

        const counterContent = document.createElement('div');
        counterContent.className = 'top-btn-wrap';
        counterContent.innerHTML = `<h3>${this.stepCount}<h3>`;

        counter.append(counterContent);
    }

    setCellWidth = (width) => {
        this.cellWidth = width;
    }

    reset = () => {
        this.cells = [];
        this.stepCount = 0;

        const counter = document.getElementById('counter');
        counter.innerHTML = '';

        const counterContent = document.createElement('div');
        counterContent.className = 'top-btn-wrap';
        counterContent.innerHTML = `<h3>${this.stepCount}<h3>`;

        counter.append(counterContent);
    }

    shuffle = (steps) => {
        for (let i = 0; i < steps; i += 1) {
            let counter = 0;
            const moveElements = [];

            this.cells.forEach((cell) => {
                const leftDiff = Math.abs(cell.left - this.emptyCell.left);
                const topDiff = Math.abs(cell.top - this.emptyCell.top);
                if ((leftDiff + topDiff) === 1) moveElements.push(counter);
                counter += 1;
            });

            const movedIndex = moveElements[Math.floor(Math.random() * moveElements.length)];
            this.moveCell(movedIndex);
        }

        this.stepCount = -1;
        this.addCounter();
    }
}
