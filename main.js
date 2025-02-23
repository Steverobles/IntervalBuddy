let totalTime, totalSeconds, intervalTimer;
let isRunning = false;
let isPaused = false;
let currentInterval = 45; // Start with workout phase
let isWorkout = true;

const totalTimeInput = document.getElementById('total-time');
const timerDisplay = document.getElementById('timer-display');
const intervalDisplay = document.getElementById('interval-display');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');

function formatTime(seconds) {
    let min = Math.floor(seconds / 60);
    let sec = seconds % 60;
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

function startTimer() {
    if (isRunning) return;

    totalTime = parseInt(totalTimeInput.value) * 60; // Convert minutes to seconds
    totalSeconds = totalTime;
    
    isRunning = true;
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    resetBtn.disabled = false;

    intervalTimer = setInterval(updateTimer, 1000);
}

function updateTimer() {
    if (totalSeconds <= 0) {
        stopTimer();
        return;
    }

    totalSeconds--;
    timerDisplay.textContent = formatTime(totalSeconds);
    
    if (currentInterval === 0) {
        switchPhase();
    } else {
        currentInterval--;
        intervalDisplay.textContent = formatTime(currentInterval);
    }
}

function switchPhase() {
    isWorkout = !isWorkout;
    currentInterval = isWorkout ? 45 : 15;
    
    document.body.style.backgroundColor = isWorkout ? "#4CAF50" : "#FF5733";
    
    intervalDisplay.textContent = formatTime(currentInterval);
    
    playBeep(isWorkout ? 2 : 1);
}

function pauseTimer() {
    if (!isRunning) return;

    if (isPaused) {
        intervalTimer = setInterval(updateTimer, 1000);
        pauseBtn.textContent = "Pause";
    } else {
        clearInterval(intervalTimer);
        pauseBtn.textContent = "Resume";
    }
    
    isPaused = !isPaused;
}

function stopTimer() {
    clearInterval(intervalTimer);
    isRunning = false;
    isPaused = false;
    
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    resetBtn.disabled = true;
    
    timerDisplay.textContent = "00:00";
    intervalDisplay.textContent = "00:00";
    document.body.style.backgroundColor = "#f4f4f4";
}

function resetTimer() {
    stopTimer();
    totalTimeInput.value = 20;
}

function playBeep(times) {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    
    function beep() {
        const oscillator = context.createOscillator();
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(1000, context.currentTime); // 1000 Hz beep sound
        oscillator.connect(context.destination);
        oscillator.start();
        oscillator.stop(context.currentTime + 0.2); // 200ms beep
    }

    let count = 0;

    function beepLoop() {
        if (count < times) {
            beep();
            count++;
            setTimeout(beepLoop, 500); // 500ms delay between beeps
        }
    }

    beepLoop();
}

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);