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

async function fetchGeocodeData(city) {
    const res = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=c146dbb949e3984d88cf4996c851d1ec`);
    const data = await res.json();
    return ({ lat: data[0].lat, lon: data[0].lon });
}

async function fetchCurrentWeatherData(lat, lon) {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=c146dbb949e3984d88cf4996c851d1ec`);
    return await res.json();
}

async function fetchForecastData(lat, lon) {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=c146dbb949e3984d88cf4996c851d1ec`);
    return await res.json();
}

function displayWeatherData(data) {
    console.log(data)
    cityName.textContent = data.name;
    currentDate.textContent = ` (${todaysDate})`;
    weatherIcon.innerHTML = `<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather icon">`;
    currentTemp.textContent = `${data.main.temp} \u00B0F`;
    currentWind.textContent = `${data.wind.speed} MPH`;
    currentHumidity.textContent = `${data.main.humidity} %`;
}

function displayForecast(data) {
    const filteredData = data.list.filter(item => dayjs(item.dt_txt).format('HH:mm') === '06:00');
    forecastContainer.innerHTML = '';
    filteredData.forEach(dayData => {
        const forecastDay = createForecastDayElement(dayData);
        forecastContainer.appendChild(forecastDay);
    });
}

function createForecastDayElement(dayData) {
    const forecastDay = document.createElement('div');
    forecastDay.classList.add('forecast-day', 'col-12', 'col-lg-2');

    const dateElement = document.createElement('p');
    dateElement.textContent = dayjs(dayData.dt_txt).format('MM/DD/YYYY');

    const iconElement = document.createElement('img');
    iconElement.classList.add('icon')
    let iconCode = dayData.weather[0].icon;
    if (iconCode.endsWith('n')) {
        iconCode = iconCode.slice(0, -1) + 'd';
    }
    iconElement.src = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
    iconElement.alt = 'Weather icon';

    const tempElement = document.createElement('p');
    tempElement.textContent = `Temp: ${dayData.main.temp} \u00B0F`;

    const windElement = document.createElement('p');
    windElement.textContent = `Wind: ${dayData.wind.speed} MPH`;

    const humidityElement = document.createElement('p');
    humidityElement.textContent = `Humidity: ${dayData.main.humidity} %`;

    forecastDay.appendChild(dateElement);
    forecastDay.appendChild(iconElement);
    forecastDay.appendChild(tempElement);
    forecastDay.appendChild(windElement);
    forecastDay.appendChild(humidityElement);

    return forecastDay;
}

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

async function getWeatherForCity(city) {
    try {
        const { lat, lon } = await fetchGeocodeData(city);
        const currentWeatherData = await fetchCurrentWeatherData(lat, lon);
        const forecastData = await fetchForecastData(lat, lon);

        displayWeatherData(currentWeatherData);
        displayForecast(forecastData);

        const storedButtons = localStorage.getItem('cityButtons') || '[]';
        const cityButtonsArray = JSON.parse(storedButtons);
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

window.addEventListener('DOMContentLoaded', () => {
    const storedButtons = localStorage.getItem('cityButtons') || '[]';
    const cityButtonsArray = JSON.parse(storedButtons);

    cityButtonsArray.forEach(city => {
        const button = createCityButton(city);
        const cityButtonsContainer = document.getElementById('recent-cities');
        cityButtonsContainer.appendChild(button);
    });
});

searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const city = cityInput.value;
    await getWeatherForCity(city);
    cityInput.value = ''
});