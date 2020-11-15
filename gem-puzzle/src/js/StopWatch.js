export default class StopWatch {
    constructor() {
        this.reset();
    }

    start = () => {
        if (!this.isActive) {
            this.inerval = setInterval(this.update, 1000);
            this.offset = Date.now();
            this.isActive = true;
        }
    }

    pause = () => {
        if (this.isActive) {
            clearInterval(this.inerval);
            this.inerval = null;
            this.isActive = false;
        }
    }

    delta = () => {
        const now = Date.now();
        const passedTime = now - this.offset;
        this.offset = now;
        return passedTime;
    }

    update = () => {
        this.currentTime += this.delta();
        this.printTimer(Math.floor(this.currentTime / 1000));
    }

    reset = () => {
        this.isActive = false;
        this.currentTime = 0;
        this.inerval = 0;
        this.offset = 0;

        const timer = document.getElementById('timer');
        timer.innerHTML = '';

        const timerContent = document.createElement('div');
        timerContent.className = 'top-btn-wrap';
        timerContent.innerHTML = '<h3>00 : 00</h3>';

        timer.append(timerContent);
    }

    printTimer = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        const minutesLabel = (minutes < 10) ? `0${minutes}` : `${minutes}`;
        const secondsLabel = (seconds < 10) ? `0${seconds}` : `${seconds}`;

        const timer = document.getElementById('timer');
        timer.innerHTML = '';

        const timerContent = document.createElement('div');
        timerContent.className = 'top-btn-wrap';
        timerContent.innerHTML = `<h3>${minutesLabel} : ${secondsLabel}</h3>`;

        timer.append(timerContent);
    }
}
