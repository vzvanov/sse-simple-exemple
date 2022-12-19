
const timer = document.querySelector('.timer');
const timerYear = document.querySelector('.timer__year');

const eventSource = new EventSource('http://localhost:3000');
eventSource.addEventListener('timer', e => {
    const { year, days, hours, minutes, seconds } = JSON.parse(e.data);

    timerYear.textContent = year + 1;
    timer.textContent = `${numberToString(days, 3)}:${numberToString(hours)}:${numberToString(minutes)}:${numberToString(seconds)}`;

})

const numberToString = (num, length = 2) => {
    let str = Array(length).fill('0').join('') + String(num);
    return str.slice(-length);
}
