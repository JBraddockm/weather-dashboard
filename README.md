# Skills Bootcamp Module 8 - Weather Dashboard

## Description

This challenge requires building a weather dashboard that will run in the browser and feature dynamically updated HTML and CSS by using the [5 Day Weather Forecast](https://openweathermap.org/forecast5) to retrieve weather data for cities.

The primary objectives include:

* Create a weather dashboard with form inputs.
    * When a user searches for a city they are presented with current and future conditions for that city and that city is added to the search history
    * When a user views the current weather conditions for that city they are presented with:
        * The city name
        * The date
        * An icon representation of weather conditions
        * The temperature
        * The humidity
        * The wind speed
    * When a user view future weather conditions for that city they are presented with a 5-day forecast that displays:
        * The date
        * An icon representation of weather conditions
        * The temperature
        * The humidity
    * When a user click on a city in the search history they are again presented with current and future conditions for that city

## Deployed Application

The following video shows the application's functionalities.

The deployed application is available at: [https://jbraddockm.github.io/weather-dashboard/](https://jbraddockm.github.io/weather-dashboard/)

## Table of Contents
* [Installation](#installation)
* [Usage](#usage)
* [Features](#features)
* [Limitations](#Limitations)
* [Credit](#credit)
* [License](#license)
## Installation
N/A
## Usage
Visit [https://jbraddockm.github.io/weather-dashboard/](https://jbraddockm.github.io/weather-dashboard/), enter a location.
* For accurate location geocoding, use `location, country` such as "Birmingham, UK".
## Features
* Renders DOM dynamically with location data
* Uses a single map object to save items to localStorage
* Shows Bootstrap modal to display error messages
* Console log network error messages
* Uses Dayjs
* Uses Bootstrap 5
* Primarily uses jQuery
## Limitations
* OpenWeather's Geocoding API return status 200 even if a location does not exist. It is difficult to handle errors. The app is using another API to geoCode locations.
* OpenWeather API does not include any ID for locations. For simplicity, the app does not handle multiple locations with the same name.
* Day/Timestamp weather forecast is not available in free tier. The app uses a list of data and picks 12:00 forecast by default or any other value for the last date.
## Credit
## License
Please refer to the LICENSE in the repo.