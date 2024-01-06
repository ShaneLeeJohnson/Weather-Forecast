const searchForm = document.querySelector('#search-form');
const cityInput = document.querySelector('#city');
const cityName = document.querySelector('#city-name');
const todaysDate = dayjs().format('MM/DD/YYYY');
const forecastContainer = document.querySelector('#forecast-container');

searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const city = cityInput.value;

    const getCurrentWeather = async () => {
        try {
            const geoCodeRes = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=c146dbb949e3984d88cf4996c851d1ec`);
            const geoCodeData = await geoCodeRes.json();
            const lat = geoCodeData[0].lat;
            const lon = geoCodeData[0].lon;

            const currentWeatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=c146dbb949e3984d88cf4996c851d1ec`);
            const currentWeatherData = await currentWeatherRes.json();
            console.log(currentWeatherData);

            cityName.textContent = currentWeatherData.name;

            const currentDate = document.querySelector('#current-date');
            currentDate.textContent = ` (${todaysDate})`;

            const weatherIcon = document.querySelector('#weather-icon');
            const iconCode = currentWeatherData.weather[0].icon;
            const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
            weatherIcon.innerHTML = `<img src="${iconUrl}" alt="Weather icon">`;

            const currentTemp = document.querySelector('#current-temp');
            currentTemp.textContent = `${currentWeatherData.main.temp} \u00B0F`;

            const currentWind = document.querySelector('#current-wind');
            currentWind.textContent = `${currentWeatherData.wind.speed} MPH`;

            const currentHumidity = document.querySelector('#current-humid');
            currentHumidity.textContent = `${currentWeatherData.main.humidity} %`;

            const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=c146dbb949e3984d88cf4996c851d1ec`);
            const forecastData = await forecastRes.json();

            const filteredData = [];

            for (const item of forecastData.list) {
                const time = dayjs(item.dt_txt).format('HH:mm');

                if (time === '06:00') {
                    filteredData.push(item);
                }
            }

            console.log(filteredData);

            for (let i = 0; i < 5; i++) {
                const dayData = filteredData[i];

                const forecastDay = document.createElement('div');
                forecastDay.classList.add('forecast-day');
                forecastDay.classList.add('col');

                const dateElement = document.createElement('p');
                dateElement.textContent = dayjs(dayData.dt_txt).format('MM/DD/YYYY');

                const iconElement = document.createElement('img');
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

                forecastContainer.appendChild(forecastDay);
            }


        } catch (e) {
            console.log('Error!!!', e);
        }
    }

    getCurrentWeather();

})