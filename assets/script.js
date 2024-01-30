/* global cityRepository */

const APIKey = 'b1d2eae6a0a395f178e0b75365981fcc';
const baseURL = 'https://api.openweathermap.org';

const searchHistory = new Set();
const searchHistoryEl = $('#history');
const searchFormEl = $('#search-form');
let cityName;

const bootstrapModal = new bootstrap.Modal('#errorModal');

function City(name, country, latitude, longitude, currentWeather = null, fiveDayForecast = []) {
  this.id = name;
  this.country = country;
  this.latitude = latitude;
  this.longitude = longitude;
  this.currentWeather = currentWeather;
  this.fiveDayForecast = fiveDayForecast;
}

function displayModal(error) {
  $('.modal-body').text(`${error}`);
  bootstrapModal.show();
}

function handleLocationSearch() {
  return (event) => {
    event.preventDefault();
    const searchInput = $('#search-input').val().trim();

    if (searchInput === '') {
      displayModal('Please enter a location');
      return;
    }
    cityName = searchInput;
    handleRetrieveWeatherForecast();
  };
}
searchFormEl.on('click', '#search-button', handleLocationSearch());
