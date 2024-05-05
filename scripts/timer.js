let timerValue = 0;
let intervalId;
function startTimer() {
    intervalId = setInterval(() => {
        timerValue++;
        updateTimerDisplay();
    }, 1000); // Update timer every second (1000 milliseconds)
}
startTimer();
function resetTimer() {
    clearInterval(intervalId);
    timerValue = 0;
    updateTimerDisplay();
}
function updateTimerDisplay() {
    const hours = Math.floor(timerValue / 3600);
    const minutes = Math.floor((timerValue % 3600) / 60);
    const seconds = timerValue % 60;
    
    const formattedTime = 
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('clockPzn').textContent = formattedTime;
    document.getElementById('clockChemie').textContent = formattedTime;
}