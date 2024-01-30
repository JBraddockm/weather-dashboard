/* global cityRepository, capitaliseFirstLetter */

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

function handleSearchHistory(searchInput) {
  if (!searchHistory.has(searchInput)) {
    searchHistory.add(searchInput);
    $('#search-input').val('');
  }

  searchHistoryEl.empty();
  cityRepository.findAll().forEach((element) => {
    $('<button>')
      .addClass('btn btn-secondary location-button')
      .text(element.id)
      .attr('data-location', element.id)
      .appendTo('#history');
  });
}

handleSearchHistory();

function displayCurrentWeather(city) {
  $('.today').removeClass('d-none');
  $('#today .city').text(`${city.id} - ${dayjs(city.dt_txt).format('DD/MM/YYYY')} `);
  $('#today .country').text(`${city.country}`);
  $('#today .temperature').text(`${city.currentWeather.main.temp.toFixed(1)}°C`);
  $('#today .description').text(capitaliseFirstLetter(`${city.currentWeather.weather[0].description}`));
  $('#today .wind-speed').text(`${city.currentWeather.wind.speed.toFixed(1)}km/h`);
  $('#today .humidity').text(`${city.currentWeather.main.humidity}%`);
  $('#today .feels-like').text(`${city.currentWeather.main.feels_like.toFixed(1)}°C`);
  $('#today .weather-icon').attr('src', (`https://openweathermap.org/img/wn/${city.currentWeather.weather[0].icon}@2x.png`));
  $('#today .weather-icon').attr('alt', (capitaliseFirstLetter(`${city.currentWeather.weather[0].description}`)));
}
function displayWeatherForecast(city) {
  const originalForeCastBlockEl = $('.forecast[data-placeholder="forecast"]');
  const foreCastBlockElCopy = originalForeCastBlockEl.clone().removeAttr('data-placeholder').removeClass('d-none');

  $('.forecast').not('[data-placeholder="forecast"]').remove();

  city.fiveDayForecast.forEach((element) => {
    const foreCastBlockEl = foreCastBlockElCopy.clone();

    foreCastBlockEl.find('.temperature').text(`${element.main.temp.toFixed(1)}°C`);
    foreCastBlockEl.find('.forecast-date').text(dayjs(element.dt_txt).format('DD/MM/YYYY'));
    foreCastBlockEl.find('.description').text(capitaliseFirstLetter(`${element.weather[0].description}`));
    foreCastBlockEl.find('.wind-speed').text(`${element.wind.speed.toFixed(1)}km/h`);
    foreCastBlockEl.find('.humidity').text(`${element.main.humidity}%`);
    foreCastBlockEl.find('.feels-like').text(`${element.main.feels_like.toFixed(1)}°C`);
    foreCastBlockEl.find('.weather-icon').attr('src', (`https://openweathermap.org/img/wn/${element.weather[0].icon}@2x.png`));
    foreCastBlockEl.find('.weather-icon').attr('alt', (capitaliseFirstLetter(`${element.weather[0].description}`)));

    foreCastBlockEl.insertBefore(originalForeCastBlockEl);
  });
}

function fetchGeoCodingRequest(city, callback) {
  // Make the API request
  return fetch(`${baseURL}/data/2.5/weather?q=${city}&appid=${APIKey}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Location cannot be found.');
      }
      return response.json();
    })
    .then((data) => callback(data))
    .catch((error) => {
      displayModal(error);
    });
}

function handleGeoCodingData(data) {
  const city = new City(
    data.name,
    data.sys.country,
    data.coord.lat,
    data.coord.lon,
  );
  cityRepository.saveCity(city);
  return city;
}

function handleFiveDayForecastData(city) {
  fetch(`${baseURL}/data/2.5/forecast?lat=-${city.latitude}&lon=${city.longitude}&units=metric&appid=${APIKey}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      /* data.list is an array containing weather information.
        * Assigns data.list[0] to a new currentWeather variable,
        * Removes it from the array and return the remaining array to new weatherData variable.
        * */

      const [currentWeather, ...weatherData] = data.list;

      // Assigns the first element of weatherData to city.currentWeather.
      city.currentWeather = currentWeather;

      /* Filters weatherData and checks for 12 as hour in array.
        * If it is the last element, picks the latest available data.
        */

      const uniqueDates = new Set();

      weatherData.filter((element, index) => dayjs(element.dt_txt).format('HH') === '12' || index === weatherData.length - 1)
        .forEach((element) => {
          const date = dayjs(element.dt_txt).format('DD/MM/YYYY');

          // Check if the date has not been encountered before
          if (!uniqueDates.has(date)) {
            uniqueDates.add(date);

            // Add the element to the forecast array
            city.fiveDayForecast.push(element);
          }
        });
      // Saves city object.
      cityRepository.saveCity(city);

      displayCurrentWeather(city);
      displayWeatherForecast(city);
    })
    .catch((error) => {
      console.error(error);
    });
}

function handleRetrieveWeatherForecast() {
  fetchGeoCodingRequest(cityName, handleGeoCodingData)
    .then((geoData) => {
      // Check if geoData is valid before proceeding
      if (geoData) {
        handleFiveDayForecastData(geoData);
        handleSearchHistory(cityName);
      } else {
        throw new Error('Failed to retrieve geocoding data.');
      }
    })
    .catch((error) => {
      console.error(error);
    });
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

function handleLocationHistoryClick() {
  return (event) => {
    cityName = $(event.target).attr('data-location');
    handleRetrieveWeatherForecast();
  };
}

searchHistoryEl.on('click', 'button', handleLocationHistoryClick());
