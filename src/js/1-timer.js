import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import immageUrl from '../public/bi_x-octagon.svg';

let userSelectedDate;
let counter = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    // console.log(selectedDates[0]);
    userSelectedDate = selectedDates[0];
    if (selectedDates[0] > Date.now()) {
      startBtn.disabled = false;
      startBtn.classList.remove('disabled');
      const estTime = userSelectedDate.getTime() - Date.now();

      days.textContent = addZero(convertMs(estTime).days);
      hours.textContent = addZero(convertMs(estTime).hours);
      minutes.textContent = addZero(convertMs(estTime).minutes);
      seconds.textContent = addZero(convertMs(estTime).seconds);
    } else {
      iziToast.show({
        message: 'Please choose a date in the future',
        messageColor: 'white',
        backgroundColor: 'red',
        iconUrl: immageUrl,
        position: 'topCenter',
      });
    }
  },
};

const inputElem = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('.start-btn');
const days = document.querySelector('.value[data-days]');
const hours = document.querySelector('.value[data-hours]');
const minutes = document.querySelector('.value[data-minutes]');
const seconds = document.querySelector('.value[data-seconds]');

startBtn.disabled = true;
startBtn.classList.add('disabled');

flatpickr(inputElem, options);

const onCounter = timeInt => {
  counter = setInterval(() => {
    inputElem.disabled = true;

    startBtn.disabled = true;
    startBtn.classList.add('disabled');

    timeInt -= 1000;

    if (timeInt < 0) {
      clearInterval(counter);
      inputElem.disabled = false;
      return;
    }

    days.textContent = addZero(convertMs(timeInt).days);
    hours.textContent = addZero(convertMs(timeInt).hours);
    minutes.textContent = addZero(convertMs(timeInt).minutes);
    seconds.textContent = addZero(convertMs(timeInt).seconds);
  }, 1000);
};

startBtn.addEventListener('click', () => {
  let allTime = userSelectedDate.getTime() - Date.now();
  onCounter(allTime);
});

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addZero(value) {
  return value.toString().padStart(2, '0');
}