let totalTime, totalSeconds;
let isRunning = false;
let isPaused = false;
let isWorkout = true;
let startTime, nextSwitchTime;
let animationFrameId;

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

    totalTime = parseInt(totalTimeInput.value) * 60;
    totalSeconds = totalTime;

    isRunning = true;
    isPaused = false;
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    resetBtn.disabled = false;

    startTime = performance.now(); // High precision time tracking
    nextSwitchTime = startTime + 45000; // First interval switch at 45s

    requestAnimationFrame(updateTimer);
}

function updateTimer() {
    if (!isRunning) return;

    const now = performance.now();
    const elapsed = Math.floor((now - startTime) / 1000); // More precise than `Date.now()`
    let remaining = totalSeconds - elapsed;

    if (remaining <= 0) {
        stopTimer();
        return;
    }

    timerDisplay.textContent = formatTime(remaining);

    // Check if it's time to switch
    if (now >= nextSwitchTime) {
        isWorkout = !isWorkout;
        nextSwitchTime = now + (isWorkout ? 45000 : 15000); // Reset switch time

        playBeep(isWorkout ? 2 : 1);
        document.body.style.backgroundColor = isWorkout ? "#4CAF50" : "#FF5733";
    }

    // Update the interval display
    let intervalRemaining = Math.ceil((nextSwitchTime - now) / 1000);
    intervalDisplay.textContent = formatTime(intervalRemaining);

    // Use requestAnimationFrame for ultra-precise updates
    animationFrameId = requestAnimationFrame(updateTimer);
}

function pauseTimer() {
    if (!isRunning) return;

    if (isPaused) {
        startTime += performance.now() - nextSwitchTime + (isWorkout ? 45000 : 15000);
        nextSwitchTime = performance.now() + (isWorkout ? 45000 : 15000);
        requestAnimationFrame(updateTimer);
        pauseBtn.textContent = "Pause";
    } else {
        cancelAnimationFrame(animationFrameId);
        pauseBtn.textContent = "Resume";
    }

    isPaused = !isPaused;
}

function stopTimer() {
    cancelAnimationFrame(animationFrameId);
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
        oscillator.frequency.setValueAtTime(1000, context.currentTime);
        oscillator.connect(context.destination);
        oscillator.start();
        oscillator.stop(context.currentTime + 0.2);
    }

    let count = 0;

    function beepLoop() {
        if (count < times) {
            beep();
            count++;
            setTimeout(beepLoop, 100);
        }
    }

    beepLoop();
}

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);