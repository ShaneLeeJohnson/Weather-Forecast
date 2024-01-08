// Select DOM elements for weather display
const searchForm = document.querySelector('#search-form');
const cityInput = document.querySelector('#city');
const cityName = document.querySelector('#city-name');
const todaysDate = dayjs().format('MM/DD/YYYY');
const forecastContainer = document.querySelector('#forecast-container');
const currentDate = document.querySelector('#current-date');
const weatherIcon = document.querySelector('#weather-icon');
const currentTemp = document.querySelector('#current-temp');
const currentWind = document.querySelector('#current-wind');
const currentHumidity = document.querySelector('#current-humid');

// API Fetching Functions

// Fetch the latitude and longitude from the city that the user types in using the OpenWeatherMap Geocoding API
async function fetchGeocodeData(city) {
    const res = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=c146dbb949e3984d88cf4996c851d1ec`);
    const data = await res.json();
    return ({ lat: data[0].lat, lon: data[0].lon });
}

// Fetch the current weather data from OpenWeatherMap API
async function fetchCurrentWeatherData(lat, lon) {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=c146dbb949e3984d88cf4996c851d1ec`);
    return await res.json();
}

// Fetch the forecast data from OpenWeatherMap API
async function fetchForecastData(lat, lon) {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=c146dbb949e3984d88cf4996c851d1ec`);
    return await res.json();
}

// Data Display Functions

// Update the DOM elements with current weather data
function displayWeatherData(data) {
    cityName.textContent = data.name;
    currentDate.textContent = ` (${todaysDate})`;
    weatherIcon.innerHTML = `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather icon">`;
    currentTemp.textContent = `${data.main.temp} \u00B0F`;
    currentWind.textContent = `${data.wind.speed} MPH`;
    currentHumidity.textContent = `${data.main.humidity} %`;
}

// Function that adds each forecast day to the forecast container
function displayForecast(data) {
    // Filters forecast data for 6 AM timestamps
    const filteredData = data.list.filter(item => dayjs(item.dt_txt).format('HH:mm') === '06:00');
    forecastContainer.innerHTML = '';
    filteredData.forEach(dayData => {
        const forecastDay = createForecastDayElement(dayData);
        forecastContainer.appendChild(forecastDay);
    });
}

// Function that creates the DOM elements for the forecast day data
function createForecastDayElement(dayData) {
    const forecastDay = document.createElement('div');
    forecastDay.classList.add('forecast-day', 'col-12', 'col-lg-2');

    // creates a p tag that stores the formatted date of the forecast data
    const dateElement = document.createElement('p');
    dateElement.textContent = dayjs(dayData.dt_txt).format('MM/DD/YYYY');

    // creates an img element for the forecast weather icon
    const iconElement = document.createElement('img');
    iconElement.classList.add('icon')
    let iconCode = dayData.weather[0].icon;
    // checks if the icon code is for night and changes it to use the day instead
    if (iconCode.endsWith('n')) {
        iconCode = iconCode.slice(0, -1) + 'd';
    }
    iconElement.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    iconElement.alt = 'Weather icon';

    // creates a p tag that stores the temp data
    const tempElement = document.createElement('p');
    tempElement.textContent = `Temp: ${dayData.main.temp} \u00B0F`;

    // creates a p tag that stores the wind data
    const windElement = document.createElement('p');
    windElement.textContent = `Wind: ${dayData.wind.speed} MPH`;

    // creates a p tag that stores the humidity data
    const humidityElement = document.createElement('p');
    humidityElement.textContent = `Humidity: ${dayData.main.humidity} %`;

    // appends each forecast DOM element to the forecast day div
    forecastDay.appendChild(dateElement);
    forecastDay.appendChild(iconElement);
    forecastDay.appendChild(tempElement);
    forecastDay.appendChild(windElement);
    forecastDay.appendChild(humidityElement);

    return forecastDay;
}
// City Button Function
// Creates a button for the city that the user types in and allows them to click it to see weather for that city again
function createCityButton(city) {
    const button = document.createElement('li');
    button.classList.add('city-button');
    button.textContent = city;
    button.addEventListener('click', () => {
        getWeatherForCity(city);
    });
    button.dataset.city = city;
    return button;
}

// Main Weather Fetching Function
async function getWeatherForCity(city) {
    try {
        const { lat, lon } = await fetchGeocodeData(city);
        const currentWeatherData = await fetchCurrentWeatherData(lat, lon);
        const forecastData = await fetchForecastData(lat, lon);

        // calls the functions to display the current weather and forecast weather data
        displayWeatherData(currentWeatherData);
        displayForecast(forecastData);

        // gets the button data from local storage if it exists or creates an empty array
        const storedButtons = localStorage.getItem('cityButtons') || '[]';
        const cityButtonsArray = JSON.parse(storedButtons);
        // checks if the cityButtonsArray includes the city that the user typed in and if not,
        // creates a new city button for that city.
        if (!cityButtonsArray.includes(city)) {
            cityButtonsArray.push(city);
            localStorage.setItem('cityButtons', JSON.stringify(cityButtonsArray));
            const cityButtonsContainer = document.getElementById('recent-cities');
            cityButtonsContainer.appendChild(createCityButton(city));
        }
    } catch (error) {
        console.error('Error fetching weather:', error);
    }
}

// loads the city buttons list when the page is loaded
window.addEventListener('DOMContentLoaded', () => {
    const storedButtons = localStorage.getItem('cityButtons') || '[]';
    const cityButtonsArray = JSON.parse(storedButtons);

    cityButtonsArray.forEach(city => {
        const button = createCityButton(city);
        const cityButtonsContainer = document.getElementById('recent-cities');
        cityButtonsContainer.appendChild(button);
    });
});

// gets the value from the city that the user types in and calls the getWeatherForCity function.
// clears the city value from the text input so that the user can type in a new city.
searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const city = cityInput.value;
    await getWeatherForCity(city);
    cityInput.value = ''
});