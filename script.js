const searchForm = document.querySelector('#search-form');
const cityInput = document.querySelector('#city');
const cityName = document.querySelector('#city-name')
const todaysDate = dayjs().format('MM/DD/YYYY');

searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const city = cityInput.value;

    const getCurrentWeather = async () => {
        try {
            const res = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=c146dbb949e3984d88cf4996c851d1ec`);
            const data = await res.json();
            const lat = data[0].lat;
            const lon = data[0].lon;

            const res2 = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=c146dbb949e3984d88cf4996c851d1ec`);
            const data2 = await res2.json();
            console.log(data2);

            cityName.textContent = data2.name;

            const currentDate = document.querySelector('#current-date');
            currentDate.textContent = ` (${todaysDate})`;

            const weatherIcon = document.querySelector('#weather-icon');
            const iconCode = data2.weather[0].icon;
            const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
            weatherIcon.innerHTML = `<img src="${iconUrl}" alt="Weather icon">`;

            const currentTemp = document.querySelector('#current-temp');
            currentTemp.textContent = `${data2.main.temp} \u00B0F`;

            const currentWind = document.querySelector('#current-wind');
            currentWind.textContent = `${data2.wind.speed} MPH`;

            const currentHumidity = document.querySelector('#current-humid');
            currentHumidity.textContent = `${data2.main.humidity} %`;


        } catch (e) {
            console.log('Error!!!', e);
        }
    }

    getCurrentWeather();

})



