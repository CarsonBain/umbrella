import './styles/index.scss';
import { settings } from './js/settings';

const proxy = 'https://cors-anywhere.herokuapp.com/';
const DSAPIkey = settings.DSAPIkey;
const GAPIkey = settings.GAPIkey;

const getPosition = () => {
  if (navigator.geolocation) {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  } else {
    alert('Uh oh, geolocation is not supported by this browser');
  }
};

getPosition()
  .then(location => {
    let { latitude, longitude } = location.coords;
    const DSAPIurl = `${proxy}https://api.darksky.net/forecast/${DSAPIkey}/${latitude},${longitude}?units=auto`;
    const GAPIurl = `${proxy}https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GAPIkey}`;
    const getDarkSky = fetch(DSAPIurl)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        document.querySelector('.currently span').innerHTML =
          data.minutely.summary;
        document.querySelector('.precip-prob span').innerHTML = `${
          data.currently.precipProbability
        }%`;
        document.querySelector(
          '.temperature'
        ).innerHTML = `${data.currently.temperature.toFixed(
          0
        )}<span class='wi wi-degrees'></span>`;
        let icon = 'wi wi-forecast-io-' + data.currently.icon;
        document.querySelector(
          '.icon'
        ).innerHTML = `<span class='${icon}'></span>`;
      });

    const getGoogle = fetch(GAPIurl)
      .then(response => response.json())
      .then(data => {
        document.querySelector('.city-name').innerHTML =
          data.results[7].formatted_address;
      });
    Promise.all([getDarkSky, getGoogle]).then(() => {
      document.querySelector('.loading').style.display = 'none';
    });
  })
  .catch(err => {
    console.error(err.message);
  });

// 🌃 Mode
const toggleInput = document.querySelector('#dark-toggle');

toggleInput.addEventListener('click', toggleDarkMode);

function toggleDarkMode() {
  if (toggleInput.checked) {
    //lights out
    document.querySelector('body').classList.add('dark');
  } else document.querySelector('body').classList.remove('dark');
}
//TODO: Save state of darkmode in localstorage
