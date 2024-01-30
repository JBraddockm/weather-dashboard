/* global cityRepository */

const APIKey = 'b1d2eae6a0a395f178e0b75365981fcc';
const baseURL = 'https://api.openweathermap.org';

const searchHistory = new Set();
const searchHistoryEl = $('#history');
const searchFormEl = $('#search-form');
let cityName;